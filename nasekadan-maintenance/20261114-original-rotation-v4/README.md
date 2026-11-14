# NašeKadaň: restore the original homepage ad rotation

Date: 2026-11-14
Production build: `20261114-original-rotation-v4`

## Reason and scope

The seasonal Christmas-cleaning campaign was rewriting the original homepage
carousel's advertising anchor after every carousel paint. Its Čištění / Úklid /
Mytí oken controls continued to change while the displayed creative remained the
Christmas banner.

The corrected seasonal script excludes `.nk-uklizecka-rotation` from its banner
writers, anchor observers, blanket replacements, consecutive-campaign selection
and campaign placement counts. The original three-photo carousel controls,
destinations and automatic rotation remain owned by the original carousel.
Separate Christmas-cleaning placements, Shapehelm replacement placements and
other advertising rules are preserved.

All three seasonal-script loaders now request
`/predvanocni-cisteni-20261113.js?v=20261114-original-rotation-v4`.

## Exact production source snapshot

These files were retrieved from the live public URLs after the guarded production
edit and matched independently calculated SHA-256 values on the connected server.
Each file maps directly to `/var/www/nasekadan/<filename>`.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| predvanocni-cisteni-20261113.js | 16422 | 48bd2632563c61d22d0cdb7a0b7070d97012a1d8ef2b584be0208c8e33028181 |
| reklamy.js | 235694 | a1d96c63c3bf320f2d2efeeb7b5423212c928c23c16adfa1643e1e6214ca8c69 |
| reklamy-sidebar.js | 24706 | ebe6d0ef7c4e5a61b669fe3be9503a7705f9cae1db47cc0a812a61792d89e527 |
| reklamy-sidebar-v5.js | 24706 | ebe6d0ef7c4e5a61b669fe3be9503a7705f9cae1db47cc0a812a61792d89e527 |

The canonical `reklamy-sidebar.js` and versioned `reklamy-sidebar-v5.js`
are intentional production aliases and must remain byte-identical. Articles can
load the versioned alias. Future loader edits must update both.

## Deployment and recovery

The four production files were edited directly through the existing authorized
host connection with exact prior-content guards and backups. Backups are at:

`/mnt/ovh-data/pracovna-v2/nasekadan-ad-rotation-backup-20261114T1838`

This commit is a source archive only. It does not change
`nasekadan-live/manifest.json`, the bridge deployment version, previous recovery
snapshots, or any production file. It does not request a broad deployment.

The legacy `/opt/nasekadan` checkout and older main-repository advertising files
lack current live changes. Do not synchronize them over production to install or
restore this narrowly scoped fix. The existing bridge root-path allowlist does
not include these four files; its policy was not changed.

The inspected listing-refresh job does not rewrite these JavaScript assets.
The inspected advertising-integrity job preserves the existing renderer and
adds specific unrelated guards; it does not overwrite these campaign loaders.
