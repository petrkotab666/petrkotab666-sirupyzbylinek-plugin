#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import hashlib
import html
import json
import re
import textwrap
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE="https://nasekadan.cz"
UA="NaseKadanSportCardRepair/1.1"
OUT_ART=Path("nasekadan-live/files/clanky")
OUT_SOC=Path("nasekadan-live/files/social")
MANIFEST=Path("nasekadan-live/manifest.json")
RAW="https://raw.githubusercontent.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin/main/nasekadan-live/files/"
BASELINE_REF="25fb80d10b89806da10e6298c402935e57a28e96"
BASELINE_RAW=f"https://raw.githubusercontent.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin/{BASELINE_REF}/nasekadan-live/files/clanky/"
FALSE_SPORT_SLUGS={
    "alzbetinsky-klaster-kadan-pacienti-lecebna-1966.html",
    "cyklomycka-pitko-dopravni-hriste-kadan-2026.html",
    "srpen-kadanske-galerie-vystavy-workshop-2026.html",
}
FALSE_SPORT_IMAGES={
    "/social/alzbetinsky-klaster-kadan-pacienti-lecebna-1966-7fc3dea464.png",
    "/social/cyklomycka-pitko-dopravni-hriste-kadan-2026-bc174fe955.png",
    "/social/srpen-kadanske-galerie-vystavy-workshop-2026-f9e3888650.png",
}
W,H=1200,630


def fetch(url:str,bust=True)->str:
    if bust and "raw.githubusercontent.com" not in url:
        sep='&' if '?' in url else '?'
        url=url+sep+'nksport='+str(int(dt.datetime.now(dt.timezone.utc).timestamp()))
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Cache-Control':'no-cache'})
    with urllib.request.urlopen(req,timeout=30) as r:
        return r.read().decode('utf-8','replace')


def strip(value:str)->str:
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',value,flags=re.S))).strip()


def attr(tag:str,name:str)->str|None:
    m=re.search(rf'\b{re.escape(name)}\s*=\s*(["\'])(.*?)\1',tag,re.I|re.S)
    return html.unescape(m.group(2)).strip() if m else None


def meta(body:str,key:str)->str:
    for tag in re.findall(r'<meta\b[^>]*>',body,re.I|re.S):
        k=attr(tag,'property') or attr(tag,'name')
        if (k or '').lower()==key.lower(): return attr(tag,'content') or ''
    return ''


def replace_meta(body:str,key:str,value:str,prop=True)->str:
    a='property' if prop else 'name'
    pat=re.compile(rf'<meta\b[^>]*{a}=["\']{re.escape(key)}["\'][^>]*>',re.I)
    tag=f'<meta {a}="{key}" content="{html.escape(value,quote=True)}">'
    if pat.search(body): return pat.sub(tag,body,count=1)
    return body.replace('</head>',tag+'\n</head>',1)


def title(body:str)->str:
    return meta(body,'og:title') or (strip(m.group(1)) if (m:=re.search(r'<h1\b[^>]*>(.*?)</h1>',body,re.I|re.S)) else 'Naše Kadaň')


def description(body:str)->str:
    return meta(body,'og:description') or meta(body,'description')


def tag_text(body:str)->str:
    m=re.search(r'<p\b[^>]*class=["\'][^"\']*\btag\b[^"\']*["\'][^>]*>(.*?)</p>',body,re.I|re.S)
    return strip(m.group(1)).upper() if m else ''


def sport_kind(body:str)->tuple[str,str]|None:
    """Konzervativní detekce: primárně rubrika, sekundárně celá sportovní slova.

    Nepoužívat volné substringy typu BĚH, protože pak se jako sport označí PŘÍBĚH.
    """
    tag=tag_text(body)
    ttl=title(body).upper()
    if re.search(r'(^|\W)HOKEJ($|\W)',tag) or re.search(r'(^|\W)HOKEJ($|\W)',ttl):
        return ('SPORT · HOKEJ','hockey')
    if re.search(r'(^|\W)FOTBAL($|\W)',tag) or re.search(r'(^|\W)FOTBAL($|\W)',ttl):
        return ('SPORT · FOTBAL','football')
    if re.search(r'(^|\W)SPORT($|\W)',tag):
        return ('SPORT','sport')
    # Starší sportovní články nemusí mít jednotný SPORT tag.
    if re.search(r'\b(PLAVCI|PLAVÁNÍ|GYMNASTIKA|GYMNASTÉ|TYČKAŘKA|TYČKAŘ|ATLETKA|ATLET|VOLEJBAL|BASKETBAL|HÁZENÁ)\b',ttl):
        return ('SPORT','sport')
    if 'TATRAN KADAŇ' in ttl or 'FK TATRAN' in ttl:
        return ('SPORT · FOTBAL','football')
    return None


def font(size:int,bold=False):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    return ImageFont.truetype(p,size)


def fit_title(draw,title,max_width=575,max_lines=4):
    for size in range(58,37,-2):
        f=font(size,True); lines=[]; line=''
        for word in title.split():
            c=(line+' '+word).strip()
            if draw.textbbox((0,0),c,font=f)[2] <= max_width: line=c
            else:
                if line: lines.append(line)
                line=word
        if line: lines.append(line)
        if len(lines)<=max_lines: return lines,f
    return textwrap.wrap(title,width=30)[:max_lines],font(38,True)


def draw_icon(draw,kind,accent):
    white=(226,246,252,255)
    draw.rounded_rectangle((770,125,1105,500),radius=36,fill=(*accent,235),outline=white,width=5)
    if kind=='hockey':
        draw.line((825,170,1010,445),fill=white,width=22); draw.line((1030,170,850,445),fill=white,width=22)
        draw.line((1004,438,1070,470),fill=white,width=22); draw.line((856,438,790,470),fill=white,width=22)
        draw.ellipse((870,330,1000,385),fill=(7,18,28,255),outline=white,width=5)
    elif kind=='football':
        draw.ellipse((815,160,1060,405),fill=white,outline=(215,235,240,255),width=5)
        draw.polygon([(937,220),(976,249),(961,295),(913,295),(898,249)],fill=(*accent,255))
        for seg in ((835,210,902,250),(990,210,1040,255),(840,320,905,365),(980,320,1040,365)): draw.line(seg,fill=(*accent,255),width=7)
    else:
        draw.ellipse((875,190,990,305),outline=white,width=18); draw.line((932,300,932,415),fill=white,width=18); draw.line((860,415,1005,415),fill=white,width=18)
        draw.arc((815,185,900,300),90,270,fill=white,width=14); draw.arc((965,185,1050,300),270,90,fill=white,width=14)


def card(title_text,category,kind,path):
    if kind=='hockey': base,accent=(8,27,40),(28,118,150)
    elif kind=='football': base,accent=(10,38,31),(35,133,88)
    else: base,accent=(18,30,46),(161,55,68)
    im=Image.new('RGBA',(W,H),(*base,255)); d=ImageDraw.Draw(im)
    for y in range(H):
        r=y/max(1,H-1); c=tuple(int(base[i]+(accent[i]-base[i])*r*.22) for i in range(3)); d.line((0,y,W,y),fill=(*c,255))
    glow=Image.new('RGBA',im.size,(0,0,0,0)); gd=ImageDraw.Draw(glow); gd.ellipse((660,-80,1260,530),fill=(*accent,100)); im=Image.alpha_composite(im,glow.filter(ImageFilter.GaussianBlur(55))); d=ImageDraw.Draw(im)
    for x in range(690,W,48): d.line((x,0,x,H),fill=(*accent,100),width=1)
    for y in range(0,H,48): d.line((660,y,W,y),fill=(*accent,100),width=1)
    d.polygon([(0,0),(770,0),(625,H),(0,H)],fill=(5,18,30,238)); draw_icon(d,kind,accent)
    d.text((70,52),'NAŠE KADAŇ',font=font(29,True),fill='white'); d.rectangle((70,98,565,106),fill=(177,36,47,255))
    bf=font(22,True); bb=d.textbbox((0,0),category,font=bf); bw=bb[2]-bb[0]+36; bh=max(45,bb[3]-bb[1]+16); d.rounded_rectangle((70,130,70+bw,130+bh),radius=9,fill=(177,36,47,255)); d.text((88,139),category,font=bf,fill='white')
    lines,tf=fit_title(d,title_text); y=205
    for line in lines: d.text((70,y),line,font=tf,fill='white'); y+=tf.size+9
    d.line((70,520,610,520),fill=(129,184,205,255),width=3); lab='AKTUÁLNĚ NA NASEKADAN.CZ'; lf=font(22,True); lw=d.textbbox((0,0),lab,font=lf)[2]+38; d.rounded_rectangle((70,548,70+lw,594),radius=8,fill=(232,237,240,255)); d.text((89,557),lab,font=lf,fill=(27,48,60,255)); d.rounded_rectangle((1080,545,1145,600),radius=10,fill=(177,36,47,255)); d.text((1092,556),'NK',font=font(23,True),fill='white')
    path.parent.mkdir(parents=True,exist_ok=True); im.convert('RGB').save(path,'PNG',optimize=True)


def update_article(body,new_abs,new_rel):
    body=replace_meta(body,'og:image',new_abs,True); body=replace_meta(body,'og:image:type','image/png',True); body=replace_meta(body,'og:image:width','1200',True); body=replace_meta(body,'og:image:height','630',True); body=replace_meta(body,'twitter:image',new_abs,False)
    body=re.sub(r'("image"\s*:\s*\[?\s*")https://nasekadan\.cz/social/[^"\]]+',lambda m:m.group(1)+new_abs,body,count=1)
    fig=re.compile(r'(<figure\b[^>]*data-nk-title-figure=["\']1["\'][^>]*>.*?<img\b[^>]*src=["\'])([^"\']+)',re.I|re.S)
    if fig.search(body): body=fig.sub(lambda m:m.group(1)+new_rel,body,count=1)
    else:
        fig2=re.compile(r'(<figure\b[^>]*class=["\'][^"\']*article-figure[^"\']*["\'][^>]*>.*?<img\b[^>]*src=["\'])([^"\']+)',re.I|re.S)
        if fig2.search(body): body=fig2.sub(lambda m:m.group(1)+new_rel,body,count=1)
    return body


def main():
    sitemap=fetch(BASE+'/sitemap.xml'); urls=re.findall(r'<loc>(https://nasekadan\.cz/clanky/[^<]+\.html)</loc>',sitemap)
    OUT_ART.mkdir(parents=True,exist_ok=True); OUT_SOC.mkdir(parents=True,exist_ok=True)
    files=[]; verify=[]; repaired=[]

    # Nejprve vrátit tři nesportovní články přesně do bezpečné normalizované verze
    # z okamžiku před chybnou sportovní dávkou.
    for slug in sorted(FALSE_SPORT_SLUGS):
        body=fetch(BASELINE_RAW+urllib.parse.quote(slug),bust=False)
        article=OUT_ART/slug; article.write_text(body,encoding='utf-8',newline='\n')
        rawpath='clanky/'+slug
        files.append({'path':rawpath,'url':RAW+rawpath,'sha256':hashlib.sha256(article.read_bytes()).hexdigest()})
        verify.append(BASE+'/clanky/'+slug)

    for url in urls:
        slug=urllib.parse.urlsplit(url).path.rsplit('/',1)[-1]
        if slug in FALSE_SPORT_SLUGS:
            continue
        try: body=fetch(url)
        except Exception: continue
        kind=sport_kind(body)
        if not kind: continue
        category,icon=kind; ttl=title(body); desc=description(body); stem=slug[:-5]
        digest=hashlib.sha256(f'{stem}|{ttl}|{desc}|{category}'.encode()).hexdigest()[:10]
        name=f'{stem}-{digest}.png'; rel='/social/'+name; absurl=BASE+rel
        social=OUT_SOC/name; card(ttl,category,icon,social)
        article=OUT_ART/slug; article.write_text(update_article(body,absurl,rel),encoding='utf-8',newline='\n')
        for path,rawpath in ((article,'clanky/'+slug),(social,'social/'+name)):
            files.append({'path':rawpath,'url':RAW+rawpath,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
        verify.append(url); repaired.append({'url':url,'category':category,'image':rel})

    MANIFEST.write_text(json.dumps({
        'schema':1,'version':'20260825-sport-cards-v3',
        'files':files,'patches':[],'deletes':[],
        'verify_urls':sorted(set(verify)),
        'verify_present':['data-nk-title-figure="1"'],
        'verify_absent':sorted(FALSE_SPORT_IMAGES),
    },ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    Path('nasekadan-live/sport-card-summary.json').write_text(json.dumps({'count':len(repaired),'restored_non_sport':sorted(FALSE_SPORT_SLUGS),'items':repaired},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'sports_repaired':len(repaired),'non_sport_restored':len(FALSE_SPORT_SLUGS)},ensure_ascii=False))

if __name__=='__main__': main()
