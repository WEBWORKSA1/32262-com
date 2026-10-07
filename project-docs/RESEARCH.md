# 32262.com — Research & Decision Memo
_Prepared 7 Oct 2026_

## 1. What “32262” means

| Lens | Finding | Source |
|---|---|---|
| US postal | Prefix **322** = Jacksonville, FL sectional center (56 active ZIPs). **32262 itself is not an active ZIP** — absent from the 42,555-ZIP open dataset; Jacksonville listings jump 32260 (PO box) → 32266 (Neptune Beach) → 32267. | `zipcodes` npm v8 dataset; zip-codes.com Jacksonville list |
| US region | First digit 3 = AL, FL, GA, MS, TN | Wikipedia “ZIP Code” |
| France | INSEE commune code **32262 = Monbrun (Gers)**, postal code 32600; neighbors Monblanc (32261), Moncassin (32263) | Wikipedia “Communes of the Gers department” |
| Mathematics | 2 × 3 × 19 × 283; 16 divisors; **abundant** (proper divisors sum 35,898); digit sum 15, root 6; binary 111111000000110; hex 0x7E06; φ = 10,152 | computed |
| Western numerology | Reduces to **6** — “home, family, responsibility” (tradition) | — |
| Chinese symbolism | 2 = pairs; 6 (liù) ≈ 流 “smooth”; 3 ≈ 生 “life” (Cantonese); **no 4** → read as pleasant (tradition) | — |
| Date | 3/22/62 = Thursday 22 March 1962 (US notation) | computed |
| Domain economy | All 100,000 5-digit numeric .coms (“5N”) are registered; demand led by Chinese-speaking buyers who avoid 4s | domain-industry coverage (dotweekly, domainholdings) |

**Conclusion:** 32262 has no single dominant cultural meaning. Its strongest, most monetizable association is **format**: it reads instantly as a US ZIP code, and it literally sits inside Jacksonville's ZIP block while being unassigned.

## 2. Ideas evaluated

| Idea | Search demand | Monetization ceiling | Differentiation | Verdict |
|---|---|---|---|---|
| Numerology / angel-number hub | Very high | Low–mid RPM; affiliate psychic CPAs | Crowded; overlaps other numeric-domain projects | Rejected |
| Lottery / lucky numbers | High | Gambling ads restricted on AdSense | Policy risk | Rejected |
| Jacksonville local guide | Medium | Local ads | Domain is not a real Jacksonville ZIP | Rejected |
| **ZIP & postal intelligence + moving lead-gen** | Very high, evergreen (ZIP lookup, distance, radius, moving cost) | **High**: moving/insurance/real-estate CPCs; moving leads $10–$100+, RE leads ~$20+ | Format fit; tools-first; legit “missing ZIP” story | **Chosen** |

### Why it wins (numbers)
- **Lead value:** moving companies pay ~$10–$100+ per lead from providers and $30–$80 via Google Ads (Netpeak 2026). Real-estate leads average ~$20; Google buyer/seller campaigns $9–$30 (Sierra Interactive). One 3-field form can be sold to up to 5 buyers.
- **Ticket size:** a 2–3 BR long-distance move costs $4,500–$8,500 (Opendoor 2026) → advertisers bid aggressively.
- **Evergreen demand:** ~41.5k US ZIPs × every lookup, plus 60+ countries.
- **Low cost to run:** static site on GitHub Pages; data from open APIs (Zippopotam.us, `zipcodes` via jsDelivr, OSM).

## 3. Benchmark — 38 sites reviewed
**ZIP / relocation (final concept):** unitedstateszipcodes.org, zip-codes.com, Zippopotam.us, moveBuddha, MiniMoves, ImmobilienScout24 moving comparison, Opendoor moving guide, Storage Scholars, FMCSA Protect Your Move, United Van Lines Movers Study, Niche (rankings), timeanddate.com, Wikipedia ZIP Code.
**Numbers / tools / engagement (evaluated during ideation):** numerology.com, numerologist.com, worldnumerology.com, affinitynumerology.com, Sacred Scribes, astrosage, astrotalk, ganeshaspeaks, clickastro, cafeastrology, astrology.com, horoscope.com, tarot.com, Co–Star, Keen, Kasamba, California Psychics, numbersapi.com, Wolfram|Alpha, mathsisfun, omnicalculator, calculator.net, lotteryusa.
**Monetization patterns:** Buy Me a Coffee, Patreon, Gleam (contests).

### Features adopted
| Pattern | Seen on | Implemented as |
|---|---|---|
| Search-first hero + example chips | unitedstateszipcodes, calculator.net | Home hero lookup, 6 chips |
| Data + map + demographics per code | zip-codes.com, unitedstateszipcodes | Lookup result: place, SCF, region, time zone, map, nearest 12 |
| Radius finder + downloadable data | unitedstateszipcodes, freemaptools | Radius tool + CSV |
| “Get quotes, no spam calls” multi-step funnel, price shown early | moveBuddha, ImmoScout24, MiniMoves | 3-step quote form with live price range |
| Trust signals (verified, free, guarantee) | Keen, California Psychics, moveBuddha | Trust row, USDOT messaging, cap of 5 partners |
| Free tool → upsell funnel | numerology.com, astrotalk, Omni | Every tool ends in a quote CTA |
| Exit-intent / lead magnet | numerology.com (daily number), numerologist (calculator) | “Free move plan” exit modal |
| Methodology & sources transparency | Niche, Wolfram, FMCSA | Data & methodology page, sources on every tool |
| Donations, goal bar, tiers, memberships | Buy Me a Coffee, Patreon, Affinity Numerology | Donate page with goal bar, tiers, pledge form |
| Viral contests with referral entries & rules | Gleam | #MyZIP Story monthly contest |
| Hiring page | Omni (“We're hiring!”) | Careers page with application form |
| Programmatic SEO pages | zip-codes.com, Sacred Scribes | 52 state pages + sitemap |

## 4. Revenue model
1. **Lead generation (primary):** moving quotes → movers; add-ons → insurance, real estate, mortgage, internet.
2. **AdSense** on all tools/guides (slots pre-placed; house ads until approved).
3. **Sponsorships:** tool, state/ZIP, newsletter, contest prize partner.
4. **YouTube:** embeds from `config.js`; creator hiring.
5. **Donations / memberships.**
6. **B2B data tools** (radius CSV) → future paid API.
