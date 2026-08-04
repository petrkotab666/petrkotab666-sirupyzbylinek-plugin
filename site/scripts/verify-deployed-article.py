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
)


def plain_text(value: str) -> str:
    return " ".join(unescape(re.sub(r"<[^>]+>", " ", value)).split())


def visible_page_text(markup: str) -> str:
    main = re.search(r"<main\b[^>]*>([\s\S]*?)</main>", markup, re.I)
    value = main.group(1) if main else markup
    for tag in ("head", "script", "style", "noscript", "template"):
        value = re.sub(
            rf"<{tag}\b[^>]*>[\s\S]*?</{tag}>",
            " ",
            value,
            flags=re.I,
        )
    return plain_text(re.sub(r"<!--[\s\S]*?-->", " ", value))


def class_token_count(markup: str, token: str) -> int:
    pattern = re.compile(
        rf"\bclass=[\"'][^\"']*(?<![-\w]){re.escape(token)}(?![-\w])[^\"']*[\"']",
        re.I,
    )
    return len(pattern.findall(markup))


def image_sources(markup: str) -> list[str]:
    return re.findall(
        r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>",
        markup,
        re.I,
    )


def require(markup: str, marker: str, label: str, errors: list[str]) -> None:
    if marker not in markup:
        errors.append(f"missing {label}: {marker}")


def main() -> int:
    if len(sys.argv) != 6:
        print(
            "Usage: verify-deployed-article.py VERSION ARTICLE HOME HEALTH RECIPES",
            file=sys.stderr,
        )
        return 2

    version = Path(sys.argv[1]).read_text(encoding="utf-8")
    article = Path(sys.argv[2]).read_text(encoding="utf-8")
    home = Path(sys.argv[3]).read_text(encoding="utf-8")
    health = Path(sys.argv[4]).read_text(encoding="utf-8")
    recipes = Path(sys.argv[5]).read_text(encoding="utf-8")

    kicker_match = re.search(
        r'class=["\'][^"\']*article-kicker[^"\']*["\'][^>]*>([\s\S]*?)</div>',
        article,
        re.I,
    )
    hero_match = re.search(
        r'<img\b[^>]*class=["\'][^"\']*hero-image[^"\']*["\'][^>]*>',
        article,
        re.I,
    )
    hero_src_match = (
        re.search(r'\bsrc=["\']([^"\']+)["\']', hero_match.group(0), re.I)
        if hero_match
        else None
    )

    kicker = plain_text(kicker_match.group(1)) if kicker_match else ""
    hero_src = hero_src_match.group(1) if hero_src_match else ""
    visible = visible_page_text(article)
    errors: list[str] = []

    if "expected-restored-natural-pharmacy-cards: 9" not in version:
        errors.append("current restoration deployment marker is missing")
    if "expected-natural-pharmacy-image-format: webp" not in version:
        errors.append("natural-pharmacy WebP deployment marker is missing")
    if kicker != "Pěstování bylinek":
        errors.append(f"wrong article kicker: {kicker!r}")
    if "/obrazky/clanky/nejcastejsi-chyby-pri-pestovani-bylinek.svg" not in hero_src:
        errors.append(f"wrong unique hero image: {hero_src!r}")

    if class_token_count(article, "context-ads") < 1:
        errors.append("cultivation article is missing contextual advertising")
    if class_token_count(article, "article-inline-ad") < 1:
        errors.append("cultivation article is missing an in-content advertising module")
    if class_token_count(article, "product-feed") < 1:
        errors.append("cultivation article is missing the product feed")

    require(
        home,
        "/media/original/home/bylinkova-herna-photo.svg",
        "photographic herb-game card",
        errors,
    )
    home_cards = class_token_count(home, "illustrated-directory-card--photo")
    if home_cards < 6:
        errors.append(f"home page contains only {home_cards} photographic main cards")

    health_cards = class_token_count(health, "illustrated-directory-card--photo")
    if health_cards != 9:
        errors.append(
            f"natural pharmacy contains {health_cards} restored main cards instead of 9"
        )

    health_generated_images = [
        source
        for source in image_sources(health)
        if "/media/generated/prirodni-lekarna/" in source
    ]
    if len(health_generated_images) != 9:
        errors.append(
            "natural pharmacy contains "
            f"{len(health_generated_images)} generated tile images instead of 9"
        )
    non_webp_health_images = [
        source
        for source in health_generated_images
        if not source.split("?", 1)[0].lower().endswith(".webp")
    ]
    if non_webp_health_images:
        errors.append(
            "natural-pharmacy tile images are not all WebP: "
            + ", ".join(non_webp_health_images)
        )
    require(
        health,
        "/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp",
        "sleep-card WebP image",
        errors,
    )
    require(health, "Bylinky přehledně a bezpečně", "new natural-pharmacy heading", errors)
    for href in (
        "/prirodni-pomocnici-pro-imunitu/",
        "/nejlepsi-bylinky-na-kasel-a-prudusky-prirodni-pomoc-pri-nachlazeni/",
        "/prirodni-pomocnici-pro-traveni-a-zazivani/",
        "/tinktury/tinktury-srdce-krevni-obeh/",
        "/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/",
    ):
        require(health, f'href="{href}"', f"natural-pharmacy link {href}", errors)

    recipe_cards = class_token_count(recipes, "illustrated-directory-card--photo")
    if recipe_cards != 10:
        errors.append(
            f"recipes page contains {recipe_cards} restored main categories instead of 10"
        )
    for href in (
        "/domaci-sirupy/",
        "/tinktury/",
        "/recepty-na-domaci-limonady/",
        "/bylinne-caje/",
        "/bylinne-koupele/",
        "/bylinne-masti-a-balzamy/",
        "/bylinne-oleje-a-maceraty/",
        "/bylinne-octy-a-oxymely/",
        "/bylinne-obklady-a-kloktadla/",
        "/bylinky-v-kuchyni-recepty/",
        "/sirupy-a-recepty-pro-zvirata/",
    ):
        require(recipes, f'href="{href}"', f"recipe link {href}", errors)

    folded = visible.casefold()
    for phrase in BANNED_VISIBLE_PHRASES:
        if phrase.casefold() in folded:
            errors.append(f"banned visible phrase {phrase!r}")

    if errors:
        print("Deployment verification failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(
        "Deployment verified successfully: "
        f"hero={hero_src!r}, home={home_cards}, health={health_cards}, "
        f"health_webp={len(health_generated_images)}, recipes={recipe_cards}, "
        f"contextual_ads={class_token_count(article, 'context-ads')}, "
        f"inline_ads={class_token_count(article, 'article-inline-ad')}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
