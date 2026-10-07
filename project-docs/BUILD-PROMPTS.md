# 32262.com — Phase-wise Build Prompts

Copy each prompt into your AI builder in order. Each phase is self-contained, states its inputs and its acceptance tests. Concept: **“32262 · ZIP & Move Intelligence”** — free ZIP/postal tools for 60+ countries plus a high-converting moving lead-gen funnel. Hosting: GitHub Pages free plan (static HTML/CSS/JS + Jekyll layout). Repo: `WEBWORKSA1/32262-com`.

**Global rules for every phase**
- Static only: HTML, CSS, vanilla JS. No server, no build step except optional Python generators.
- Every page shows a top bar: “Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership” linking to `https://web.works/contact`.
- The site inbox address must **never** appear in HTML, JS strings or the repo in plain text. Store it as an XOR-obfuscated, reversed char-code array in `config.js`; assemble it only at runtime for FormSubmit (`https://formsubmit.co/ajax/<address>`) and for `mailto` buttons on click.
- Mobile-first, 16px gutters, no horizontal scroll at 375px, light/dark theme, WCAG AA contrast, `prefers-reduced-motion` respected.
- Never claim a trademark in “32262”. ZIP Code™ / ZIP+4® are USPS trademarks; state non-affiliation.

---

## Phase 1 — Foundation & design system
> Create a Jekyll-compatible static site for GitHub Pages. Files: `_config.yml` (baseurl `/32262-com`, url `https://32262.com`, default layout), `_layouts/default.html`, `assets/css/style.css`, `assets/js/config.js`, `assets/js/app.js`, `assets/img/favicon.svg`, `site.webmanifest`, `robots.txt`, `ads.txt` (placeholder), `.gitignore`.
> Layout: skip link; dark top contact bar (rule above); sticky glass header with pin logo “32262 / ZIP & Move Intelligence”; nav (Lookup, Tools ▾, States, Guides, Videos, Community ▾, orange “Free Move Quotes” button); theme toggle; mobile drawer with scrim; footer with 4 columns, newsletter form, trademark line; mobile sticky “Free move quotes” bar; exit-intent lead modal; canonical, Open Graph and WebSite+SearchAction JSON-LD.
> Design tokens: navy #0B3B4F, teal #0B6E8A, accent orange #F26B1D, amber #FFB547; Inter + Space Grotesk; 14px radius cards; gradient hero with subtle map-grid texture.
> `config.js`: ADSENSE_CLIENT, AD_SLOTS, YOUTUBE_CHANNEL, VIDEOS[], DONATE{paypal,kofi,bmac,stripe,patreon}, DONATION_GOAL, AFFILIATES, GA4, plus the obfuscated inbox array.
> `app.js`: theme persistence, drawer, active link, reveal-on-scroll, toast, AdSense loader with house-ad fallback, YouTube lite embeds with topic-card fallback, FormSubmit AJAX for every `form[data-form]` (honeypot, success/err states, mailto fallback), donation links + goal bar, exit-intent modal (7-day cap), URL prefill.
> **Accept when:** empty page renders in both themes, drawer works at 375px, `grep -r "<your inbox>"` over the repo returns nothing.

## Phase 2 — ZIP engine (`assets/js/zip.js`)
> Build a vanilla-JS engine exposing `window.ZIP`: `lookup(cc, code)` via `https://api.zippopotam.us/{cc}/{code}` (CORS, 60+ countries); city search `/{cc}/{st}/{city}`; `loadUS()` that lazy-loads `https://cdn.jsdelivr.net/npm/zipcodes@8.0.0/lib/codes.js` using a temporary `window.exports` shim (42,555 US ZIPs with lat/lon); `zip3()` reading `assets/data/zip3.json` (931 prefixes → [city, state, count], generated from the dataset); haversine `miles()`, `bearing()`, OSM `map()` iframe; first-digit `region()`; state→time-zone map with split-state notes and live local time; `estimate(miles, size, opts)` moving-cost model; `mathFacts(n)`; `multi(code)` that checks a 5-digit code in 20 countries.
> Cost model: local <100 mi → $100–$200/h × hours by size (studio 2–4 … 4BR 8–12) + drive time; long distance → weight (2,000–10,000 lb) × $0.65–$1.00/lb × distance factor; peak May–Sep +15–30%; DIY truck ≈ $300 + $1.97/mi × size factor; packing $200–$1,500; FVP 1–2% of declared value.
> **Accept when:** 32256 resolves to Jacksonville FL; 32262 returns “not found” with the story link; distance 32256→97201 ≈ 2,446 mi straight-line.

## Phase 3 — Core pages & tools
> Pages (front matter `title`, `description`, `zip: true` where needed): `index.html` (hero lookup + chips, stats, 8 tool cards, quote quick-start, 32262 story teaser, guides, videos, contest/donate/pros cards, FAQ), `lookup.html` (results card with share, map, nearest 12 ZIPs on demand, sidebar CTA), `tools/index.html`, `tools/zip-distance.html`, `tools/zip-radius.html` (1–100 mi, CSV download), `tools/zip-prefix.html` (1–3 digits, national-area table), `tools/code-decoder.html` (20-country check + math + date + keypad), `tools/moving-cost.html` (three options + sources), `tools/moving-checklist.html` (23 dated tasks, localStorage progress, print/reset, email-me form), `tools/rent-affordability.html` (30% rule, 40× test, 43% DTI). Every tool ends with a quote CTA and has in-content + sidebar ad slots.
> **Accept when:** every tool produces results with a shareable URL and no console errors.

## Phase 4 — Lead generation (highest priority for revenue)
> `get-quotes.html`: hero with value stats; 3-step form with progress bar — (1) from ZIP, to ZIP, date, flexible-date flag; (2) home-size radio tiles, service tiles, **live price range** computed from both ZIPs; (3) name, email, optional phone, contact preference, add-on interests (insurance, agent, mortgage, internet), notes, hidden fields (est_miles, est_range, route), explicit TCPA-style consent checkbox, honeypot. Success state with checklist + scam-guide links. Below: how-it-works, FMCSA tips, FAQ. On mobile the form comes first; no sticky bar or exit modal on this page.
> `pros.html`: B2B page for lead buyers (movers, agents, lenders, insurers, storage, internet) with pricing models and an application form (company, type, USDOT #, coverage ZIPs, volume, exclusivity).
> Secondary capture: home quick-start form, exit-intent “free move plan”, checklist email, newsletter.
> **Accept when:** a full quote submission posts JSON to FormSubmit with all fields and the success state shows.

## Phase 5 — Content & SEO
> Generator `_gen/gen.py` producing 52 state pages (`states/xx.html`: ZIP count, range, prefixes as decoder chips, top 12 cities by ZIP count linking to lookup, OSM map of ZIP centroid, time zone, United Van Lines 2025 inbound rank for top-10 states, sponsor box) + `states/index.html` + `sitemap.xml`.
> Guides (sourced, 400–700 words, ad slots): how ZIP codes work; postal codes around the world; moving costs 2026; avoid moving scams (FMCSA 9 tips + red flags); change-of-address checklist; where Americans are moving (UVL 2025).
> `the-32262-story.html`: the research (USPS 322 block / unassigned, INSEE Monbrun, math table, numerology & Chinese symbolism labeled as tradition, economy, why this site).
> **Accept when:** every page has unique title/description, breadcrumbs, internal links resolve, sitemap lists all public pages.

## Phase 6 — Monetization & community
> `advertise.html` (rate card: tool, state/ZIP, sponsored guide/video, newsletter, prize partner, bundle; media-kit form; web.works/contact for acquisition), `donate.html` (goal bar, tiers, instant links from config, pledge form, allocation table), `contests.html` (#MyZIP Story: $500 Judges' Pick, $100 People's Pick, referral entries, entry form, official rules), `careers.html` (6 roles + application form), `videos.html` (YouTube grid from config). House ads rotate through quotes/advertise/contests/donate until AdSense is approved.
> **Accept when:** all forms submit; donation goal renders; video grid falls back to topic cards when `VIDEOS` is empty.

## Phase 7 — Trust, legal & compliance
> `legal.html` (trademark notice incl. USPS marks and non-affiliation, “32262” descriptive use, copyright, third-party data licenses: zipcodes BSD, GeoNames/Zippopotam ODbL, OSM ODbL, OFL fonts; DMCA-style process; advertising/affiliate disclosure; accuracy), `privacy.html` (forms via FormSubmit, partner sharing only with consent, AdSense cookies + opt-out, CCPA/GDPR/PIPEDA rights, retention), `terms.html`, `data-sources.html`, `about.html`, `contact.html` (topic form, web.works/contact card, click-to-email button), `404.html`.

## Phase 8 — QA, deploy & launch
> Test with a headless browser (mock external APIs): every page loads with zero JS errors, top bar on every page, no broken internal links, no horizontal scroll at 375px, inbox string absent from repo. Push to `main` on `WEBWORKSA1/32262-com`; enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). First form submission triggers FormSubmit's one-time activation email — click it. Then: AdSense application, `ads.txt`, GA4 id, Search Console + sitemap, custom domain (`CNAME` = 32262.com, A records 185.199.108–111.153, `www` CNAME → webworksa1.github.io, set `baseurl: ""`, enforce HTTPS).

## Phase 9 — Growth (post-launch)
> Add per-ZIP static pages for the top 1,000 ZIPs by search volume; “Moving from X to Y” route pages for the top 200 state pairs; a weekly YouTube Short per state; a monthly “Move Report” newsletter; partner dashboard (Supabase) for lead routing and billing; paid radius/ZIP API.
