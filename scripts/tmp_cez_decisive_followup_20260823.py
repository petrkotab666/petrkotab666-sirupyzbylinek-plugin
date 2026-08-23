from __future__ import annotations

import csv
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

ROOT = Path("tmp_cez_decisive_followup_20260823")
if ROOT.exists():
    shutil.rmtree(ROOT)
(ROOT / "downloads").mkdir(parents=True)
(ROOT / "reports").mkdir(parents=True)

TEXT_DIR = Path("tmp_cez_document_corpus_scan_20260823/texts")
CONTRACT = TEXT_DIR / "ZD__st_4_N_vrh_Smlouvy_ZD__st_4_N_vrh_Smlouvy.docx_98cb56c329.txt"
TECH = TEXT_DIR / "ZD__st_4_N_vrh_Smlouvy_ZD__st_4_P_loha_01_Technick_specifikace_D_la_Objednatele.docx_20f6ba42d0.txt"
DOCREQ = TEXT_DIR / "ZD__st_4_N_vrh_Smlouvy_ZD__st_4_P_loha_04_Po_adavky_na_dokumentaci.docx_1c7505279c.txt"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; CEZ-decisive-followup/1.0)",
    "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
})
request_log: list[dict[str, Any]] = []


def safe(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("_")[:180]


def get(url: str, label: str, timeout: int = 180) -> requests.Response | None:
    try:
        r = session.get(url, timeout=timeout, allow_redirects=True)
        ct = (r.headers.get("content-type") or "").lower()
        ext = "html"
        if "csv" in ct: ext = "csv"
        elif "json" in ct: ext = "json"
        elif "zip" in ct or r.content.startswith(b"PK"): ext = "zip"
        elif "pdf" in ct or r.content.startswith(b"%PDF"): ext = "pdf"
        elif "xml" in ct: ext = "xml"
        path = ROOT / "downloads" / f"{safe(label)}.{ext}"
        path.write_bytes(r.content)
        request_log.append({"label": label, "url": url, "final": r.url, "status": r.status_code, "type": ct, "bytes": len(r.content), "path": str(path)})
        return r
    except Exception as exc:
        request_log.append({"label": label, "url": url, "error": repr(exc)})
        return None


def context_report(path: Path, groups: dict[str, list[str]], before: int = 900, after: int = 2600) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    compact = re.sub(r"[ \t\r\f\v]+", " ", text)
    report = [f"# Context extraction: {path.name}", ""]
    for title, patterns in groups.items():
        report += [f"## {title}", ""]
        found: list[tuple[int, int, str]] = []
        for pat in patterns:
            for m in re.finditer(pat, compact, flags=re.I | re.S):
                found.append((m.start(), m.end(), m.group(0)))
        found.sort()
        emitted = 0
        last = -100000
        for start, end, match in found:
            if start - last < 500:
                continue
            last = start
            line = compact.count("\n", 0, start) + 1
            excerpt = compact[max(0, start-before):min(len(compact), end+after)]
            report += [f"### Approx. line {line}", f"Matched: `{match}`", "", excerpt, ""]
            emitted += 1
            if emitted >= 15:
                break
        if emitted == 0:
            report.append("No match.\n")
    return "\n".join(report)


contract_groups = {
    "Article 23 and change procedure": [
        r"(?:Článek|čl\.)\s*23\b",
        r"23\.?\s+Změn",
        r"Návrh Změny",
        r"Změna Díla",
        r"změnový list",
    ],
    "Price completeness and extra costs": [
        r"8\.4\b",
        r"Cena Díla je úpln",
        r"úplnost Ceny",
        r"nárok na zvýšení Ceny",
        r"zvýšení ceny Díla",
        r"veškeré náklady",
    ],
    "Time extensions and milestones": [
        r"prodloužení.{0,80}Termín",
        r"posun.{0,80}Termín",
        r"Milník",
        r"Harmonogram",
        r"Termín dokončení",
    ],
    "Hidden obstacles and statutory risk": [
        r"skryt.{0,20}překáž",
        r"§\s*2627",
        r"§\s*2620",
        r"změn.{0,20}okolnost",
        r"nepředvíd",
    ],
    "Survey and underground-risk allocation": [
        r"geolog",
        r"hydrogeolog",
        r"podzemn.{0,12}vod",
        r"inženýrsk.{0,12}sít",
        r"průzkum",
        r"odvodněn",
    ],
    "Liability, defects and damages": [
        r"vada.{0,30}projekt",
        r"vady Dokumentace",
        r"náhrad.{0,20}škod",
        r"odpovědnost",
        r"reklamac",
        r"smluvní pokut",
    ],
}
(ROOT / "reports" / "CONTRACT_CLAUSES.md").write_text(context_report(CONTRACT, contract_groups), encoding="utf-8")

tech_groups = {
    "Owner did not perform geology/hydrogeology": [r"Geologick.{0,12}hydrogeologick.{0,90}nebyl.{0,40}Objednatelem zpracov"],
    "Groundwater drainage duty": [r"odvodnění základové spáry.{0,180}spodních vod"],
    "Utility survey/staking duty": [r"doplňkový místní průzkum.{0,180}inženýrských sítí", r"ověřena poloha.{0,180}inženýrských sítí"],
    "Stray-current duty": [r"zhodnotí vliv bludných proudů", r"ochranu konstrukcí proti bludným proudům"],
}
(ROOT / "reports" / "TECHNICAL_RISK_ALLOCATION.md").write_text(context_report(TECH, tech_groups), encoding="utf-8")

docreq_groups = {
    "Required groundwater measurement": [r"ustálené hladiny spodní vody", r"chemického rozboru podzemních vod"],
    "Required current/stray-current survey": [r"měření proudového pole.{0,80}bludných proudů", r"korozního průzkumu půdy"],
}
(ROOT / "reports" / "DOCUMENTATION_REQUIREMENTS.md").write_text(context_report(DOCREQ, docreq_groups), encoding="utf-8")

# Designer / author identity search over all extracted documents.
designer_patterns = [
    r"zpracoval(?:a|i)?\s*[:\-]?\s*.{0,220}",
    r"zpracovatel\s*[:\-]?\s*.{0,220}",
    r"vypracoval(?:a|i)?\s*[:\-]?\s*.{0,220}",
    r"odpovědn.{0,15}projektant.{0,220}",
    r"hlavní inženýr projektu.{0,220}",
    r"generální projektant.{0,220}",
    r"projektant\s*[:\-]?\s*.{0,220}",
    r"SITEZ.{0,220}",
    r"TEP0314.{0,220}",
]
designer_hits: list[dict[str, str]] = []
for path in sorted(TEXT_DIR.glob("*.txt")):
    text = re.sub(r"\s+", " ", path.read_text(encoding="utf-8", errors="replace"))
    if not any(k.lower() in text.lower() for k in ("zpracoval", "projektant", "SITEZ", "TEP0314", "vypracoval")):
        continue
    for pat in designer_patterns:
        for m in re.finditer(pat, text, flags=re.I):
            start = max(0, m.start() - 450)
            end = min(len(text), m.end() + 850)
            designer_hits.append({"file": path.name, "match": m.group(0), "excerpt": text[start:end]})
            if len([h for h in designer_hits if h["file"] == path.name]) >= 12:
                break

# Deduplicate excerpts.
seen = set(); unique_designer = []
for hit in designer_hits:
    marker = (hit["file"], re.sub(r"\W+", "", hit["excerpt"].lower())[:350])
    if marker not in seen:
        seen.add(marker); unique_designer.append(hit)
(ROOT / "reports" / "DESIGNER_HITS.json").write_text(json.dumps(unique_designer, ensure_ascii=False, indent=2), encoding="utf-8")
designer_md = ["# PDPS/DUR designer and author search", ""]
for hit in unique_designer[:300]:
    designer_md += [f"## {hit['file']}", f"Matched: `{hit['match']}`", "", hit["excerpt"], ""]
(ROOT / "reports" / "DESIGNER_HITS.md").write_text("\n".join(designer_md), encoding="utf-8")

# SFZP open-data crawl and filtering.
sfzp_main = get("https://otevrenadata.sfzp.cz/", "sfzp_main")
sfzp_links: list[str] = []
if sfzp_main is not None:
    soup = BeautifulSoup(sfzp_main.text, "html.parser")
    for a in soup.find_all("a", href=True):
        href = urllib.parse.urljoin(sfzp_main.url, a["href"])
        if any(token in href.lower() for token in (".csv", ".zip", "download", "export")):
            sfzp_links.append(href)
for fallback in [
    "https://otevrenadata.sfzp.cz/otevrenadata.csv",
    "https://otevrenadata.sfzp.cz/openData.csv",
    "https://otevrenadata.sfzp.cz/data/otevrenadata.csv",
]:
    sfzp_links.append(fallback)

sfzp_matches: list[dict[str, Any]] = []
for idx, url in enumerate(dict.fromkeys(sfzp_links)):
    r = get(url, f"sfzp_data_{idx}", timeout=300)
    if r is None or r.status_code != 200 or len(r.content) < 20:
        continue
    payloads: list[tuple[str, bytes]] = []
    if zipfile.is_zipfile(io.BytesIO(r.content)):
        with zipfile.ZipFile(io.BytesIO(r.content)) as z:
            for name in z.namelist():
                if name.lower().endswith((".csv", ".txt", ".json")):
                    payloads.append((name, z.read(name)))
    else:
        payloads.append((url.rsplit("/", 1)[-1] or f"data_{idx}", r.content))
    for name, raw in payloads:
        for enc in ("utf-8-sig", "utf-8", "cp1250", "latin1"):
            try:
                text = raw.decode(enc)
                break
            except Exception:
                text = ""
        if not text:
            continue
        for line_no, line in enumerate(text.splitlines(), start=1):
            low = line.lower()
            if any(term in low for term in ("27309941", "čez teplárensk", "cez teplarensk", "epr-kada", "epr kada", "horkovod", "prunéřov", "prunerov", "heat 1/2025")):
                sfzp_matches.append({"source": url, "member": name, "line": line_no, "text": line})
(ROOT / "reports" / "SFZP_MATCHES.json").write_text(json.dumps(sfzp_matches, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "reports" / "SFZP_MATCHES.md").write_text("# SFŽP open-data matches\n\n" + "\n".join(f"- `{m['source']}` / {m['member']} / line {m['line']}: {m['text']}" for m in sfzp_matches), encoding="utf-8")

# Registr smluv and NEN/addendum probes.
registry_urls = [
    "https://smlouvy.gov.cz/vyhledavani?search=4570081576",
    "https://smlouvy.gov.cz/vyhledavani?contract_num=4570081576",
    "https://smlouvy.gov.cz/vyhledavani?subject_idnum=27309941&contract_num=4570081576",
    "https://smlouvy.gov.cz/vyhledavani?subject_name=%C4%8CEZ%20Tepl%C3%A1rensk%C3%A1&contract_num=4570081576",
    "https://smlouvy.gov.cz/vyhledavani?search=CV_HV%20propoj%20EPR-Kada%C5%88",
]
registry_results: list[dict[str, Any]] = []
for idx, url in enumerate(registry_urls):
    r = get(url, f"registry_{idx}")
    if r is None:
        continue
    soup = BeautifulSoup(r.text, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = urllib.parse.urljoin(r.url, a["href"])
        if "/smlouva/" in href:
            links.append({"text": a.get_text(" ", strip=True), "url": href})
    page_text = soup.get_text(" ", strip=True)
    registry_results.append({"query": url, "status": r.status_code, "title": soup.title.get_text(" ", strip=True) if soup.title else "", "links": links, "contains_contract_number": "4570081576" in page_text, "excerpt": page_text[:3000]})
(ROOT / "reports" / "REGISTRY_RESULTS.json").write_text(json.dumps(registry_results, ensure_ascii=False, indent=2), encoding="utf-8")

# Existing NEN state files: search for contract/addendum/download metadata.
nen_state_hits: list[dict[str, Any]] = []
for path in sorted(TEXT_DIR.glob("state_*.json")):
    text = path.read_text(encoding="utf-8", errors="replace")
    compact = re.sub(r"\s+", " ", text)
    for term in ("4570081576", "uzavrenaSmlouva", "smluvniCenaBezAkt", "dodatek", "smlouva", "soubor"):
        for m in re.finditer(re.escape(term), compact, flags=re.I):
            nen_state_hits.append({"file": path.name, "term": term, "excerpt": compact[max(0,m.start()-500):min(len(compact),m.end()+900)]})
            if len([x for x in nen_state_hits if x["file"] == path.name and x["term"] == term]) >= 6:
                break
(ROOT / "reports" / "NEN_STATE_CONTRACT_HITS.json").write_text(json.dumps(nen_state_hits, ensure_ascii=False, indent=2), encoding="utf-8")

summary = {
    "designer_hit_count": len(unique_designer),
    "sfzp_links_tested": len(dict.fromkeys(sfzp_links)),
    "sfzp_match_count": len(sfzp_matches),
    "registry_queries": len(registry_results),
    "registry_contract_links": sum(len(x["links"]) for x in registry_results),
    "nen_state_hit_count": len(nen_state_hits),
}
(ROOT / "SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "request_log.json").write_text(json.dumps(request_log, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(summary, ensure_ascii=False))
