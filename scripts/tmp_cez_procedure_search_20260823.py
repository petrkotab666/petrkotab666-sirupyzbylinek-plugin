from __future__ import annotations

import json
import re
import shutil
import xml.etree.ElementTree as ET
from decimal import Decimal
from pathlib import Path
from typing import Any

import requests

OUT = Path("tmp_cez_procedure_search_20260823")
if OUT.exists():
    shutil.rmtree(OUT)
(OUT / "raw").mkdir(parents=True)
(OUT / "parsed").mkdir(parents=True)

session = requests.Session()
session.headers.update(
    {
        "User-Agent": "Mozilla/5.0 (compatible; CEZ-procedure-primary-search/1.0)",
        "Accept": "*/*",
        "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
    }
)

API = "https://api.ted.europa.eu/v3/notices/search"
PROCEDURE_ID = "016c74a6-ac6c-450b-aeb2-577a856bdb6f"
log: list[dict[str, Any]] = []


def safe(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("_")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", errors="replace")


def post_search(name: str, query: str, fields: list[str]) -> dict[str, Any] | None:
    payload = {
        "query": query,
        "fields": fields,
        "page": 1,
        "limit": 250,
        "scope": "ALL",
        "checkQuerySyntax": False,
    }
    try:
        r = session.post(API, json=payload, timeout=180)
        (OUT / "raw" / f"{safe(name)}.json").write_bytes(r.content)
        log.append(
            {
                "name": name,
                "query": query,
                "status": r.status_code,
                "content_type": r.headers.get("content-type"),
                "bytes": len(r.content),
            }
        )
        try:
            data = r.json()
            write_text(OUT / "parsed" / f"{safe(name)}.pretty.json", json.dumps(data, ensure_ascii=False, indent=2))
            return data
        except Exception:
            return None
    except Exception as exc:
        log.append({"name": name, "query": query, "error": repr(exc)})
        return None


queries = [
    ("procedure_exact", f"procedure-identifier = {PROCEDURE_ID}"),
    ("procedure_exact_quoted", f'procedure-identifier = "{PROCEDURE_ID}"'),
    ("title_exact", 'FT = "CV_HV propoj EPR- Kadaň"'),
    ("title_ascii", 'FT = "CV_HV propoj EPR- Kadan"'),
    ("title_short", 'FT = "CV_HV propoj EPR"'),
    ("changed_award", "changed-notice-version-identifier = 615457-2025"),
]
fields_variants = [
    ["publication-number", "publication-date", "procedure-identifier", "notice-title"],
    ["publication-number"],
]

all_notices: dict[str, dict[str, Any]] = {}
for idx, (name, query) in enumerate(queries):
    data = post_search(name, query, fields_variants[0])
    if not isinstance(data, dict) or "notices" not in data:
        data = post_search(name + "_minimal", query, fields_variants[1])
    if not isinstance(data, dict):
        continue
    for item in data.get("notices") or []:
        if isinstance(item, dict) and isinstance(item.get("publication-number"), str):
            all_notices[item["publication-number"]] = item

# Known June modification, original award and broad date-neighbour candidates can be
# completed later once the procedure query yields the publication numbers.
all_notices.setdefault("439224-2026", {"publication-number": "439224-2026"})
all_notices.setdefault("615457-2025", {"publication-number": "615457-2025"})

write_text(OUT / "parsed" / "all_api_notices.json", json.dumps(all_notices, ensure_ascii=False, indent=2))


def local(tag: str) -> str:
    return tag.split("}")[-1]


def element_text(element: ET.Element | None) -> str:
    if element is None:
        return ""
    return " ".join(" ".join(element.itertext()).split())


def direct_values(root: ET.Element, wanted: set[str]) -> list[dict[str, Any]]:
    values: list[dict[str, Any]] = []
    for el in root.iter():
        lname = local(el.tag)
        if lname in wanted:
            text = element_text(el)
            if text:
                values.append({"tag": lname, "text": text, "attrs": dict(el.attrib)})
    return values


def parse_notice(pub: str, xml: bytes) -> dict[str, Any]:
    root = ET.fromstring(xml)
    parsed: dict[str, Any] = {
        "publication_number": pub,
        "root": local(root.tag),
        "uuid": next((element_text(e) for e in root.iter() if local(e.tag) == "UUID"), None),
        "issue_date": next((element_text(e) for e in root.iter() if local(e.tag) == "IssueDate"), None),
        "procedure_ids": [],
        "modifications": [],
        "amounts": [],
        "dates_and_durations": [],
    }

    # Collect procedure identifiers and procurement project IDs.
    for el in root.iter():
        lname = local(el.tag)
        if lname in {"ContractFolderID", "ID", "ProcedureIdentifier"}:
            text = element_text(el)
            attrs = dict(el.attrib)
            if text and (
                lname != "ID"
                or attrs.get("schemeName") in {"procedure", "notice", "contract", "result", "tender", "lot"}
                or text == PROCEDURE_ID
                or text.startswith("Z2024-")
            ):
                parsed["procedure_ids"].append({"tag": lname, "text": text, "attrs": attrs})

    # Full contract-modification subtree(s).
    for mod in [e for e in root.iter() if local(e.tag) == "ContractModification"]:
        item: dict[str, Any] = {
            "changed_notice_identifier": None,
            "modified_contract_identifier": None,
            "change_descriptions": [],
            "reason_codes": [],
            "reason_descriptions": [],
            "all_fields": [],
        }
        for el in mod.iter():
            lname = local(el.tag)
            text = element_text(el)
            if not text:
                continue
            field = {"tag": lname, "text": text, "attrs": dict(el.attrib)}
            if lname == "ChangedNoticeIdentifier":
                item["changed_notice_identifier"] = text
            elif lname == "ModifiedContractIdentifier":
                item["modified_contract_identifier"] = text
            elif lname == "ChangeDescription":
                item["change_descriptions"].append(field)
            elif lname == "ReasonCode":
                item["reason_codes"].append(field)
            elif lname == "ReasonDescription":
                item["reason_descriptions"].append(field)
            if lname not in {"ContractModification", "Change", "ChangeReason"}:
                item["all_fields"].append(field)
        parsed["modifications"].append(item)

    # Monetary and time fields from the entire notice.
    for el in root.iter():
        lname = local(el.tag)
        text = element_text(el)
        if not text:
            continue
        attrs = dict(el.attrib)
        if lname.endswith("Amount") or lname in {"TaxExclusiveAmount", "TaxInclusiveAmount"}:
            parsed["amounts"].append({"tag": lname, "text": text, "attrs": attrs})
        if lname.endswith("Date") or "Duration" in lname or lname in {"StartTime", "EndTime"}:
            parsed["dates_and_durations"].append({"tag": lname, "text": text, "attrs": attrs})

    # Deduplicate exact repeated entries while preserving order.
    for key in ("procedure_ids", "amounts", "dates_and_durations"):
        seen: set[str] = set()
        unique = []
        for item in parsed[key]:
            marker = json.dumps(item, sort_keys=True, ensure_ascii=False)
            if marker not in seen:
                seen.add(marker)
                unique.append(item)
        parsed[key] = unique
    return parsed


parsed_notices: dict[str, Any] = {}
for pub in sorted(all_notices):
    url = f"https://ted.europa.eu/en/notice/{pub}/xml"
    try:
        r = session.get(url, timeout=180, allow_redirects=True)
        path = OUT / "raw" / f"{safe(pub)}.xml"
        path.write_bytes(r.content)
        log.append(
            {
                "name": f"xml_{pub}",
                "url": url,
                "final_url": r.url,
                "status": r.status_code,
                "content_type": r.headers.get("content-type"),
                "bytes": len(r.content),
            }
        )
        if r.status_code == 200 and r.content.lstrip().startswith(b"<"):
            parsed = parse_notice(pub, r.content)
            parsed_notices[pub] = parsed
            write_text(OUT / "parsed" / f"{safe(pub)}.parsed.json", json.dumps(parsed, ensure_ascii=False, indent=2))
    except Exception as exc:
        log.append({"name": f"xml_{pub}", "url": url, "error": repr(exc)})

# Build a readable evidence report.
report: list[str] = [
    "# CEZ EPR–Kadaň – TED procedure search and parsed modifications",
    "",
    f"Procedure identifier: `{PROCEDURE_ID}`",
    "",
    "## Notices returned by TED Search API",
    "",
]
for pub, item in sorted(all_notices.items()):
    report.append(
        f"- **{pub}** — publication date: {item.get('publication-date', 'unknown')}; procedure: {item.get('procedure-identifier', 'unknown')}"
    )

for pub, parsed in sorted(parsed_notices.items()):
    report.extend(["", f"## {pub}", ""])
    report.append(f"- Root form: `{parsed.get('root')}`")
    report.append(f"- Issue date: `{parsed.get('issue_date')}`")
    if parsed.get("amounts"):
        report.append("- Monetary fields:")
        for a in parsed["amounts"]:
            report.append(f"  - `{a['tag']}` = **{a['text']} {a.get('attrs', {}).get('currencyID', '')}**")
    if parsed.get("dates_and_durations"):
        report.append("- Dates/durations:")
        for d in parsed["dates_and_durations"]:
            report.append(f"  - `{d['tag']}` = `{d['text']}` {d.get('attrs', {})}")
    for index, mod in enumerate(parsed.get("modifications") or [], start=1):
        report.extend(["", f"### Modification {index}", ""])
        report.append(f"- Changed notice: `{mod.get('changed_notice_identifier')}`")
        report.append(f"- Modified contract: `{mod.get('modified_contract_identifier')}`")
        for rc in mod.get("reason_codes") or []:
            report.append(f"- Reason code: `{rc['text']}` ({rc.get('attrs', {})})")
        for desc in mod.get("change_descriptions") or []:
            report.extend(["", "**Change description (full):**", "", desc["text"], ""])
        for desc in mod.get("reason_descriptions") or []:
            report.extend(["", "**Reason description (full):**", "", desc["text"], ""])

# Compare unique total/payable amounts against the original known contract amount.
original = Decimal("427724562.68")
report.extend(["", "## Amount comparison against original contract", ""])
for pub, parsed in sorted(parsed_notices.items()):
    numbers: set[Decimal] = set()
    for amount in parsed.get("amounts") or []:
        try:
            numbers.add(Decimal(amount["text"]))
        except Exception:
            pass
    for number in sorted(numbers):
        if number > Decimal("1000000"):
            report.append(f"- {pub}: {number} CZK; difference from original = **{number - original} CZK**")

write_text(OUT / "EVIDENCE_REPORT.md", "\n".join(report))
write_text(OUT / "parsed" / "all_parsed_notices.json", json.dumps(parsed_notices, ensure_ascii=False, indent=2))
write_text(OUT / "request_log.json", json.dumps(log, ensure_ascii=False, indent=2))
print("Notices:", ", ".join(sorted(all_notices)))
