#!/usr/bin/env python3
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
    "Jak z článku vytěžit maximum",
    "SEO a uživatelská hodnota článku",
    "Rychlá kontrola před publikací",
    "související článek z této dávky",
    "Přehnaná očekávání",
    "Příliš mnoho kombinací",
    "Označeno tagem",
    "Vybavení a suroviny pro další domácí recept",
)


def plain_text(value: str) -> str:
    return " ".join(unescape(re.sub(r"<[^>]+>", " ", value)).split())


def visible_page_text(markup: str) -> str:
    main = re.search(r"<main\b[^>]*>([\s\S]*?)</main>", markup, re.I)
    value = main.group(1) if main else markup
    for tag in ("head", "script", "style", "noscript", "template"):
        value = re.sub(rf"<{tag}\b[^>]*>[\s\S]*?</{tag}>", " ", value, flags=re.I)
    return plain_text(re.sub(r"<!--[\s\S]*?-->", " ", value))


def class_count(markup: str, token: str) -> int:
    return len(re.findall(rf"\bclass=[\"'][^\"']*(?<![-\w]){re.escape(token)}(?![-\w])[^\"']*[\"']", markup, re.I))


def image_sources(markup: str) -> list[str]:
    return re.findall(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", markup, re.I)


def classed_anchor_image_sources(markup: str, token: str) -> list[str]:
    sources: list[str] = []
    for match in re.finditer(r"<a\b([^>]*)>([\s\S]*?)</a>", markup, re.I):
        attributes, body = match.groups()
        class_match = re.search(r"\bclass=[\"']([^\"']*)[\"']", attributes, re.I)
        if not class_match or token not in class_match.group(1).split():
            continue
        source_match = re.search(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", body, re.I)
        if source_match:
            sources.append(source_match.group(1))
    return sources


def div_content_by_class(markup: str, token: str) -> str:
    opening = None
    for match in re.finditer(r"<div\b([^>]*)>", markup, re.I):
        class_match = re.search(r"\bclass=[\"']([^\"']*)[\"']", match.group(1), re.I)
        if class_match and token in class_match.group(1).split():
            opening = match
            break
    if opening is None:
        return ""

    depth = 1
    for tag in re.finditer(r"</?div\b[^>]*>", markup[opening.end():], re.I):
        if tag.group(0).lstrip().startswith("</"):
            depth -= 1
            if depth == 0:
                return markup[opening.end():opening.end() + tag.start()]
        else:
            depth += 1
    return ""


def require(markup: str, marker: str, label: str, errors: list[str]) -> None:
    if marker not in markup:
        errors.append(f"missing {label}: {marker}")


def article_length(markup: str) -> int:
    match = re.search(r"data-article-text-length=[\"'](\d+)[\"']", markup, re.I)
    return int(match.group(1)) if match else -1


def main() -> int:
    if len(sys.argv) != 7:
        print("Usage: verify-deployed-article.py VERSION ARTICLE HOME HEALTH RECIPES CLEAN_ARTICLE", file=sys.stderr)
        return 2

    version, article, home, health, recipes, clean_article = (
        Path(arg).read_text(encoding="utf-8") for arg in sys.argv[1:]
    )
    errors: list[str] = []

    for marker in (
        "expected-restored-natural-pharmacy-cards: 9",
        "expected-natural-pharmacy-image-format: webp",
        "expected-home-herb-game-image: /media/generated/prirodni-lekarna/bylinkova-herna-photo.webp",
        "expected-editorial-integrity-audit: enabled",
    ):
        require(version, marker, "deployment marker", errors)

    kicker_match = re.search(r'class=["\'][^"\']*article-kicker[^"\']*["\'][^>]*>([\s\S]*?)</div>', article, re.I)
    kicker = plain_text(kicker_match.group(1)) if kicker_match else ""
    hero_match = re.search(r'<img\b[^>]*class=["\'][^"\']*hero-image[^"\']*["\'][^>]*>', article, re.I)
    hero_src_match = re.search(r'\bsrc=["\']([^"\']+)["\']', hero_match.group(0), re.I) if hero_match else None
    hero_src = hero_src_match.group(1) if hero_src_match else ""
    text_length = article_length(article)

    if kicker != "Pěstování bylinek":
        errors.append(f"wrong article kicker: {kicker!r}")
    if "/obrazky/clanky/nejcastejsi-chyby-pri-pestovani-bylinek.svg" not in hero_src:
        errors.append(f"wrong unique hero image: {hero_src!r}")
    if text_length < 0:
        errors.append("cultivation article is missing data-article-text-length")
    if class_count(article, "context-ads") < 1:
        errors.append("cultivation article is missing contextual advertising")
    if text_length >= 600 and class_count(article, "article-inline-ad") < 1:
        errors.append("cultivation article qualifies for an in-content ad but it is missing")
    if class_count(article, "product-feed") < 1:
        errors.append("cultivation article is missing the product feed")

    require(home, "/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp", "WebP herb-game card", errors)
    if "/media/original/home/bylinkova-herna-photo.svg" in home:
        errors.append("home page still references the obsolete herb-game SVG")
    home_cards = class_count(home, "illustrated-directory-card--photo")
    if home_cards < 6:
        errors.append(f"home page contains only {home_cards} photographic main cards")

    health_cards = class_count(health, "illustrated-directory-card--photo")
    if health_cards != 9:
        errors.append(f"natural pharmacy contains {health_cards} restored main cards instead of 9")
    health_images = classed_anchor_image_sources(health, "illustrated-directory-card--photo")
    if len(health_images) != 9:
        errors.append(f"natural pharmacy contains {len(health_images)} main-card images instead of 9")
    bad_health_paths = [src for src in health_images if "/media/generated/prirodni-lekarna/" not in src]
    if bad_health_paths:
        errors.append("natural-pharmacy main cards do not all use generated photographic assets: " + ", ".join(bad_health_paths))
    bad_health_formats = [src for src in health_images if not src.split("?", 1)[0].lower().endswith(".webp")]
    if bad_health_formats:
        errors.append("natural-pharmacy main-card images are not all WebP: " + ", ".join(bad_health_formats))
    require(health, "Bylinky přehledně a bezpečně", "new natural-pharmacy heading", errors)
    for href in (
        "/prirodni-pomocnici-pro-imunitu/",
        "/nejlepsi-bylinky-na-kasel-a-prudusky-prirodni-pomoc-pri-nachlazeni/",
        "/prirodni-pomocnici-pro-traveni-a-zazivani/",
        "/tinktury/tinktury-srdce-krevni-obeh/",
        "/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/",
    ):
        require(health, f'href="{href}"', f"natural-pharmacy link {href}", errors)

    recipe_cards = class_count(recipes, "illustrated-directory-card--photo")
    if recipe_cards != 10:
        errors.append(f"recipes page contains {recipe_cards} restored main categories instead of 10")
    for href in (
        "/domaci-sirupy/", "/tinktury/", "/recepty-na-domaci-limonady/", "/bylinne-caje/",
        "/bylinne-koupele/", "/bylinne-masti-a-balzamy/", "/bylinne-oleje-a-maceraty/",
        "/bylinne-octy-a-oxymely/", "/bylinne-obklady-a-kloktadla/", "/bylinky-v-kuchyni-recepty/",
        "/sirupy-a-recepty-pro-zvirata/",
    ):
        require(recipes, f'href="{href}"', f"recipe link {href}", errors)

    clean_visible = visible_page_text(clean_article)
    for marker, label in (
        ("Jak uchovat čerstvé bylinky během horkého léta", "rewritten article title"),
        ("Bazalku nedávejte do příliš chladné lednice", "specific basil section"),
        ("Kdy je lepší bylinky zmrazit", "specific freezing section"),
    ):
        require(clean_article, marker, label, errors)
    if class_count(clean_article, "context-ads") < 1:
        errors.append("rewritten article is missing contextual advertising")
    if class_count(clean_article, "product-feed") < 1:
        errors.append("rewritten article is missing product feed")
    content = div_content_by_class(clean_article, "article-editorial-body")
    if not content:
        errors.append("rewritten article is missing the editorial-content wrapper")
    if "click.php" in content:
        errors.append("raw affiliate links remain inside rewritten editorial content")
    if re.search(r">\s*\d[\d\s.,]*\s*Kč\s*<", content, re.I):
        errors.append("standalone legacy prices remain inside rewritten editorial content")

    visible = "\n".join(visible_page_text(markup) for markup in (article, home, health, recipes, clean_article)).casefold()
    for phrase in BANNED_VISIBLE_PHRASES:
        if phrase.casefold() in visible:
            errors.append(f"banned visible phrase {phrase!r}")

    if errors:
        print("Deployment verification failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(
        "Deployment verified successfully: "
        f"article_text_length={text_length}, home={home_cards}, health={health_cards}, "
        f"health_webp={len(health_images)}, recipes={recipe_cards}, clean_article_chars={len(clean_visible)}, "
        f"inline_ads={class_count(article, 'article-inline-ad')}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
