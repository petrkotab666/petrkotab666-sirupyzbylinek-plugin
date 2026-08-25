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
UA = "NaseKadanLiveRepair/1.0"
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


def is_title_figure(block: str) -> bool:
    im = re.search(r"<img\b[^>]*>", block, re.I | re.S)
    if not im:
        return False
    src = attr(im.group(0), "src") or ""
    try:
        path = norm_img(src)
    except Exception:
        return False
    low = block.lower()
    w = attr(im.group(0), "width")
    h = attr(im.group(0), "height")
    return path.startswith("/social/") and (
        (w == "1200" and h == "630")
        or "redakční grafika" in low
        or "titulní grafika" in low
        or "data-nk-title-figure" in low
        or "article-photo" in low
    )


def figure_markup(src: str, title: str) -> str:
    return (
        '\n<figure class="article-figure" data-nk-title-figure="1">'
        f'<img class="article-photo" src="{html.escape(src, quote=True)}" width="1200" height="630" '
        f'alt="Redakční grafika Naše Kadaň k článku {html.escape(title, quote=True)}" fetchpriority="high" decoding="async">'
        '<figcaption>Redakční grafika Naše Kadaň.</figcaption></figure>\n'
    )


def repair(body: str, url: str) -> str:
    og = meta(body, "og:image")
    if not og:
        raise RuntimeError(f"{url}: chybí og:image")
    og_path = norm_img(og)
    if not og_path.startswith("/social/"):
        raise RuntimeError(f"{url}: og:image není /social/: {og_path}")

    # Odstranit pouze titulní/social figury. Ostatní fotografie a dokumentační
    # obrázky zůstávají nedotčené.
    parts = []
    cursor = 0
    removed = 0
    pattern = re.compile(r"<figure\b[^>]*class=[\"'][^\"']*\barticle-figure\b[^\"']*[\"'][^>]*>.*?</figure>", re.I | re.S)
    for m in pattern.finditer(body):
        parts.append(body[cursor:m.start()])
        block = m.group(0)
        if is_title_figure(block):
            removed += 1
        else:
            parts.append(block)
        cursor = m.end()
    parts.append(body[cursor:])
    body = "".join(parts)

    article = re.search(r'<article\b[^>]*class=["\'][^"\']*\barticle\b[^"\']*["\'][^>]*>', body, re.I)
    if not article:
        raise RuntimeError(f"{url}: nenalezen <article class=article>")
    start = article.end()
    tail = body[start:]
    lead = re.search(r'<p\b[^>]*class=["\'][^"\']*\blead\b[^"\']*["\'][^>]*>.*?</p>', tail, re.I | re.S)
    if lead:
        at = start + lead.end()
    else:
        h1 = re.search(r"<h1\b[^>]*>.*?</h1>", tail, re.I | re.S)
        at = start + h1.end() if h1 else start
    body = body[:at] + figure_markup(og_path, clean_h1(body)) + body[at:]

    # CSS pojistka pro starší šablony.
    if not re.search(r"\.article-figure\b", body):
        css = '<style data-nk-title-figure-css="1">.article-figure{margin:28px 0 30px}.article-figure img{display:block;width:100%;height:auto;border-radius:20px}.article-figure figcaption{font-size:13px;color:#61717a;margin-top:9px}</style>\n'
        body = body.replace("</head>", css + "</head>", 1)

    # Jednoznačně nefunkční historický odkaz. Akce jsou sekcí titulky, nikoli /akce/.
    body = body.replace('href="/akce/"', 'href="/#akce"').replace("href='/akce/'", "href='/#akce'")
    body = body.replace('href="https://nasekadan.cz/akce/"', 'href="https://nasekadan.cz/#akce"')
    body = body.replace('href="https://www.nasekadan.cz/akce/"', 'href="https://nasekadan.cz/#akce"')

    # Finální invariant.
    title_blocks = [m.group(0) for m in pattern.finditer(body) if is_title_figure(m.group(0))]
    if len(title_blocks) != 1:
        raise RuntimeError(f"{url}: po opravě počet titulních figur {len(title_blocks)}")
    if og_path not in title_blocks[0]:
        raise RuntimeError(f"{url}: finální figura neodpovídá og:image")
    return body


def main() -> int:
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    targets = set()
    for e in report.get("errors", []):
        if e.get("type") in {"missing_visible_title_figure", "duplicate_title_figures"} and "/clanky/" in str(e.get("url", "")):
            targets.add(e["url"])
    if not targets:
        print("Žádné články k opravě.")
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    # Odstranit staré generované balíčky, aby manifest neodkazoval na minulý audit.
    for p in OUT.glob("*.html"):
        p.unlink()

    files = []
    failures = []
    for url in sorted(targets):
        slug = urllib.parse.urlsplit(url).path.rsplit("/", 1)[-1]
        try:
            fixed = repair(fetch(url), url)
            path = OUT / slug
            path.write_text(fixed, encoding="utf-8", newline="\n")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            files.append({"path": f"clanky/{slug}", "url": RAW_BASE + urllib.parse.quote(slug), "sha256": digest})
        except Exception as exc:
            failures.append({"url": url, "error": repr(exc)})

    manifest = {
        "schema": 1,
        "version": "20260825-sitewide-title-figure-repair",
        "files": files,
        "patches": [],
        "deletes": [],
        "verify_urls": sorted(targets),
        "verify_present": ["data-nk-title-figure=\"1\"", "width=\"1200\" height=\"630\""],
        "verify_absent": [],
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    Path("nasekadan-live/live-repair-summary.json").write_text(json.dumps({"targets": len(targets), "generated": len(files), "failures": failures}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"targets": len(targets), "generated": len(files), "failures": len(failures)}, ensure_ascii=False))
    if failures:
        for item in failures:
            print(item)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
