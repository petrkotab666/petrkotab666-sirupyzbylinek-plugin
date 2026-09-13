#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = "https://nasekadan.cz"
OUT = Path("nasekadan-live/visual-browser-audit.json")
SHOT_DIR = Path("nasekadan-live/visual-findings")
TARGET = ROOT + "/clanky/kadansky-klaster-vratte-nam-knihy-1986.html"
VIEWPORT = {"width": 1600, "height": 1000}


def sitemap_urls() -> list[str]:
    req = urllib.request.Request(
        ROOT + "/sitemap.xml?visual_browser_audit=20260913",
        headers={"User-Agent": "NaseKadanVisualBrowserAudit/20260913", "Cache-Control": "no-cache"},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = response.read()
    urls: list[str] = []
    for node in ET.fromstring(payload).iter():
        if node.tag.endswith("loc") and node.text:
            url = node.text.strip()
            if url.startswith(ROOT):
                urls.append(url)
    return list(dict.fromkeys(urls))


def safe_name(url: str) -> str:
    part = url.removeprefix(ROOT).strip("/") or "homepage"
    return "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in part)[:150]


def main() -> int:
    chrome = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
    if not chrome:
        raise SystemExit("CHROME_NOT_FOUND")

    urls = sitemap_urls()
    findings: list[dict] = []
    target_metrics: dict | None = None
    screenshots = 0
    SHOT_DIR.mkdir(parents=True, exist_ok=True)

    js = r"""
    () => {
      const visible = el => {
        if (!el) return false;
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 1 && r.height > 1;
      };
      const rect = el => {
        const r = el.getBoundingClientRect();
        return {x:Math.round(r.x), y:Math.round(r.y), width:Math.round(r.width), height:Math.round(r.height), right:Math.round(r.right), bottom:Math.round(r.bottom)};
      };
      const h1 = document.querySelector('h1');
      let h1m = null;
      if (h1 && visible(h1)) {
        const r = h1.getBoundingClientRect(), s = getComputedStyle(h1);
        const fs = parseFloat(s.fontSize) || 0;
        const lh = parseFloat(s.lineHeight) || fs * 1.15 || 1;
        h1m = {rect:rect(h1), fontSize:fs, lineHeight:lh, lines:Math.max(1, Math.round(r.height/lh)), text:(h1.textContent||'').trim().replace(/\s+/g,' ').slice(0,240)};
      }
      const article = document.querySelector('main.article-shell article, article.article, article.story');
      const articleRect = article && visible(article) ? rect(article) : null;
      const nestedHeaders = [...document.querySelectorAll('main.article-shell header:not([data-site-header])')]
        .filter(visible)
        .map(el => {
          const s=getComputedStyle(el);
          return {className:el.className, display:s.display, position:s.position, gridTemplateColumns:s.gridTemplateColumns, rect:rect(el)};
        });
      const brokenImages = [...document.images]
        .filter(img => visible(img) && img.complete && img.naturalWidth === 0)
        .map(img => img.currentSrc || img.src).slice(0,20);
      const adCards = [...document.querySelectorAll('.promo-card,.article-rail-card,.featured-cleaning-ad a,.featured-rotating-ad a,.article-aside-adstream a')]
        .filter(visible)
        .map(el => {
          const r=el.getBoundingClientRect();
          return {rect:rect(el), ratio:r.width ? r.height/r.width : 0, images:el.querySelectorAll('img').length, text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,120)};
        });
      const titleFigure = document.querySelector('[data-nk-title-figure="1"], figure.article-figure img.article-photo, img.article-photo');
      let titleFigureRect = null;
      if (titleFigure && visible(titleFigure)) titleFigureRect = rect(titleFigure);
      const siteHeader = document.querySelector('header[data-site-header="v1"], body > header');
      return {
        title:document.title,
        url:location.href,
        viewport:innerWidth,
        scrollWidth:document.documentElement.scrollWidth,
        overflowX:Math.max(0, document.documentElement.scrollWidth-innerWidth),
        bodyHeight:document.documentElement.scrollHeight,
        h1:h1m,
        articleRect,
        nestedHeaders,
        brokenImages,
        oversizedAds:adCards.filter(a => a.rect.height > 650 || (a.ratio > 3.4 && a.rect.height > 360)),
        noImageTallAds:adCards.filter(a => a.images === 0 && a.rect.height > 320),
        titleFigureRect,
        siteHeaderVisible:!!(siteHeader && visible(siteHeader)),
        bodyTextLength:(document.body.innerText||'').trim().length
      };
    }
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, headless=True, args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"])
        context = browser.new_context(viewport=VIEWPORT, device_scale_factor=1)
        page = context.new_page()
        page.set_default_timeout(12_000)

        for index, url in enumerate(urls, start=1):
            issue_types: list[str] = []
            try:
                sep = "&" if "?" in url else "?"
                page.goto(url + sep + "visual_browser_audit=20260913", wait_until="domcontentloaded", timeout=22_000)
                page.wait_for_timeout(250)
                data = page.evaluate(js)
            except Exception as exc:
                findings.append({"url": url, "type": "render_error", "detail": str(exc)[:300]})
                continue

            if data["overflowX"] > 8:
                findings.append({"url": url, "type": "horizontal_overflow", "pixels": data["overflowX"]})
                issue_types.append("horizontal_overflow")
            if data["brokenImages"]:
                findings.append({"url": url, "type": "rendered_broken_images", "sources": data["brokenImages"]})
                issue_types.append("rendered_broken_images")
            if "/clanky/" in url and data.get("h1"):
                h1 = data["h1"]
                if h1["lines"] > 5:
                    findings.append({"url": url, "type": "desktop_h1_too_many_lines", "h1": h1})
                    issue_types.append("desktop_h1_too_many_lines")
                if h1["fontSize"] > 76:
                    findings.append({"url": url, "type": "desktop_h1_too_large", "h1": h1})
                    issue_types.append("desktop_h1_too_large")
                ar = data.get("articleRect")
                if ar and ar["width"] > 650 and h1["rect"]["width"] < ar["width"] * 0.48 and h1["lines"] >= 4:
                    findings.append({"url": url, "type": "desktop_h1_squeezed_column", "h1": h1, "article": ar})
                    issue_types.append("desktop_h1_squeezed_column")
            for header in data["nestedHeaders"]:
                if header["position"] in ("sticky", "fixed") or header["display"] in ("grid", "inline-grid"):
                    findings.append({"url": url, "type": "article_nested_header_layout_collision", "header": header})
                    issue_types.append("article_nested_header_layout_collision")
            if data["oversizedAds"]:
                findings.append({"url": url, "type": "oversized_ad_render", "ads": data["oversizedAds"]})
                issue_types.append("oversized_ad_render")
            if data["noImageTallAds"]:
                findings.append({"url": url, "type": "tall_ad_without_image", "ads": data["noImageTallAds"]})
                issue_types.append("tall_ad_without_image")
            if data["bodyTextLength"] < 20:
                findings.append({"url": url, "type": "nearly_empty_render", "length": data["bodyTextLength"]})
                issue_types.append("nearly_empty_render")

            if url == TARGET:
                target_metrics = data
                page.screenshot(path=str(SHOT_DIR / "target-after.png"), full_page=False)
                screenshots += 1
            elif issue_types and screenshots < 16:
                page.screenshot(path=str(SHOT_DIR / (safe_name(url) + ".png")), full_page=False)
                screenshots += 1

            if index % 25 == 0:
                print(f"VISUAL_PROGRESS {index}/{len(urls)} findings={len(findings)}")

        browser.close()

    counts = Counter(item["type"] for item in findings)
    report = {
        "status": "PASSED" if not findings else "REVIEW",
        "viewport": VIEWPORT,
        "urls_checked": len(urls),
        "finding_count": len(findings),
        "finding_types": dict(counts),
        "target_metrics": target_metrics,
        "screenshots_saved": screenshots,
        "findings": findings,
    }
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("status", "urls_checked", "finding_count", "finding_types", "target_metrics", "screenshots_saved")}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
