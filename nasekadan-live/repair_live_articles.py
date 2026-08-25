#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import hashlib
import html
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://nasekadan.cz"
RAW_BASE = "https://raw.githubusercontent.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin/main/nasekadan-live/files/clanky/"
UA = "NaseKadanLiveRepair/1.2"
REPORT = Path("nasekadan-live/live-audit-report.json")
OUT = Path("nasekadan-live/files/clanky")
MANIFEST = Path("nasekadan-live/manifest.json")


def fetch(url: str) -> str:
    stamp = int(dt.datetime.now(dt.timezone.utc).timestamp())
    req = urllib.request.Request(url + ("&" if "?" in url else "?") + f"nk_repair={stamp}", headers={"User-Agent": UA, "Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=30) as r:
        if (getattr(r, "status", None) or r.getcode()) != 200:
            raise RuntimeError(f"HTTP {r.getcode()} {url}")
        return r.read().decode("utf-8", "replace")


def attr(tag: str, name: str) -> str | None:
    m = re.search(rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
    return html.unescape(m.group(2)).strip() if m else None


def meta(body: str, key: str) -> str | None:
    for tag in re.findall(r"<meta\b[^>]*>", body, re.I | re.S):
        k = attr(tag, "property") or attr(tag, "name")
        if (k or "").lower() == key.lower():
            return attr(tag, "content")
    return None


def clean_h1(body: str) -> str:
    m = re.search(r"<h1\b[^>]*>(.*?)</h1>", body, re.I | re.S)
    if not m:
        return "Naše Kadaň"
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(1), flags=re.S))).strip()


def norm_img(url: str) -> str:
    p = urllib.parse.urlsplit(urllib.parse.urljoin(BASE + "/", html.unescape(url)))
    host = p.netloc.lower().split(":", 1)[0]
    if host not in {"nasekadan.cz", "www.nasekadan.cz"}:
        raise ValueError(f"externí obrázek {url}")
    return p.path


def is_title_img(tag: str) -> bool:
    src = attr(tag, "src") or ""
    try:
        path = norm_img(src)
    except Exception:
        return False
    if not path.startswith("/social/"):
        return False
    low = tag.lower()
    w = attr(tag, "width")
    h = attr(tag, "height")
    cls = (attr(tag, "class") or "").lower()
    alt = (attr(tag, "alt") or "").lower()
    return (
        (w == "1200" and h == "630")
        or "hero-image" in cls
        or "article-photo" in cls
        or "redakční grafika" in alt
        or "titulní grafika" in alt
    )


def is_title_figure(block: str) -> bool:
    im = re.search(r"<img\b[^>]*>", block, re.I | re.S)
    if not im:
        return False
    low = block.lower()
    return is_title_img(im.group(0)) or "data-nk-title-figure" in low


def figure_markup(src: str, title: str) -> str:
    return (
        '\n<figure class="article-figure" data-nk-title-figure="1">'
        f'<img class="article-photo" src="{html.escape(src, quote=True)}" width="1200" height="630" '
        f'alt="Redakční grafika Naše Kadaň k článku {html.escape(title, quote=True)}" fetchpriority="high" decoding="async">'
        '<figcaption>Redakční grafika Naše Kadaň.</figcaption></figure>\n'
    )


def remove_old_title_art(body: str) -> str:
    # 1) Odstranit staré titulní <figure class=article-figure>.
    figure_pattern = re.compile(r"<figure\b[^>]*class=[\"'][^\"']*\barticle-figure\b[^\"']*[\"'][^>]*>.*?</figure>", re.I | re.S)
    parts: list[str] = []
    cursor = 0
    for m in figure_pattern.finditer(body):
        parts.append(body[cursor:m.start()])
        block = m.group(0)
        if not is_title_figure(block):
            parts.append(block)
        cursor = m.end()
    parts.append(body[cursor:])
    body = "".join(parts)

    # 2) Starší články často mají titulní grafiku jako samostatný <img class=hero-image>
    # bez <figure>. Po serverové normalizaci pak zůstávala pod novou figurou jako
    # druhá nebo dokonce rozbitá grafika. Odstraňujeme pouze lokální /social/ titulní
    # obrázky; dokumentačních fotografií a obrázků mimo /social/ se nedotýkáme.
    img_pattern = re.compile(r"<img\b[^>]*>", re.I | re.S)
    body = img_pattern.sub(lambda m: "" if is_title_img(m.group(0)) else m.group(0), body)
    return body


def repair(body: str, url: str) -> str:
    og = meta(body, "og:image")
    if not og:
        raise RuntimeError(f"{url}: chybí og:image")
    og_path = norm_img(og)
    if not og_path.startswith("/social/"):
        raise RuntimeError(f"{url}: og:image není /social/: {og_path}")

    body = remove_old_title_art(body)

    # Standardní i historická článková šablona. Pokud article nemá class="article",
    # použijeme jediný obecný <article> bez změny jeho layoutu.
    article = re.search(r'<article\b[^>]*class=["\'][^"\']*\barticle\b[^"\']*["\'][^>]*>', body, re.I)
    if not article:
        article = re.search(r"<article\b[^>]*>", body, re.I)
    if not article:
        raise RuntimeError(f"{url}: nenalezen <article>")

    start = article.end()
    tail = body[start:]
    lead = re.search(r'<p\b[^>]*class=["\'][^"\']*\b(?:lead|leadtext)\b[^"\']*["\'][^>]*>.*?</p>', tail, re.I | re.S)
    if lead:
        at = start + lead.end()
    else:
        h1 = re.search(r"<h1\b[^>]*>.*?</h1>", tail, re.I | re.S)
        at = start + h1.end() if h1 else start
    body = body[:at] + figure_markup(og_path, clean_h1(body)) + body[at:]

    if not re.search(r"\.article-figure\b", body):
        css = '<style data-nk-title-figure-css="1">.article-figure{margin:28px 0 30px}.article-figure img{display:block;width:100%;height:auto;border-radius:20px}.article-figure figcaption{font-size:13px;color:#61717a;margin-top:9px}</style>\n'
        body = body.replace("</head>", css + "</head>", 1)

    body = body.replace('href="/akce/"', 'href="/#akce"').replace("href='/akce/'", "href='/#akce'")
    body = body.replace('href="https://nasekadan.cz/akce/"', 'href="https://nasekadan.cz/#akce"')
    body = body.replace('href="https://www.nasekadan.cz/akce/"', 'href="https://nasekadan.cz/#akce"')

    figure_pattern = re.compile(r"<figure\b[^>]*class=[\"'][^\"']*\barticle-figure\b[^\"']*[\"'][^>]*>.*?</figure>", re.I | re.S)
    title_blocks = [m.group(0) for m in figure_pattern.finditer(body) if is_title_figure(m.group(0))]
    if len(title_blocks) != 1:
        raise RuntimeError(f"{url}: po opravě počet titulních figur {len(title_blocks)}")
    if og_path not in title_blocks[0]:
        raise RuntimeError(f"{url}: finální figura neodpovídá og:image")
    # Po normalizaci nesmí mimo jedinou figuru zůstat další titulní /social/ img.
    without_figure = figure_pattern.sub("", body)
    leftovers = [m.group(0) for m in re.finditer(r"<img\b[^>]*>", without_figure, re.I | re.S) if is_title_img(m.group(0))]
    if leftovers:
        raise RuntimeError(f"{url}: po opravě zůstalo {len(leftovers)} starých titulních img")
    return body


def main() -> int:
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    # Projít všechny skutečné článkové stránky z posledního živého auditu, ne jen
    # ty, které už audit označil jako missing/duplicate. Tím zachytíme i kombinaci
    # „nová figura + starý rozbitý hero-image“ (např. ODS).
    targets: set[str] = set()
    for page in report.get("page_results", []):
        url = str(page.get("url", ""))
        if "/clanky/" in url and page.get("published") and url.endswith(".html"):
            targets.add(url)
    for e in report.get("errors", []):
        if e.get("type") in {"missing_visible_title_figure", "duplicate_title_figures"} and "/clanky/" in str(e.get("url", "")):
            targets.add(e["url"])
    if not targets:
        print("Žádné články k opravě.")
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    for p in OUT.glob("*.html"):
        p.unlink()

    files = []
    repaired_urls = []
    failures = []
    for url in sorted(targets):
        slug = urllib.parse.urlsplit(url).path.rsplit("/", 1)[-1]
        try:
            fixed = repair(fetch(url), url)
            path = OUT / slug
            path.write_text(fixed, encoding="utf-8", newline="\n")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            files.append({"path": f"clanky/{slug}", "url": RAW_BASE + urllib.parse.quote(slug), "sha256": digest})
            repaired_urls.append(url)
        except Exception as exc:
            failures.append({"url": url, "error": repr(exc)})

    manifest = {
        "schema": 1,
        "version": "20260825-sitewide-title-figure-repair-safe2",
        "files": files,
        "patches": [],
        "deletes": [],
        "verify_urls": repaired_urls,
        "verify_present": ["data-nk-title-figure=\"1\"", "width=\"1200\" height=\"630\""],
        "verify_absent": [],
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    Path("nasekadan-live/live-repair-summary.json").write_text(json.dumps({"targets": len(targets), "generated": len(files), "failures": failures}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"targets": len(targets), "generated": len(files), "failures": len(failures)}, ensure_ascii=False))
    for item in failures:
        print(item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
