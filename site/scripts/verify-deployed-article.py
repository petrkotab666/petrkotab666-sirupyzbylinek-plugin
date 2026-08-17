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


def class_token_count(markup: str, token: str) -> int:
    pattern = re.compile(
        rf"\bclass=[\"'][^\"']*(?<![-\w]){re.escape(token)}(?![-\w])[^\"']*[\"']",
        re.I,
    )
    return len(pattern.findall(markup))


def image_sources(markup: str) -> list[str]:
    return re.findall(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", markup, re.I)


def require(markup: str, marker: str, label: str, errors: list[str]) -> None:
    if marker not in markup:
        errors.append(f"missing {label}: {marker}")


def remove_ad_modules(markup: str) -> str:
    patterns = (
        r"<aside\b[^>]*class=[\"'][^\"']*article-inline-ad[^\"']*[\"'][^>]*>[\s\S]*?</aside>",
        r"<aside\b[^>]*class=[\"'][^\"']*context-ads[^\"']*[\"'][^>]*>[\s\S]*?</aside>",
        r"<section\b[^>]*class=[\"'][^\"']*context-ads[^\"']*[\"'][^>]*>[\s\S]*?</section>",
        r"<section\b[^>]*class=[\"'][^\"']*product-feed[^\"']*[\"'][^>]*>[\s\S]*?</section>",
    )
    cleaned = markup
    for pattern in patterns:
        cleaned = re.sub(pattern, " ", cleaned, flags=re.I)
    return cleaned


def photo_card_images(markup: str) -> list[str]:
    cards = re.findall(
        r"<a\b[^>]*class=[\"'][^\"']*illustrated-directory-card--photo[^\"']*[\"'][^>]*>[\s\S]*?</a>",
        markup,
        re.I,
    )
    result: list[str] = []
    for card in cards:
        sources = image_sources(card)
        if sources:
            result.append(sources[0])
    return result


def article_text_length(markup: str) -> int:
    match = re.search(r"data-article-text-length=[\"'](\d+)[\"']", markup, re.I)
    return int(match.group(1)) if match else 0


def main() -> int:
    if len(sys.argv) != 7:
        print(
            "Usage: verify-deployed-article.py VERSION ARTICLE HOME HEALTH RECIPES CLEAN_ARTICLE",
            file=sys.stderr,
        )
        return 2

    version = Path(sys.argv[1]).read_text(encoding="utf-8")
    article = Path(sys.argv[2]).read_text(encoding="utf-8")
    home = Path(sys.argv[3]).read_text(encoding="utf-8")
    health = Path(sys.argv[4]).read_text(encoding="utf-8")
    recipes = Path(sys.argv[5]).read_text(encoding="utf-8")
    clean_article = Path(sys.argv[6]).read_text(encoding="utf-8")

    errors: list[str] = []

    for marker, label in (
        ("expected-restored-natural-pharmacy-cards: 9", "restoration deployment marker"),
        ("expected-natural-pharmacy-image-format: webp", "natural-pharmacy WebP marker"),
        ("expected-home-herb-game-image: /media/generated/prirodni-lekarna/bylinkova-herna-photo.webp", "home herb-game marker"),
        ("expected-editorial-integrity-audit: enabled", "editorial integrity marker"),
    ):
        if marker not in version:
            errors.append(f"missing {label}")

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
    hero_src_match = re.search(r'\bsrc=["\']([^"\']+)["\']', hero_match.group(0), re.I) if hero_match else None
    kicker = plain_text(kicker_match.group(1)) if kicker_match else ""
    hero_src = hero_src_match.group(1) if hero_src_match else ""

    if kicker != "Pěstování bylinek":
        errors.append(f"wrong article kicker: {kicker!r}")
    if "/obrazky/clanky/nejcastejsi-chyby-pri-pestovani-bylinek.svg" not in hero_src:
        errors.append(f"wrong unique hero image: {hero_src!r}")
    if class_token_count(article, "context-ads") < 1:
        errors.append("cultivation article is missing contextual advertising")
    if class_token_count(article, "product-feed") < 1:
        errors.append("cultivation article is missing the product feed")

    text_length = article_text_length(article)
    has_critical_notice = class_token_count(article, "critical-recipe-notice") > 0
    inline_count = class_token_count(article, "article-inline-ad")
    if text_length >= 600 and not has_critical_notice and inline_count < 1:
        errors.append(
            f"cultivation article has {text_length} text characters but no in-content advertising module"
        )

    require(
        home,
        "/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp",
        "WebP herb-game card",
        errors,
    )
    if "/media/original/home/bylinkova-herna-photo.svg" in home:
        errors.append("home page still references the obsolete herb-game SVG")
    home_cards = class_token_count(home, "illustrated-directory-card--photo")
    if home_cards < 6:
        errors.append(f"home page contains only {home_cards} photographic main cards")

    health_cards = class_token_count(health, "illustrated-directory-card--photo")
    if health_cards != 9:
        errors.append(f"natural pharmacy contains {health_cards} restored main cards instead of 9")
    health_card_images = photo_card_images(health)
    if len(health_card_images) != 9:
        errors.append(f"natural pharmacy contains {len(health_card_images)} card images instead of 9")
    wrong_health_images = [
        source
        for source in health_card_images
        if "/media/generated/prirodni-lekarna/" not in source
        or not source.split("?", 1)[0].lower().endswith(".webp")
    ]
    if wrong_health_images:
        errors.append("natural-pharmacy card images are not the expected generated WebP set: " + ", ".join(wrong_health_images))

    require(health, "Bylinky přehledně a bezpečně", "natural-pharmacy heading", errors)
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
        errors.append(f"recipes page contains {recipe_cards} restored main categories instead of 10")

    clean_visible = visible_page_text(clean_article)
    require(clean_article, "Jak uchovat čerstvé bylinky během horkého léta", "rewritten article title", errors)
    require(clean_article, "Bazalku nedávejte do příliš chladné lednice", "specific basil section", errors)
    require(clean_article, "Kdy je lepší bylinky zmrazit", "specific freezing section", errors)
    if class_token_count(clean_article, "context-ads") < 1:
        errors.append("rewritten article is missing contextual advertising")
    if class_token_count(clean_article, "product-feed") < 1:
        errors.append("rewritten article is missing product feed")

    clean_without_ads = remove_ad_modules(clean_article)
    if "ehub.cz/system/scripts/click.php" in clean_without_ads:
        errors.append("raw affiliate links remain outside dedicated advertising modules")
    if re.search(r">\s*\d[\d\s.,]*\s*Kč\s*<", clean_without_ads, re.I):
        errors.append("standalone legacy prices remain outside dedicated advertising modules")

    combined_visible = "\n".join(
        visible_page_text(markup)
        for markup in (article, home, health, recipes, clean_article)
    )
    folded = combined_visible.casefold()
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
        f"hero={hero_src!r}, article_chars={text_length}, inline_ads={inline_count}, "
        f"home={home_cards}, health={health_cards}, health_card_webp={len(health_card_images)}, "
        f"recipes={recipe_cards}, clean_article_chars={len(clean_visible)}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
