#!/usr/bin/env python3
"""Generates states/*.html and sitemap.xml for 32262.com.
Run from repo root:  python3 _gen/gen.py
Input: _gen/states.json (derived from the BSD-licensed `zipcodes` npm dataset)."""
import json, os, html, datetime, glob
from urllib.parse import quote
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(ROOT, "_gen", "states.json")))
NAMES = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","DC":"District of Columbia","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","PR":"Puerto Rico"}
TZ = {"Eastern":"CT DE DC FL GA IN KY ME MD MA MI NH NJ NY NC OH PA RI SC TN VT VA WV","Central":"AL AR IL IA KS LA MN MS MO NE ND OK SD TX WI","Mountain":"AZ CO ID MT NM UT WY","Pacific":"CA NV OR WA","Alaska":"AK","Hawaii-Aleutian":"HI","Atlantic":"PR"}
UVL = {"OR":(1,65),"WV":(2,62),"SC":(3,61),"DE":(4,60),"MN":(5,58),"ID":(6,58),"NC":(7,58),"AR":(8,57),"AL":(9,57),"NV":(10,57)}
def tz(st): return next((k for k,v in TZ.items() if st in v.split()), "")
e = html.escape
os.makedirs(os.path.join(ROOT, "states"), exist_ok=True)
os.makedirs(os.path.join(ROOT, "_data"), exist_ok=True)
data = {}
for st, name in NAMES.items():
    d = S[st]
    data[st] = {"name": name, "n": f"{d['n']:,}", "min": d["min"], "max": d["max"], "pre": d["pre"],
                "lat": round(d["lat"], 2), "lon": round(d["lon"], 2), "cities": [[c, n] for c, n in d["cities"][:10]], "tz": tz(st) or "—",
                "zoom": 2.2 if st in ("AK", "TX", "CA", "MT") else 1.6 if d["n"] > 800 else 1.0}
    if st in UVL: data[st]["uvl"] = list(UVL[st])
    open(os.path.join(ROOT, "states", st.lower() + ".html"), "w").write(f"""---
title: "{name} ZIP Codes — {d['n']:,} ZIPs, Ranges, Prefixes & Top Cities | 32262"
description: "All about {name} ZIP codes: {d['n']:,} active ZIPs from {d['min']} to {d['max']}, {len(d['pre'])} three-digit prefixes, the cities with the most ZIPs, time zone and moving tools."
zip: true
st: {st}
---
{{% include state.html %}}
""")
json.dump(data, open(os.path.join(ROOT, "_data", "states.json"), "w"), separators=(",", ":"), ensure_ascii=False)
cards = "".join(f'<a class="card" href="{st.lower()}.html"><h3>{n}</h3><p class="muted">{S[st]["n"]:,} ZIPs · {S[st]["min"]}–{S[st]["max"]}</p></a>' for st, n in sorted(NAMES.items(), key=lambda x: x[1]))
open(os.path.join(ROOT, "states", "index.html"), "w").write(f'''---
title: "ZIP Codes by State — Counts, Ranges & Prefixes for All 50 States | 32262"
description: "Browse ZIP codes by state: how many ZIPs each state has, its ZIP range, sectional-center prefixes and cities with the most ZIP codes."
---
<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="{{{{ site.baseurl }}}}/">Home</a> › States</nav>
<section class="page-hero"><div class="wrap"><span class="eyebrow">States</span><h1 style="margin-top:12px">ZIP codes by state</h1><p class="lead">50 states, DC and Puerto Rico — ZIP counts, ranges, prefixes and top cities.</p></div></section>
<div class="wrap"><div class="grid g4">{cards}</div><div class="ad-slot" data-ad="inContent"></div></div>
''')
# sitemap
today = datetime.date.today().isoformat()
urls = []
for f in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
    rel = os.path.relpath(f, ROOT).replace(os.sep, "/")
    if rel.startswith(("_", "project-docs")) or rel == "404.html": continue
    loc = "https://32262.com/" + ("" if rel == "index.html" else rel.replace("index.html", ""))
    pr = "1.0" if rel == "index.html" else "0.9" if rel in ("lookup.html", "get-quotes.html") or rel.startswith("tools/") else "0.7"
    urls.append(f"<url><loc>{loc}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>")
open(os.path.join(ROOT, "sitemap.xml"), "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n")
print(len(NAMES), "state pages;", len(urls), "sitemap urls")
