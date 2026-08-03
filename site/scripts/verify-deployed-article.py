#!/usr/bin/env python3
from __future__ import annotations
from html import unescape
from pathlib import Path
import re,sys
BANNED_VISIBLE_PHRASES=("Rychlé shrnutí článku","hlavní klíčové slovo","SEO 90+","produktový XML feed","affiliate doporučení")
def plain_text(value:str)->str:return " ".join(unescape(re.sub(r"<[^>]+>"," ",value)).split())
def visible_page_text(markup:str)->str:
 main=re.search(r"<main\b[^>]*>([\s\S]*?)</main>",markup,re.I);value=main.group(1) if main else markup
 for tag in ("head","script","style","noscript","template"):value=re.sub(rf"<{tag}\b[^>]*>[\s\S]*?</{tag}>"," ",value,flags=re.I)
 return plain_text(re.sub(r"<!--[\s\S]*?-->"," ",value))
def count(markup:str,marker:str)->int:return markup.count(marker)
def require(markup:str,marker:str,label:str,errors:list[str])->None:
 if marker not in markup:errors.append(f"missing {label}: {marker}")
def main()->int:
 if len(sys.argv)!=6:print("Usage: verify-deployed-article.py VERSION ARTICLE HOME HEALTH RECIPES",file=sys.stderr);return 2
 version=Path(sys.argv[1]).read_text(encoding='utf-8');article=Path(sys.argv[2]).read_text(encoding='utf-8');home=Path(sys.argv[3]).read_text(encoding='utf-8');health=Path(sys.argv[4]).read_text(encoding='utf-8');recipes=Path(sys.argv[5]).read_text(encoding='utf-8')
 kicker_match=re.search(r'class="article-kicker"[^>]*>([\s\S]*?)</div>',article,re.I);hero_match=re.search(r'<img\b[^>]*class=["\'][^"\']*hero-image[^"\']*["\'][^>]*>',article,re.I);hero_src_match=re.search(r'\bsrc=["\']([^"\']+)["\']',hero_match.group(0),re.I) if hero_match else None
 kicker=plain_text(kicker_match.group(1)) if kicker_match else '';hero_src=hero_src_match.group(1) if hero_src_match else '';visible=visible_page_text(article);errors=[]
 if 'expected-cultivation-category: Pěstování bylinek' not in version:errors.append('deployment marker is missing')
 if kicker!='Pěstování bylinek':errors.append(f'wrong article kicker: {kicker!r}')
 if '/obrazky/clanky/nejcastejsi-chyby-pri-pestovani-bylinek.svg' not in hero_src:errors.append(f'wrong unique hero image: {hero_src!r}')
 if count(article,'class="context-ads"')<1:errors.append('cultivation article is missing contextual advertising')
 if count(article,'class="article-inline-ad"')<1:errors.append('cultivation article is missing an in-content advertising module')
 if count(article,'class="product-feed"')<1:errors.append('cultivation article is missing the product feed')
 require(home,'/media/original/home/bylinkova-herna-photo.svg','photographic herb-game card',errors)
 if count(home,'illustrated-directory-card--photo')<6:errors.append('home page does not contain six photographic main cards')
 if count(health,'illustrated-directory-card--photo')!=9:errors.append('natural pharmacy does not contain nine restored main cards')
 for href in ('/prirodni-pomocnici-pro-imunitu/','/prirodni-pomocnici-pro-traveni-a-zazivani/','/tinktury/tinktury-srdce-krevni-obeh/','/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/'):require(health,f'href="{href}"',f'natural-pharmacy link {href}',errors)
 if count(recipes,'illustrated-directory-card--photo')!=10:errors.append('recipes page does not contain ten restored main categories')
 for href in ('/domaci-sirupy/','/tinktury/','/recepty-na-domaci-limonady/','/bylinne-caje/','/bylinne-koupele/','/bylinne-masti-a-balzamy/','/bylinne-oleje-a-maceraty/','/bylinne-octy-a-oxymely/','/bylinne-obklady-a-kloktadla/','/bylinky-v-kuchyni-recepty/','/sirupy-a-recepty-pro-zvirata/'):require(recipes,f'href="{href}"',f'recipe link {href}',errors)
 folded=visible.casefold()
 for phrase in BANNED_VISIBLE_PHRASES:
  if phrase.casefold() in folded:errors.append(f'banned visible phrase {phrase!r}')
 if errors:
  print('Deployment verification failed:',file=sys.stderr)
  for error in errors:print(f'- {error}',file=sys.stderr)
  return 1
 print(f"Deployment verified successfully: hero={hero_src!r}, home={count(home,'illustrated-directory-card--photo')}, health={count(health,'illustrated-directory-card--photo')}, recipes={count(recipes,'illustrated-directory-card--photo')}.")
 return 0
if __name__=='__main__':raise SystemExit(main())
