#!/usr/bin/env python3
"""Verify that the deployed cultivation article contains the cleaned public content."""

from __future__ import annotations

from html import unescape
from pathlib import Path
import re
import sys


BANNED_VISIBLE_PHRASES = (
    "Rychlé shrnutí článku",
    "hlavní klíčové slovo",
    "SEO 90+",
    "produktový XML feed",
    "affiliate doporučení",
)


def plain_text(value: str) -> str:
    return " ".join(unescape(re.sub(r"<[^>]+>", " ", value)).split())


def visible_page_text(markup: str) -> str:
    """Return text visible in the page body, excluding metadata and scripts."""
    main_match = re.search(r"<main\b[^>]*>([\s\S]*?)</main>", markup, re.IGNORECASE)
    value = main_match.group(1) if main_match else markup

    for tag in ("head", "script", "style", "noscript", "template"):
        value = re.sub(
            rf"<{tag}\b[^>]*>[\s\S]*?</{tag}>",
            " ",
            value,
            flags=re.IGNORECASE,
        )
    value = re.sub(r"<!--[\s\S]*?-->", " ", value)
    return plain_text(value)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: verify-deployed-article.py VERSION_FILE ARTICLE_HTML", file=sys.stderr)
        return 2

    version = Path(sys.argv[1]).read_text(encoding="utf-8")
    markup = Path(sys.argv[2]).read_text(encoding="utf-8")

    kicker_match = re.search(
        r'class="article-kicker"[^>]*>([\s\S]*?)</div>', markup, re.IGNORECASE
    )
    hero_match = re.search(
        r'<img\b[^>]*class=["\'][^"\']*hero-image[^"\']*["\'][^>]*>',
        markup,
        re.IGNORECASE,
    )
    hero_src_match = (
        re.search(r'\bsrc=["\']([^"\']+)["\']', hero_match.group(0), re.IGNORECASE)
        if hero_match
        else None
    )

    kicker = plain_text(kicker_match.group(1)) if kicker_match else ""
    hero_src = hero_src_match.group(1) if hero_src_match else ""
    visible = visible_page_text(markup)

    errors: list[str] = []
    if "expected-cultivation-category: Pěstování bylinek" not in version:
        errors.append("deployment marker is missing")
    if kicker != "Pěstování bylinek":
        errors.append(f"wrong article kicker: {kicker!r}")
    if "/obrazky/pestovani.svg" not in hero_src:
        errors.append(f"wrong hero image: {hero_src!r}")

    visible_folded = visible.casefold()
    for phrase in BANNED_VISIBLE_PHRASES:
        if phrase.casefold() in visible_folded:
            index = visible_folded.index(phrase.casefold())
            context = visible[max(0, index - 100) : index + len(phrase) + 100]
            errors.append(f"banned visible phrase {phrase!r}; context: {context!r}")

    if errors:
        print("Deployment verification failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(
        "Deployment verified successfully: "
        f"kicker={kicker!r}, hero={hero_src!r}, visible_chars={len(visible)}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
