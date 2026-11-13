# NašeKadaň sidebar advertising repair — 2026-11-13

## Production result

The desktop advertising stream now follows the actual rendered article height. The previous renderer limited the added stream to two cards whenever another sidebar advertisement already existed. An additional stale-loader path in site.js could reintroduce an older cached renderer.

The archived reklamy-sidebar.js in this directory is the exact production source for both:
- /var/www/nasekadan/reklamy-sidebar.js
- /var/www/nasekadan/reklamy-sidebar-v5.js

Both files have SHA-256:
252fd08145b3e0ba66241429ab144a6cb60b0a0e13596be155d2823a5d6b7fac

Build marker: 20261113-full-height-v1. The versioned file is intentional cache busting, not a separate implementation. Future edits must keep both production copies consistent.

## Loading

474 eligible published articles received exactly one additional versioned script tag, preserving the canonical tag required by the existing integrity guard:

<script src="/reklamy-sidebar-v5.js?v=20261113-full-height-v1" data-article-adstream="true" defer></script>

site.js now checks existing canonical and versioned sidebar script elements before injecting the versioned loader. This prevents the older duplicate-loading path. The V5 renderer also has a single-initialization guard.

The existing authorized bridge applied seven sequential batches with before/after file hashes. All 475 files (474 articles and site.js) were checked against their exact expected resulting SHA-256 values; all matched. No duplicate or missing versioned tags remained.

Batch commits:
1. fe88fc004570a1c874b9b9a1b7af2577d77e9242
2. fae3d5f6f2f35f7f288d0f80766277bf92f70d54
3. 1bf1da66fd4d49466c280f591f053468b1db26b6
4. dfd37373fe1a9e2156a1cb481a0efdebc014fb21
5. e763b827297b742c41d6f80b48220735175f3bde
6. a83a5632fed38f9aba4f22ce53d29ec4cdc74a90
7. 6a6829d027c324152c06f540d3aa6e0ac7d4bee4

Final deployment health: status=ok, source=bridge:20261113-sidebar-v5-cachefix-batch-7, generated=2026-11-13T21:14:10.951580+00:00.

## Rendered verification

Tested the original public article:
https://nasekadan.cz/clanky/sbirka-potravin-kadan-charita-kaufland-penny-14-listopadu-2026.html

Final desktop DOM measurements at 1363 x 936:
- Article height: 6178 px.
- One advertising stream with 12 cards in the measured rotation.
- Every stream image loaded.
- Maximum gap between stream cards: 18 px.
- Empty sidebar tail relative to article end: 0 px.
- Midarticle and end-of-text positions visually inspected.

Counts vary with creative dimensions and rotation; 12 is a measured result, not a fixed target.

Mobile was tested in a 390 px same-origin live article iframe:
- Two compact stream cards.
- Content width and scroll width both 375 px, with no horizontal overflow.
- Both displayed images loaded.
- Ten alternating mobile/desktop width transitions passed; the full-height stream returned on each desktop transition.

Additional public pages checked:
- https://nasekadan.cz/clanky/hokej-kadan-milevsko-osma-porazka-11-listopadu-2026.html
  All three separate required partner images (FotbalTour, FootballTime.cz, Fanda-NHL.cz) loaded. Existing affiliate destinations retained.
- https://nasekadan.cz/clanky/hasici-kadan-unik-nebezpecne-latky-silnice-23-zari-2026.html
  One stream; no empty sidebar tail. Final card extended approximately 133 px beyond the article.

Local syntax check passed for the exact final source. No advertising or affiliate links were clicked.

These are sampled rendered checks plus a full deployment/hash audit. They are not a claim that all 474 articles were individually visually inspected.

## Ongoing monitoring

The existing enabled hourly automation “Dohled nad weby a LastMinute” (6a5b57f610cc8191adcb9254ea4d2b0a) was updated without changing its hourly cadence or previous responsibilities.

It now requires actual rendered checks of the fixed article, a recent/changed article, and a sports article; desktop top/middle/end and mobile; loaded images and no large empty sidebar tail; inline/bottom advertising and the three mandatory sports partners. ADS_OK requires a current rendered check. If a browser check cannot be performed, the result must be reported as unverified rather than inferred from HTTP status or script tags.

The existing 10-minute server integrity guard remains a structural check. Its behavior was reviewed to ensure the new versioned script survives normalization.

## Maintenance and recovery

The pre-fix canonical source remains backed up at:
/var/www/nasekadan/reklamy-sidebar.js.bak.20261113-205722-949942

Any rollback must treat the canonical renderer, versioned renderer, site.js loader, and article loading tags consistently. Do not roll back one component in isolation.

Protected root-owned HTML was changed only through the existing authorized bridge. No permission changes, root bypasses, broad project-repository deployment, or webroot synchronization were used. The legacy /opt/nasekadan checkout was not synchronized or reset.

Task-created temporary candidate and noindex test pages were removed after verification. The permanent versioned renderer and recovery backups remain.
