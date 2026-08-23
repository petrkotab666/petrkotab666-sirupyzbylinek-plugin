from __future__ import annotations

import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

SRC = Path("tmp_cez_document_corpus_scan_20260823/texts")
OUT = Path("tmp_cez_focused_evidence_20260823")
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

QUERIES = {
    "contract_no_owner_geology": [
        r"geologick.{0,5}a hydrogeologick.{0,12}poměry.{0,60}nebyl.{0,30}objednatelem zpracov",
        r"povinnost zhotovitele v oblasti geologie",
    ],
    "contract_groundwater_scope": [
        r"výsledky ověření ustálené hladiny spodní vody",
        r"základního chemického rozboru podzemních vod",
        r"zatřídění podzemních vod a hornin.{0,80}agresivity",
    ],
    "contract_stray_current_scope": [
        r"měření proudového pole a přítomnosti bludných proudů",
        r"korozního průzkumu půdy",
    ],
    "v16_stray_current_answer": [
        r"ochranu vlastního horkovodu.{0,180}bludných proudů není nutno řešit",
        r"požadována ochrana před účinky bludných proud",
    ],
    "v17_known_permit_change": [
        r"územním rozhodnutí je uvedeno dokončení stavby do 30\.9\.2026",
        r"uvedené bude řešeno změnou stavby před dokončením",
    ],
    "v20_missing_surveys_and_pumping": [
        r"nebyl proveden geologický průzkum",
        r"nebyl proveden hydrogeologický průzkum",
        r"40 hodin.{0,120}čerpání",
        r"čerpání vody.{0,180}vodního toku",
    ],
    "v20_vvn_zvn_warning": [
        r"ČEPS.{0,250}500 m",
        r"paralelně s vedením 110 kV",
        r"vedení 400 kV",
        r"elektromagnetick.{0,30}indukc",
        r"dodatečn.{0,20}náklad",
        r"odborn.{0,20}posud",
    ],
    "april_change": [
        r"hydrogeologick.{0,30}průzkum",
        r"patk.{0,20}stožár",
        r"skutečn.{0,20}poloha.{0,60}plynovod",
        r"skutečn.{0,20}poloha.{0,60}vodovod",
    ],
    "june_change": [
        r"6 kV",
        r"1,5 m",
        r"trafostanic",
    ],
    "july_change": [
        r"nepředpokládan.{0,30}hladin.{0,30}podzemní vody",
        r"250070/01",
        r"FeZn",
        r"TAS.{0,80}IE-14-03-10001-X501",
    ],
    "change_mechanism": [
        r"člán.{0,12}23",
        r"skryt.{0,20}překáž",
        r"§\s*222.{0,12}odst.{0,8}6",
    ],
    "risk_price_time": [
        r"nemá nárok.{0,160}prodloužení",
        r"nemá nárok.{0,160}zvýšení ceny",
        r"cena díla.{0,180}úpln",
        r"náklady.{0,100}průzkum",
        r"průzkum.{0,120}na vlastní náklady",
    ],
    "designer_identity": [
        r"zpracovatel.{0,30}(PDPS|projektové dokumentace)",
        r"generální projektant",
        r"SITEZ",
        r"TEP0314",
    ],
}

compiled = {group: [re.compile(p, re.I | re.S) for p in patterns] for group, patterns in QUERIES.items()}
results = defaultdict(list)
summary = defaultdict(set)

for path in sorted(SRC.glob("*.txt")):
    text = path.read_text(encoding="utf-8", errors="replace")
    compact = re.sub(r"\s+", " ", text)
    for group, patterns in compiled.items():
        positions = []
        for pattern in patterns:
            for match in pattern.finditer(compact):
                positions.append((match.start(), match.end(), match.group(0)))
        positions.sort()
        last_end = -1
        for start, end, match in positions:
            if start < last_end + 150:
                continue
            last_end = end
            excerpt_start = max(0, start - 650)
            excerpt_end = min(len(compact), end + 1600)
            excerpt = compact[excerpt_start:excerpt_end]
            results[group].append({"file": path.name, "match": match, "excerpt": excerpt})
            summary[group].add(path.name)

report = ["# Focused primary evidence: EPR–Kadaň underground conditions", ""]
for group in QUERIES:
    report += [f"## {group}", "", f"Matching documents: **{len(summary[group])}**; excerpts: **{len(results[group])}**", ""]
    seen = set()
    for item in results[group][:100]:
        marker = (item["file"], re.sub(r"\W+", "", item["excerpt"].lower())[:400])
        if marker in seen:
            continue
        seen.add(marker)
        report += [f"### {item['file']}", f"Matched: `{item['match']}`", "", item["excerpt"], ""]

(OUT / "FOCUSED_EVIDENCE.md").write_text("\n".join(report), encoding="utf-8")
(OUT / "focused_evidence.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
(OUT / "SUMMARY.json").write_text(json.dumps({group: {"documents": sorted(summary[group]), "excerpt_count": len(results[group])} for group in QUERIES}, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({group: {"documents": len(summary[group]), "excerpts": len(results[group])} for group in QUERIES}, ensure_ascii=False))
