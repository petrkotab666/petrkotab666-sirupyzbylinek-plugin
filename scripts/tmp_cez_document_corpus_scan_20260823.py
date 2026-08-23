from __future__ import annotations

import hashlib
import html
import io
import json
import re
import shutil
import urllib.parse
import zipfile
from collections import defaultdict
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader

ROOT = Path("tmp_cez_document_corpus_scan_20260823")
if ROOT.exists():
    shutil.rmtree(ROOT)
(ROOT / "downloads").mkdir(parents=True)
(ROOT / "texts").mkdir(parents=True)

SOURCE_DIRS = [
    Path("tmp_cez_nen_documents_20260823/files"),
    Path("tmp_cez_primary_research_20260823/raw"),
]
BASE = "https://nen.nipez.cz/verejne-zakazky/detail-zakazky/N006-24-V00019426"
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; CEZ-document-corpus-research/1.0)",
    "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
})

log: list[dict[str, Any]] = []
records: list[dict[str, Any]] = []
archive_members: list[dict[str, Any]] = []


def safe(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("_")[:190]


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fetch(url: str, label: str) -> tuple[bytes | None, str | None]:
    try:
        r = SESSION.get(url, timeout=180, allow_redirects=True)
        ct = (r.headers.get("content-type") or "").lower()
        ext = "html"
        if "pdf" in ct or r.content.startswith(b"%PDF"):
            ext = "pdf"
        elif "zip" in ct or r.content.startswith(b"PK"):
            ext = "zip"
        elif "json" in ct:
            ext = "json"
        elif "xml" in ct:
            ext = "xml"
        path = ROOT / "downloads" / f"{safe(label)}.{ext}"
        path.write_bytes(r.content)
        log.append({"label": label, "url": url, "final": r.url, "status": r.status_code, "type": ct, "bytes": len(r.content), "path": str(path)})
        return r.content, r.url
    except Exception as exc:
        log.append({"label": label, "url": url, "error": repr(exc)})
        return None, None


def parse_state(raw_html: str) -> dict[str, Any] | None:
    soup = BeautifulSoup(raw_html, "html.parser")
    meta = soup.find("meta", attrs={"name": "initialReduxState"})
    if not meta or not meta.get("content"):
        return None
    return json.loads(urllib.parse.unquote(html.unescape(meta["content"])))


def walk(obj: Any, path: str = "$"):
    yield path, obj
    if isinstance(obj, dict):
        for key, value in obj.items():
            yield from walk(value, f"{path}.{key}")
    elif isinstance(obj, list):
        for idx, value in enumerate(obj):
            yield from walk(value, f"{path}[{idx}]")


# Fetch the result publication, nested contract record, written report, participants,
# and the three modification evidence records through their exact NEN routes.
specific_urls = {
    "result_publication": f"{BASE}/detail-info/3287462405",
    "contract_nested": f"{BASE}/detail-info/3287462405/detail-uverejneni/3287463593",
    "written_report": f"{BASE}/detail-info/3287467525",
    "participants": f"{BASE}/detail-info/3287462484",
    "mod_april": f"{BASE}/detail-info/4313953565",
    "mod_june": f"{BASE}/detail-info/4530620753",
    "mod_july": f"{BASE}/detail-info/4566297342",
    "vestnik_result": "https://nen.nipez.cz/vestnik/detail-info/3287462405",
    "vestnik_written_report": "https://nen.nipez.cz/vestnik/detail-info/3287467525",
    "vestnik_mod_april": "https://nen.nipez.cz/vestnik/detail-info/4313953565",
    "vestnik_mod_june": "https://nen.nipez.cz/vestnik/detail-info/4530620753",
    "vestnik_mod_july": "https://nen.nipez.cz/vestnik/detail-info/4566297342",
}
for label, url in specific_urls.items():
    data, final = fetch(url, label)
    if not data or not data.lstrip().startswith(b"<"):
        continue
    text = data.decode("utf-8", "replace")
    soup = BeautifulSoup(text, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = urllib.parse.urljoin(final or url, a["href"])
        title = a.get_text(" ", strip=True)
        if any(token in href.lower() for token in ("/file?", "soubor.aspx", ".pdf", ".zip", ".doc", ".xls")):
            links.append({"title": title, "url": href})
    state = None
    try:
        state = parse_state(text)
        if state is not None:
            (ROOT / "texts" / f"state_{safe(label)}.json").write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
            # Search state recursively for direct file URLs/IDs, names and contract metadata.
            for path, obj in walk(state):
                if isinstance(obj, str) and ("/file?" in obj.lower() or "soubor.aspx" in obj.lower()):
                    links.append({"title": path, "url": urllib.parse.urljoin(final or url, obj)})
    except Exception as exc:
        log.append({"label": label + "_state_parse", "error": repr(exc)})
    unique_links = []
    seen = set()
    for item in links:
        if item["url"] not in seen:
            seen.add(item["url"])
            unique_links.append(item)
    (ROOT / "texts" / f"links_{safe(label)}.json").write_text(json.dumps(unique_links, ensure_ascii=False, indent=2), encoding="utf-8")
    for idx, item in enumerate(unique_links):
        fetch(item["url"], f"{label}_{idx}_{item['title'] or 'file'}")


def pdf_text(data: bytes) -> tuple[str, int]:
    reader = PdfReader(io.BytesIO(data))
    chunks = []
    for page_no, page in enumerate(reader.pages, start=1):
        chunks.append(f"\n\n===== PAGE {page_no} =====\n")
        chunks.append(page.extract_text() or "")
    return "".join(chunks), len(reader.pages)


def docx_text(data: bytes) -> str:
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        xml = z.read("word/document.xml").decode("utf-8", "replace")
    xml = re.sub(r"</w:p>", "\n", xml)
    return html.unescape(re.sub(r"<[^>]+>", "", xml))


def xlsx_text(data: bytes) -> str:
    # Lightweight extraction from shared strings and worksheet XML, avoiding a full workbook load.
    out = []
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        for name in z.namelist():
            if name == "xl/sharedStrings.xml" or name.startswith("xl/worksheets/sheet"):
                xml = z.read(name).decode("utf-8", "replace")
                text = html.unescape(re.sub(r"<[^>]+>", " ", xml))
                out.append(f"\n===== {name} =====\n{text}")
    return "\n".join(out)


def ingest_bytes(display_name: str, data: bytes, origin: str, depth: int = 0) -> None:
    digest = sha256(data)
    suffix = Path(display_name).suffix.lower()
    rec: dict[str, Any] = {"name": display_name, "origin": origin, "bytes": len(data), "sha256": digest, "suffix": suffix, "depth": depth}
    text = ""
    pages = None
    try:
        if data.startswith(b"%PDF") or suffix == ".pdf":
            text, pages = pdf_text(data)
        elif data.startswith(b"PK") or suffix in {".zip", ".docx", ".xlsx", ".xlsm"}:
            if suffix == ".docx":
                text = docx_text(data)
            elif suffix in {".xlsx", ".xlsm"}:
                text = xlsx_text(data)
            elif zipfile.is_zipfile(io.BytesIO(data)) and depth < 4:
                with zipfile.ZipFile(io.BytesIO(data)) as z:
                    members = z.namelist()
                    archive_members.append({"archive": display_name, "origin": origin, "members": members})
                    for member in members:
                        if member.endswith("/"):
                            continue
                        try:
                            member_data = z.read(member)
                            ingest_bytes(member, member_data, origin + "!" + member, depth + 1)
                        except Exception as exc:
                            log.append({"label": "archive_member", "archive": display_name, "member": member, "error": repr(exc)})
        elif suffix in {".txt", ".csv", ".xml", ".html", ".htm", ".json", ".md"} or data.lstrip().startswith((b"<", b"{", b"[")):
            text = data.decode("utf-8", "replace")
    except Exception as exc:
        rec["extract_error"] = repr(exc)
    rec["pages"] = pages
    rec["text_chars"] = len(text)
    if text:
        text_path = ROOT / "texts" / f"{safe(display_name)}_{digest[:10]}.txt"
        text_path.write_text(text, encoding="utf-8", errors="replace")
        rec["text_path"] = str(text_path)
    records.append(rec)


# Ingest downloaded material and the already retrieved NEN corpus.
seen_files = set()
for directory in SOURCE_DIRS + [ROOT / "downloads"]:
    if not directory.exists():
        continue
    for path in directory.rglob("*"):
        if not path.is_file():
            continue
        marker = (path.resolve(), path.stat().st_size)
        if marker in seen_files:
            continue
        seen_files.add(marker)
        try:
            ingest_bytes(path.name, path.read_bytes(), str(path))
        except Exception as exc:
            log.append({"label": "ingest", "path": str(path), "error": repr(exc)})

# Keep only one record per digest/name combination for reporting.
unique_records = []
seen_record = set()
for rec in records:
    marker = (rec["sha256"], rec["name"])
    if marker not in seen_record:
        seen_record.add(marker)
        unique_records.append(rec)
records = unique_records

TERMS = {
    "groundwater": [r"podzemn.{0,4}vod", r"hladin.{0,10}podzemn", r"groundwater"],
    "hydrogeology": [r"hydrogeolog", r"geologick.{0,20}průzkum", r"geotechn"],
    "pumping": [r"čerpán.{0,12}vod", r"odvodněn", r"pumping", r"drenáž"],
    "vhn_induction": [r"VVN", r"ZVN", r"indukc", r"bludn.{0,8}proud", r"FeZn", r"stožár", r"patk.{0,10}stož"],
    "utilities": [r"inženýrsk.{0,10}sít", r"plynovod", r"vodovod", r"kabel.{0,10}6.?kV", r"vytyčen.{0,10}sít"],
    "changes": [r"§\s*222", r"člán.{0,8}23", r"skryt.{0,10}překáž", r"nepředvíd", r"dodatek", r"změnov.{0,8}list"],
    "milestones": [r"milník", r"M[1-9]\b", r"harmonogram", r"termín převzetí"],
    "designers": [r"zpracovatel.{0,12}PDPS", r"projektant", r"autorsk.{0,8}dozor", r"SITEZ", r"DUR", r"PDPS", r"RPD"],
    "liability": [r"odpovědnost.{0,20}projekt", r"náhrad.{0,8}škod", r"reklamac", r"vady projekt", r"smluvn.{0,8}pokut"],
}
compiled = {category: [re.compile(p, re.I | re.S) for p in patterns] for category, patterns in TERMS.items()}

hits: list[dict[str, Any]] = []
for rec in records:
    text_path = rec.get("text_path")
    if not text_path:
        continue
    text = Path(text_path).read_text(encoding="utf-8", errors="replace")
    compact = re.sub(r"\s+", " ", text)
    for category, patterns in compiled.items():
        found_positions = []
        for pattern in patterns:
            for match in pattern.finditer(compact):
                found_positions.append((match.start(), match.group(0)))
        for pos, match_text in sorted(found_positions)[:25]:
            start = max(0, pos - 400)
            end = min(len(compact), pos + 900)
            hits.append({
                "category": category,
                "name": rec["name"],
                "origin": rec["origin"],
                "match": match_text,
                "excerpt": compact[start:end],
                "sha256": rec["sha256"],
            })

# Deduplicate near-identical excerpts.
unique_hits = []
seen_hit = set()
for hit in hits:
    marker = (hit["category"], hit["sha256"], re.sub(r"\W+", "", hit["excerpt"].lower())[:250])
    if marker not in seen_hit:
        seen_hit.add(marker)
        unique_hits.append(hit)
hits = unique_hits

# Document inventory and category reports.
(ROOT / "records.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "archive_members.json").write_text(json.dumps(archive_members, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "hits.json").write_text(json.dumps(hits, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "request_log.json").write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")

report = [
    "# Full document-corpus scan: CV_HV propoj EPR–Kadaň",
    "",
    f"- Ingested records: **{len(records)}**",
    f"- Archives opened: **{len(archive_members)}**",
    f"- Distinct contextual hits: **{len(hits)}**",
    "",
    "## Archive listings",
    "",
]
for archive in archive_members:
    report.append(f"### {archive['archive']} ({archive['origin']})")
    for member in archive["members"]:
        report.append(f"- `{member}`")
    report.append("")

by_category: dict[str, list[dict[str, Any]]] = defaultdict(list)
for hit in hits:
    by_category[hit["category"]].append(hit)
for category in TERMS:
    report += ["", f"## {category}", ""]
    category_hits = by_category.get(category, [])
    if not category_hits:
        report.append("No hits.")
        continue
    for hit in category_hits[:120]:
        report += [
            f"### {hit['name']}",
            f"Origin: `{hit['origin']}`",
            f"Matched: `{hit['match']}`",
            "",
            hit["excerpt"],
            "",
        ]
(ROOT / "REPORT.md").write_text("\n".join(report), encoding="utf-8")

# Smaller decisive report containing only the four most relevant categories.
decisive = ["# Decisive underground-condition evidence", ""]
for category in ("groundwater", "hydrogeology", "pumping", "vhn_induction", "liability"):
    decisive += [f"## {category}", ""]
    for hit in by_category.get(category, [])[:80]:
        decisive += [f"### {hit['name']}", f"`{hit['origin']}`", "", hit["excerpt"], ""]
(ROOT / "DECISIVE_HITS.md").write_text("\n".join(decisive), encoding="utf-8")
print(json.dumps({"records": len(records), "archives": len(archive_members), "hits": len(hits), "categories": {k: len(v) for k, v in by_category.items()}}, ensure_ascii=False))
