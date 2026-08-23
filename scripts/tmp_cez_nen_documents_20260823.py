from __future__ import annotations

import html
import json
import re
import shutil
import urllib.parse
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

BASE = "https://nen.nipez.cz/verejne-zakazky/detail-zakazky/N006-24-V00019426"
OUT = Path("tmp_cez_nen_documents_20260823")
if OUT.exists():
    shutil.rmtree(OUT)
(OUT / "pages").mkdir(parents=True)
(OUT / "files").mkdir(parents=True)
(OUT / "parsed").mkdir(parents=True)

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; CEZ-NEN-document-research/1.0)",
    "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
})
log: list[dict[str, Any]] = []


def safe(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("_")[:180]


def fetch(url: str, name: str) -> requests.Response | None:
    try:
        r = s.get(url, timeout=180, allow_redirects=True)
        suffix = "html"
        ct = (r.headers.get("content-type") or "").lower()
        if "pdf" in ct or r.content.startswith(b"%PDF"):
            suffix = "pdf"
        elif "zip" in ct or r.content.startswith(b"PK"):
            suffix = "zip"
        elif "json" in ct:
            suffix = "json"
        elif "xml" in ct:
            suffix = "xml"
        path = OUT / ("files" if suffix != "html" else "pages") / f"{safe(name)}.{suffix}"
        path.write_bytes(r.content)
        log.append({"name": name, "url": url, "final": r.url, "status": r.status_code, "type": ct, "bytes": len(r.content), "path": str(path)})
        return r
    except Exception as exc:
        log.append({"name": name, "url": url, "error": repr(exc)})
        return None


def initial_state(response: requests.Response) -> dict[str, Any] | None:
    soup = BeautifulSoup(response.text, "html.parser")
    meta = soup.find("meta", attrs={"name": "initialReduxState"})
    if not meta or not meta.get("content"):
        return None
    raw = html.unescape(meta["content"])
    # Browsers receive a percent-encoded JSON string.
    decoded = urllib.parse.unquote(raw)
    return json.loads(decoded)


def walk(obj: Any, path: str = "$"):
    yield path, obj
    if isinstance(obj, dict):
        for key, value in obj.items():
            yield from walk(value, f"{path}.{key}")
    elif isinstance(obj, list):
        for idx, value in enumerate(obj):
            yield from walk(value, f"{path}[{idx}]")


responses: dict[str, requests.Response] = {}
for label, url in {
    "main": BASE,
    "documents": BASE + "/zadavaci-dokumentace",
    "explanations": BASE + "/vysvetleni-zadavaci-dokumentace",
    "result": BASE + "/vysledek",
}.items():
    r = fetch(url, label)
    if r is not None:
        responses[label] = r

states: dict[str, dict[str, Any]] = {}
for label, r in responses.items():
    try:
        st = initial_state(r)
        if st:
            states[label] = st
            (OUT / "parsed" / f"state_{label}.json").write_text(json.dumps(st, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as exc:
        log.append({"name": f"parse_state_{label}", "error": repr(exc)})

# Inventory collections and determine pagination filters.
collections_inventory: list[dict[str, Any]] = []
for label, st in states.items():
    collections = (((st.get("collectionStore") or {}).get("collections")) or {})
    for key, coll in collections.items():
        if not isinstance(coll, dict):
            continue
        items = coll.get("collection") if isinstance(coll.get("collection"), list) else []
        collections_inventory.append({
            "page": label,
            "key": key,
            "count": coll.get("count"),
            "onPage": coll.get("onPage"),
            "filterParamName": ((coll.get("paramNames") or {}).get("filterParamName")),
            "routeParamName": ((coll.get("paramNames") or {}).get("routeParamName")),
            "items": items,
        })

(OUT / "parsed" / "collections_inventory.json").write_text(json.dumps(collections_inventory, ensure_ascii=False, indent=2), encoding="utf-8")

# Fetch pagination pages for collections that look relevant and contain more rows.
page_states: list[tuple[str, dict[str, Any]]] = []
for inv in collections_inventory:
    count = inv.get("count")
    per = inv.get("onPage") or 10
    filt = inv.get("filterParamName")
    if not isinstance(count, int) or count <= per or not filt:
        continue
    key_l = str(inv.get("key", "")).lower()
    if not any(term in key_l for term in ("dokument", "evidence", "vysv", "vysled", "prilo", "soubor")):
        continue
    pages = min(20, (count + per - 1) // per)
    for page_no in range(2, pages + 1):
        encoded = urllib.parse.quote(f"p:{filt}:page={page_no}", safe="")
        url = BASE + "/" + encoded
        r = fetch(url, f"pagination_{safe(inv['key'])}_{page_no}")
        if r is None:
            continue
        try:
            st = initial_state(r)
            if st:
                page_states.append((f"{inv['key']}_page_{page_no}", st))
        except Exception as exc:
            log.append({"name": f"parse_page_{inv['key']}_{page_no}", "error": repr(exc)})

# Collate all dict objects containing likely document or publication metadata.
interesting_objects: list[dict[str, Any]] = []
seen_markers: set[str] = set()
all_state_sources = list(states.items()) + page_states
needle = re.compile(r"(dokument|soubor|příloh|prilo|vysvětlen|vysvetlen|smlouv|dodatek|výsledek|vysledek|pdps|dur|sitez|geolog|hydro|evidCisloForm|datumUverejneni)", re.I)
for source, st in all_state_sources:
    for path, obj in walk(st):
        if not isinstance(obj, dict):
            continue
        blob = json.dumps(obj, ensure_ascii=False)
        if needle.search(path) or needle.search(blob):
            marker = json.dumps(obj, sort_keys=True, ensure_ascii=False)
            if marker in seen_markers:
                continue
            seen_markers.add(marker)
            interesting_objects.append({"source": source, "path": path, "object": obj})

(OUT / "parsed" / "interesting_objects.json").write_text(json.dumps(interesting_objects, ensure_ascii=False, indent=2), encoding="utf-8")

# Extract candidate IDs and fetch document/detail pages.
candidate_ids: dict[str, set[str]] = {}
for entry in interesting_objects:
    obj = entry["object"]
    for key, value in obj.items():
        if not isinstance(value, (str, int)):
            continue
        kl = key.lower()
        if kl == "id" or kl.endswith("id") or "soubor" in kl or "dokument" in kl:
            sv = str(value)
            if re.fullmatch(r"\d{7,12}", sv):
                candidate_ids.setdefault(sv, set()).add(f"{entry['source']}:{entry['path']}:{key}")

# The known VVZ evidence IDs and publication evidence IDs from initial state.
for extra in ["4566297342", "4530620753", "4313953565", "3287467525", "3287462484", "3287462405"]:
    candidate_ids.setdefault(extra, set()).add("known")

(OUT / "parsed" / "candidate_ids.json").write_text(json.dumps({k: sorted(v) for k, v in candidate_ids.items()}, ensure_ascii=False, indent=2), encoding="utf-8")

found_links: list[dict[str, Any]] = []
for cid, origins in sorted(candidate_ids.items()):
    urls = [
        f"https://nen.nipez.cz/vestnik/detail-info/{cid}",
        f"{BASE}/zadavaci-dokumentace/detail-dokument/{cid}",
        f"{BASE}/vysledek/detail-dokument/{cid}",
        f"{BASE}/detail-dokument/{cid}",
    ]
    for idx, url in enumerate(urls):
        r = fetch(url, f"detail_{cid}_{idx}")
        if r is None or r.status_code != 200 or "text/html" not in (r.headers.get("content-type") or ""):
            continue
        soup = BeautifulSoup(r.text, "html.parser")
        title = soup.get_text(" ", strip=True)[:500]
        # Skip generic not-found/error pages.
        if not any(x in title.lower() for x in ("detail dokumentu", "detail uveřejnění", "detail uverejneni", "věstník", "vestnik", "oznámení")):
            continue
        links = []
        for a in soup.find_all("a", href=True):
            href = urllib.parse.urljoin(r.url, a["href"])
            text = a.get_text(" ", strip=True)
            if any(x in href.lower() for x in ("/file?", "soubor.aspx", ".pdf", ".zip", ".doc", ".xlsx", "ted.europa", "vvz.nipez")):
                links.append({"text": text, "href": href})
        found_links.append({"id": cid, "origins": sorted(origins), "url": r.url, "title": title, "links": links})
        for link_index, link in enumerate(links):
            if "/file?" in link["href"].lower() or "soubor.aspx" in link["href"].lower():
                fetch(link["href"], f"file_{cid}_{link_index}_{safe(link['text'] or 'download')}")

(OUT / "parsed" / "found_detail_links.json").write_text(json.dumps(found_links, ensure_ascii=False, indent=2), encoding="utf-8")

# Human-readable report.
report = [
    "# NEN hidden document inventory – CV_HV propoj EPR–Kadaň",
    "",
    "## Collections",
    "",
    "|Page|Key|Count|Page size|Filter|",
    "|---|---|---:|---:|---|",
]
for inv in collections_inventory:
    report.append(f"|{inv['page']}|{inv['key']}|{inv.get('count')}|{inv.get('onPage')}|{inv.get('filterParamName')}|")
report += ["", "## Detail pages and download links", ""]
for item in found_links:
    report.append(f"### ID {item['id']}")
    report.append(f"- Page: {item['url']}")
    report.append(f"- Title/text: {item['title'][:300]}")
    for link in item["links"]:
        report.append(f"- Download: {link['text']} — {link['href']}")
    report.append("")
(OUT / "REPORT.md").write_text("\n".join(report), encoding="utf-8")
(OUT / "request_log.json").write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")
print("collections", len(collections_inventory), "objects", len(interesting_objects), "ids", len(candidate_ids), "detail pages", len(found_links))
