# 32262.com — ZIP & Move Intelligence

Free ZIP and postal-code tools for 60+ countries plus a high-converting moving lead-generation funnel. Static HTML/CSS/JS on the GitHub Pages free plan (Jekyll layout, no build workflow).

## Structure
```
index.html, lookup.html, get-quotes.html (lead gen), pros.html (B2B lead buyers),
the-32262-story.html, advertise.html, donate.html, contests.html, careers.html, videos.html,
about.html, contact.html, legal.html, privacy.html, terms.html, data-sources.html, 404.html
tools/     lookup helpers: distance, radius (CSV), prefix, 5-digit decoder, moving cost, checklist, rent
states/    52 generated state pages + index
guides/    6 sourced guides
_layouts/default.html   shared head, top contact bar, header, footer, lead modal
assets/js/config.js     ← the only file you edit (AdSense, YouTube, donations, affiliates, GA4)
assets/js/app.js        UI, forms, ads, video, donations
assets/js/zip.js        ZIP engine + tool controllers
assets/data/zip3.json   931 prefix → city/state/count
_gen/build-data.js      rebuilds zip3.json + _gen/states.json from the npm dataset
_gen/gen.py             regenerates states/*.html, _data/states.json + sitemap.xml
_includes/state.html    state-page template (Jekyll data-driven)
project-docs/           RESEARCH.md · BUILD-PROMPTS.md
```

## Go-live checklist
1. **Pages:** Settings → Pages → *Deploy from a branch* → `main` / `(root)`. Site: `https://webworksa1.github.io/32262-com/`.
2. **Forms:** the first submission sends a one-time FormSubmit activation email to the site inbox — click *Activate*. The address is never shown on the site (assembled at runtime from an obfuscated array in `config.js`).
3. **AdSense:** set `ADSENSE_CLIENT` (+ optional slot ids) in `config.js`; put your publisher id in `ads.txt`. Until then, slots show house ads.
4. **YouTube / donations / affiliates / GA4:** fill the matching keys in `config.js`.
5. **Custom domain:** add a `CNAME` file containing `32262.com`, set `baseurl: ""` in `_config.yml`; DNS A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`; enable *Enforce HTTPS*.
6. Submit `sitemap.xml` in Google Search Console.

## Data & licenses
US ZIPs: `zipcodes` npm (BSD) via jsDelivr · Worldwide: Zippopotam.us / GeoNames (ODbL) · Maps: OpenStreetMap (ODbL).

## Legal
“32262” is used as a descriptive numeral; no trademark is claimed. ZIP Code™ and ZIP+4® are USPS trademarks; this site is not affiliated with USPS. See `legal.html`.
