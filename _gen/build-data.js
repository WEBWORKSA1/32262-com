// Rebuilds assets/data/zip3.json and _gen/states.json from the BSD-licensed `zipcodes` npm dataset.
// Usage: npm i zipcodes@8 && node _gen/build-data.js && python3 _gen/gen.py
const c = require("zipcodes/lib/codes.js").codes, fs = require("fs"), path = require("path");
const R = path.join(__dirname, ".."), z3 = {}, st = {}, top = o => Object.entries(o).sort((a, b) => b[1] - a[1]);
for (const k in c) { const r = c[k]; if (r.country !== "US") continue; const p = k.slice(0, 3);
  const Z = (z3[p] = z3[p] || { n: 0, c: {}, s: {} }); Z.n++; Z.c[r.city] = (Z.c[r.city] || 0) + 1; Z.s[r.state] = (Z.s[r.state] || 0) + 1;
  const S = (st[r.state] = st[r.state] || { n: 0, c: {}, p: {}, lat: 0, lon: 0, min: k, max: k }); S.n++; S.c[r.city] = (S.c[r.city] || 0) + 1; S.p[p] = 1; S.lat += r.latitude; S.lon += r.longitude; if (k < S.min) S.min = k; if (k > S.max) S.max = k; }
const out = {}; for (const p of Object.keys(z3).sort()) out[p] = [top(z3[p].c)[0][0], top(z3[p].s)[0][0], z3[p].n];
fs.writeFileSync(path.join(R, "assets/data/zip3.json"), JSON.stringify(out));
const so = {}; for (const s in st) { const S = st[s]; so[s] = { n: S.n, min: S.min, max: S.max, pre: Object.keys(S.p).sort(), lat: +(S.lat / S.n).toFixed(3), lon: +(S.lon / S.n).toFixed(3), cities: top(S.c).slice(0, 16) }; }
fs.writeFileSync(path.join(R, "_gen/states.json"), JSON.stringify(so));
console.log(Object.keys(out).length, "prefixes;", Object.keys(so).length, "states");
