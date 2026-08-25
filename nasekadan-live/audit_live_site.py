#!/usr/bin/env python3
from __future__ import annotations

import concurrent.futures as cf
import datetime as dt
import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

BASE = "https://nasekadan.cz"
UA = "NaseKadanLiveAudit/1.0"
TIMEOUT = 25
WORKERS = 12


def norm(url: str, base: str = BASE + "/") -> str:
    absolute = urllib.parse.urljoin(base, html.unescape(url.strip()))
    p = urllib.parse.urlsplit(absolute)
    host = p.netloc.lower().split(":", 1)[0]
    if host == "www.nasekadan.cz":
        host = "nasekadan.cz"
    path = re.sub(r"/{2,}", "/", p.path or "/")
    return urllib.parse.urlunsplit(("https", host, path, "", ""))


def internal(url: str) -> bool:
    try:
        return urllib.parse.urlsplit(norm(url)).netloc == "nasekadan.cz"
    except Exception:
        return False


def fetch(url: str, binary: bool = False) -> tuple[int, str, bytes | str, dict[str, str]]:
    stamp = int(dt.datetime.now(dt.timezone.utc).timestamp())
    sep = "&" if "?" in url else "?"
    req = urllib.request.Request(
        url + sep + "nk_audit=" + str(stamp),
        headers={"User-Agent": UA, "Cache-Control": "no-cache"},
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        status = getattr(r, "status", None) or r.getcode()
        raw = r.read()
        final = r.geturl()
        headers = {k.lower(): v for k, v in r.headers.items()}
    return status, final, raw if binary else raw.decode("utf-8", "replace"), headers


def xml_locs(text: str) -> list[str]:
    root = ET.fromstring(text)
    out = []
    for node in root.iter():
        if node.tag.endswith("loc") and node.text:
            u = norm(node.text)
            if internal(u):
                out.append(u)
    return out


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", value, flags=re.S))).strip()


def attr(tag: str, name: str) -> str | None:
    m = re.search(rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
    return html.unescape(m.group(2)).strip() if m else None


def canonical(body: str, page_url: str) -> str | None:
    for tag in re.findall(r"<link\b[^>]*>", body, re.I | re.S):
        rel = (attr(tag, "rel") or "").lower()
        if "canonical" in rel:
            href = attr(tag, "href")
            return norm(href, page_url) if href else None
    return None


def meta(body: str, key: str) -> str | None:
    for tag in re.findall(r"<meta\b[^>]*>", body, re.I | re.S):
        k = attr(tag, "property") or attr(tag, "name")
        if (k or "").lower() == key.lower():
            return attr(tag, "content")
    return None


def title_figures(body: str, page_url: str) -> list[dict]:
    result = []
    for fig in re.findall(r"<figure\b[^>]*class=([\"'])[^\"']*\barticle-figure\b[^\"']*\1[^>]*>.*?</figure>", body, re.I | re.S):
        pass
    # Python re returns only captured quote above; use second pattern without capture.
    for m in re.finditer(r"<figure\b[^>]*class=[\"'][^\"']*\barticle-figure\b[^\"']*[\"'][^>]*>.*?</figure>", body, re.I | re.S):
        block = m.group(0)
        im = re.search(r"<img\b[^>]*>", block, re.I | re.S)
        if not im:
            continue
        src = attr(im.group(0), "src")
        if not src:
            continue
        srcn = norm(src, page_url)
        width = attr(im.group(0), "width")
        height = attr(im.group(0), "height")
        low = block.lower()
        is_title = (
            urllib.parse.urlsplit(srcn).path.startswith("/social/")
            and (
                (width == "1200" and height == "630")
                or "redakční grafika" in low
                or "titulní grafika" in low
                or "data-nk-title-figure" in low
                or "article-photo" in low
            )
        )
        if is_title:
            result.append({"src": srcn, "html": block[:700]})
    return result


def image_refs(body: str, page_url: str) -> list[str]:
    out = []
    for tag in re.findall(r"<img\b[^>]*>", body, re.I | re.S):
        src = attr(tag, "src")
        if src:
            u = norm(src, page_url)
            if internal(u):
                out.append(u)
    return out


def href_refs(body: str, page_url: str) -> list[str]:
    out = []
    for tag in re.findall(r"<a\b[^>]*>", body, re.I | re.S):
        href = attr(tag, "href")
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        u = norm(href, page_url)
        if internal(u):
            out.append(u)
    return out


def date_published(body: str) -> str | None:
    value = meta(body, "article:published_time")
    if value:
        return value
    m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', body)
    return m.group(1) if m else None


def check_page(url: str) -> dict:
    item = {"url": url, "errors": [], "warnings": []}
    try:
        status, final, body, headers = fetch(url)
    except Exception as exc:
        item["errors"].append({"type": "http_fetch_failed", "error": repr(exc)})
        return item
    item["status"] = status
    item["final_url"] = norm(final)
    item["cache_control"] = headers.get("cache-control")
    if status != 200:
        item["errors"].append({"type": "http_status", "status": status})
        return item
    if "text/html" not in headers.get("content-type", "") and not url.endswith("/"):
        return item

    can = canonical(body, url)
    item["canonical"] = can
    if can and can != norm(url):
        item["errors"].append({"type": "canonical_mismatch", "canonical": can})

    h1m = re.search(r"<h1\b[^>]*>(.*?)</h1>", body, re.I | re.S)
    h1 = clean_text(h1m.group(1)) if h1m else ""
    item["h1"] = h1

    is_article = "/clanky/" in urllib.parse.urlsplit(url).path and not re.search(r"/clanky/(?:strana-\d+\.html)?$", urllib.parse.urlsplit(url).path)
    if is_article:
        if not h1:
            item["errors"].append({"type": "missing_h1"})
        if "NewsArticle" not in body and '"@type":"Article"' not in body:
            item["warnings"].append({"type": "missing_newsarticle_schema"})
        og = meta(body, "og:image")
        ogn = norm(og, url) if og else None
        item["og_image"] = ogn
        figs = title_figures(body, url)
        item["title_figures"] = figs
        if len(figs) == 0:
            item["errors"].append({"type": "missing_visible_title_figure"})
        if len(figs) > 1:
            item["errors"].append({"type": "duplicate_title_figures", "count": len(figs), "sources": [f["src"] for f in figs]})
        if ogn and figs and all(f["src"] != ogn for f in figs):
            item["warnings"].append({"type": "og_visible_figure_mismatch", "og": ogn, "figures": [f["src"] for f in figs]})
        src_counts = Counter(image_refs(body, url))
        dup_src = [src for src, count in src_counts.items() if count > 1]
        if dup_src:
            item["warnings"].append({"type": "duplicate_image_src", "sources": dup_src})
        item["published"] = date_published(body)

    item["images"] = image_refs(body, url)
    item["hrefs"] = href_refs(body, url)
    if "<header" in body and 'data-site-header="v1"' not in body and is_article:
        item["warnings"].append({"type": "nonstandard_header"})
    if "<footer" in body and 'data-site-footer="v1"' not in body and is_article:
        item["warnings"].append({"type": "nonstandard_footer"})
    return item


def check_binary(url: str) -> dict:
    try:
        status, final, raw, headers = fetch(url, binary=True)
        return {"url": url, "ok": status == 200 and len(raw) > 0, "status": status, "bytes": len(raw), "content_type": headers.get("content-type")}
    except Exception as exc:
        return {"url": url, "ok": False, "error": repr(exc)}


def main() -> int:
    report = {
        "version": "20260825-1",
        "started_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "status": "RUNNING",
        "errors": [],
        "warnings": [],
    }
    try:
        _, _, sitemap_text, _ = fetch(BASE + "/sitemap.xml")
        sitemap_urls = xml_locs(sitemap_text)
    except Exception as exc:
        report["status"] = "FAILED"
        report["errors"].append({"type": "sitemap_fetch_failed", "error": repr(exc)})
        Path("nasekadan-live/live-audit-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return 1

    seed = [BASE + "/", BASE + "/clanky/", BASE + "/rss.xml", BASE + "/news-sitemap.xml"]
    html_urls = []
    for u in sitemap_urls + seed:
        p = urllib.parse.urlsplit(u).path
        if p.endswith((".xml", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".pdf", ".json", ".js", ".css")):
            continue
        if u not in html_urls:
            html_urls.append(u)

    page_results = []
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(check_page, u): u for u in html_urls}
        for fut in cf.as_completed(futures):
            page_results.append(fut.result())

    page_results.sort(key=lambda x: x["url"])
    image_urls = sorted({img for item in page_results for img in item.get("images", [])})
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        image_results = list(ex.map(check_binary, image_urls))
    broken_images = [x for x in image_results if not x.get("ok")]

    internal_hrefs = sorted({h for item in page_results for h in item.get("hrefs", [])})
    # Limit link validation to HTML-like internal targets; static assets are covered as images.
    link_targets = [u for u in internal_hrefs if not urllib.parse.urlsplit(u).path.endswith((".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".css", ".js", ".xml", ".json", ".pdf"))]
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        link_results = list(ex.map(check_binary, link_targets))
    broken_links = [x for x in link_results if not x.get("ok")]

    # Archive/RSS membership for every sitemap article.
    try:
        _, _, archive0, _ = fetch(BASE + "/clanky/")
        archive_all = archive0
        pages = sorted({int(x) for x in re.findall(r"/clanky/strana-(\d+)\.html", archive0)})
        for n in pages:
            _, _, b, _ = fetch(f"{BASE}/clanky/strana-{n}.html")
            archive_all += "\n" + b
    except Exception as exc:
        archive_all = ""
        report["errors"].append({"type": "archive_fetch_failed", "error": repr(exc)})
    try:
        _, _, rss, _ = fetch(BASE + "/rss.xml")
    except Exception as exc:
        rss = ""
        report["errors"].append({"type": "rss_fetch_failed", "error": repr(exc)})

    article_urls = [u for u in sitemap_urls if "/clanky/" in urllib.parse.urlsplit(u).path and not re.search(r"/clanky/(?:strana-\d+\.html)?$", urllib.parse.urlsplit(u).path)]
    missing_archive = [u for u in article_urls if urllib.parse.urlsplit(u).path.split("/")[-1] not in archive_all]
    missing_rss = [u for u in article_urls if u not in rss]

    # Compare newest published article with homepage linking.
    dated = []
    for item in page_results:
        if item.get("published") and "/clanky/" in item["url"]:
            try:
                d = dt.datetime.fromisoformat(item["published"].replace("Z", "+00:00"))
                if d.tzinfo is None:
                    d = d.replace(tzinfo=dt.timezone.utc)
                dated.append((d.astimezone(dt.timezone.utc), item["url"], item.get("h1")))
            except Exception:
                pass
    dated.sort(reverse=True)
    newest = dated[0] if dated else None
    try:
        _, _, home, _ = fetch(BASE + "/")
    except Exception:
        home = ""
    if newest and urllib.parse.urlsplit(newest[1]).path not in home:
        report["errors"].append({"type": "newest_article_missing_from_homepage", "url": newest[1], "title": newest[2], "published": newest[0].isoformat()})

    for item in page_results:
        for err in item.get("errors", []):
            report["errors"].append({"url": item["url"], **err})
        for warn in item.get("warnings", []):
            report["warnings"].append({"url": item["url"], **warn})
    for item in broken_images:
        report["errors"].append({"type": "broken_image", **item})
    for item in broken_links:
        report["errors"].append({"type": "broken_internal_link", **item})
    if missing_archive:
        report["errors"].append({"type": "articles_missing_from_archive", "urls": missing_archive})
    if missing_rss:
        report["warnings"].append({"type": "articles_missing_from_rss", "urls": missing_rss})

    report.update({
        "finished_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "sitemap_urls": len(sitemap_urls),
        "html_pages_checked": len(page_results),
        "article_pages_checked": len(article_urls),
        "images_checked": len(image_results),
        "internal_links_checked": len(link_results),
        "page_results": page_results,
        "broken_images": broken_images,
        "broken_links": broken_links,
        "missing_archive": missing_archive,
        "missing_rss": missing_rss,
        "newest_article": {"published": newest[0].isoformat(), "url": newest[1], "title": newest[2]} if newest else None,
    })
    report["status"] = "PASSED" if not report["errors"] else "FAILED"
    Path("nasekadan-live/live-audit-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("status", "sitemap_urls", "html_pages_checked", "article_pages_checked", "images_checked", "internal_links_checked")}, ensure_ascii=False, indent=2))
    print("errors", len(report["errors"]), "warnings", len(report["warnings"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
