/* 32262.com — ZIP & postal-code engine + interactive tools (vanilla JS, no build step)
   Live data: Zippopotam.us (CORS-enabled, ODbL, 60+ countries) and the BSD-licensed `zipcodes`
   npm dataset (42,555 US ZIPs with coordinates) served by jsDelivr — loaded only when a tool needs it. */
(function () {
  "use strict";
  var $ = window.$q, $$ = window.$$q, esc = window.esc, ROOT = window.ROOT || "/";
  var API = "https://api.zippopotam.us/";
  var US_DATA = "https://cdn.jsdelivr.net/npm/zipcodes@8.0.0/lib/codes.js";

  var COUNTRIES = { US: "United States", AD: "Andorra", AR: "Argentina", AS: "American Samoa", AT: "Austria", AU: "Australia", BD: "Bangladesh", BE: "Belgium", BG: "Bulgaria", BR: "Brazil", CA: "Canada", CH: "Switzerland", CZ: "Czechia", DE: "Germany", DK: "Denmark", DO: "Dominican Republic", ES: "Spain", FI: "Finland", FO: "Faroe Islands", FR: "France", GB: "United Kingdom", GF: "French Guiana", GG: "Guernsey", GL: "Greenland", GP: "Guadeloupe", GT: "Guatemala", GU: "Guam", GY: "Guyana", HR: "Croatia", HU: "Hungary", IM: "Isle of Man", IN: "India", IT: "Italy", JE: "Jersey", JP: "Japan", LI: "Liechtenstein", LK: "Sri Lanka", LT: "Lithuania", LU: "Luxembourg", MC: "Monaco", MD: "Moldova", MH: "Marshall Islands", MK: "North Macedonia", MP: "Northern Mariana Is.", MQ: "Martinique", MX: "Mexico", MY: "Malaysia", NL: "Netherlands", NO: "Norway", NZ: "New Zealand", PH: "Philippines", PK: "Pakistan", PL: "Poland", PM: "St Pierre & Miquelon", PR: "Puerto Rico", PT: "Portugal", RE: "Réunion", RU: "Russia", SE: "Sweden", SI: "Slovenia", SJ: "Svalbard", SK: "Slovakia", SM: "San Marino", TH: "Thailand", TR: "Türkiye", VA: "Vatican City", VI: "US Virgin Islands", YT: "Mayotte", ZA: "South Africa" };
  var STATES = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", PR: "Puerto Rico", VI: "US Virgin Islands", GU: "Guam", AS: "American Samoa", MP: "Northern Mariana Islands", AA: "Armed Forces Americas", AE: "Armed Forces Europe", AP: "Armed Forces Pacific", FM: "Micronesia", MH: "Marshall Islands", PW: "Palau" };
  var REGIONS = ["0 · New England & NJ (CT, MA, ME, NH, NJ, RI, VT, PR, VI, Armed Forces Europe)", "1 · NY, PA, DE", "2 · DC, MD, NC, SC, VA, WV", "3 · AL, FL, GA, MS, TN (+ Armed Forces Americas)", "4 · IN, KY, MI, OH", "5 · IA, MN, MT, ND, SD, WI", "6 · IL, KS, MO, NE", "7 · AR, LA, OK, TX", "8 · AZ, CO, ID, NM, NV, UT, WY", "9 · AK, CA, HI, OR, WA (+ Pacific territories, Armed Forces Pacific)"];
  var TZ = { Eastern: "CT DE DC FL GA IN KY ME MD MA MI NH NJ NY NC OH PA RI SC TN VT VA WV", Central: "AL AR IL IA KS LA MN MS MO NE ND OK SD TX WI", Mountain: "AZ CO ID MT NM UT WY", Pacific: "CA NV OR WA", Alaska: "AK", Hawaii: "HI", Atlantic: "PR VI", Chamorro: "GU MP", Samoa: "AS" };
  var IANA = { Eastern: "America/New_York", Central: "America/Chicago", Mountain: "America/Denver", Pacific: "America/Los_Angeles", Alaska: "America/Anchorage", Hawaii: "Pacific/Honolulu", Atlantic: "America/Puerto_Rico", Chamorro: "Pacific/Guam", Samoa: "Pacific/Pago_Pago" };
  var SPLIT = { FL: "Central in the western Panhandle", IN: "Central in NW & SW corners", KY: "Central in the west", MI: "Central in 4 UP counties", TN: "Central in Middle & West TN", ID: "Pacific in the north", OR: "Mountain in Malheur County", TX: "Mountain around El Paso", KS: "Mountain in 4 western counties", NE: "Mountain in the west", ND: "Mountain in the SW", SD: "Mountain in the west", AZ: "most of AZ skips DST", AK: "Hawaii-Aleutian in the Aleutians" };
  function tzOf(st) { for (var k in TZ) if ((" " + TZ[k] + " ").indexOf(" " + st + " ") > -1) return k; return ""; }
  function localTime(zone) { try { return new Date().toLocaleTimeString("en-US", { timeZone: IANA[zone], hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }

  var Z = window.ZIP = {};
  Z.COUNTRIES = COUNTRIES; Z.STATES = STATES;
  Z.norm = function (cc, code) { code = String(code || "").trim().toUpperCase(); if (cc === "US") return code.replace(/\D/g, "").slice(0, 5); if (cc === "CA") return code.replace(/\s/g, "").slice(0, 3); if (cc === "GB") return code.split(/\s+/)[0]; return code; };
  Z.lookup = function (cc, code) {
    cc = (cc || "US").toUpperCase(); code = Z.norm(cc, code);
    return fetch(API + cc.toLowerCase() + "/" + encodeURIComponent(code)).then(function (r) { if (r.status === 404) return null; if (!r.ok) throw new Error("api"); return r.json(); })
      .then(function (j) { if (!j || !j.places || !j.places.length) return null; return { cc: cc, code: j["post code"] || code, country: j.country, places: j.places.map(function (p) { return { name: p["place name"], state: p.state, st: p["state abbreviation"], lat: +p.latitude, lon: +p.longitude }; }) }; });
  };
  var usP = null;
  Z.loadUS = function () {
    if (usP) return usP;
    usP = new Promise(function (res, rej) {
      var prev = window.exports; window.exports = {};
      var s = document.createElement("script"); s.src = US_DATA; s.async = true;
      s.onload = function () { var c = window.exports.codes; window.exports = prev; c ? res(c) : rej(new Error("data")); };
      s.onerror = function () { window.exports = prev; usP = null; rej(new Error("data")); };
      document.head.appendChild(s);
    });
    return usP;
  };
  var z3P = null; Z.zip3 = function () { return z3P || (z3P = fetch(ROOT + "assets/data/zip3.json").then(function (r) { return r.json(); })); };
  Z.usPoint = function (zip) { /* fast: API; fallback: dataset */
    zip = Z.norm("US", zip);
    return Z.lookup("US", zip).then(function (r) { if (r) return { zip: zip, city: r.places[0].name, st: r.places[0].st, lat: r.places[0].lat, lon: r.places[0].lon }; return null; })
      .catch(function () { return Z.loadUS().then(function (c) { var x = c[zip]; return x ? { zip: zip, city: x.city, st: x.state, lat: x.latitude, lon: x.longitude } : null; }); });
  };
  Z.miles = function (a, b, c, d) { var R = 3958.8, r = Math.PI / 180, dl = (c - a) * r, dn = (d - b) * r, h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dn / 2) * Math.sin(dn / 2); return 2 * R * Math.asin(Math.sqrt(h)); };
  Z.bearing = function (a, b, c, d) { var r = Math.PI / 180, y = Math.sin((d - b) * r) * Math.cos(c * r), x = Math.cos(a * r) * Math.sin(c * r) - Math.sin(a * r) * Math.cos(c * r) * Math.cos((d - b) * r), br = (Math.atan2(y, x) / r + 360) % 360; return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(br / 45) % 8]; };
  Z.map = function (lat, lon, zoom) { var d = zoom || 0.08; return '<iframe class="map" loading="lazy" title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=' + (lon - d * 1.6) + "%2C" + (lat - d) + "%2C" + (lon + d * 1.6) + "%2C" + (lat + d) + "&layer=mapnik&marker=" + lat + "%2C" + lon + '"></iframe><p class="small muted">Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors</p>'; };
  Z.region = function (zip) { return REGIONS[+String(zip)[0]] || ""; };
  Z.tz = tzOf;
  function fmt(n) { return Math.round(n).toLocaleString(); }
  function money(n) { return "$" + (Math.round(n / 10) * 10).toLocaleString(); }
  Z.fmt = fmt; Z.money = money;

  /* ---------- moving cost model (ranges; sources on the tool page) ---------- */
  var SIZES = { studio: { h: [2, 4], lb: 2000, t: .7, p: [200, 400], n: "Studio" }, "1br": { h: [3, 5], lb: 3500, t: .85, p: [300, 600], n: "1 bedroom" }, "2br": { h: [4, 7], lb: 5000, t: 1, p: [500, 900], n: "2 bedrooms" }, "3br": { h: [6, 9], lb: 7500, t: 1.15, p: [800, 1300], n: "3 bedrooms" }, "4br": { h: [8, 12], lb: 10000, t: 1.3, p: [1100, 1500], n: "4+ bedrooms" } };
  Z.SIZES = SIZES;
  Z.estimate = function (miles, size, opts) {
    opts = opts || {}; var s = SIZES[size] || SIZES["2br"], out = {};
    var peak = opts.month != null && opts.month >= 4 && opts.month <= 8 ? [1.15, 1.3] : [1, 1];
    if (miles < 100) { var drive = miles / 30; out.type = "Local (hourly)"; out.full = [(s.h[0] + drive) * 100 * peak[0], (s.h[1] + drive) * 200 * peak[1]]; }
    else { var f = Math.min(1.9, Math.max(.75, .6 + .4 * miles / 1000)); out.type = "Long distance (weight × distance)"; out.full = [s.lb * .65 * f * peak[0], s.lb * 1.0 * f * peak[1]]; }
    var truck = (300 + 1.97 * miles) * s.t; out.diy = [truck * .85, truck * 1.25 + (miles > 400 ? miles / 400 * 180 : 0)];
    out.container = [Math.max(900, out.full[0] * .55), Math.max(1700, out.full[1] * .7)];
    out.packing = s.p; if (opts.packing) { out.full = [out.full[0] + s.p[0], out.full[1] + s.p[1]]; }
    if (opts.value) { out.fvp = [opts.value * .01, opts.value * .02]; out.full = [out.full[0] + out.fvp[0], out.full[1] + out.fvp[1]]; }
    out.peak = peak[0] > 1; out.size = s.n; out.weight = s.lb; return out;
  };

  /* ---------- 5-digit code: math + culture facts ---------- */
  Z.mathFacts = function (n) {
    var f = [], x = n, p = 2; while (p * p <= x) { while (x % p === 0) { f.push(p); x /= p; } p++; } if (x > 1) f.push(x);
    var divs = 0, sum = 0; for (var i = 1; i * i <= n; i++) if (n % i === 0) { divs += i * i === n ? 1 : 2; sum += i + (i * i === n || i === 1 ? (i === 1 && n !== 1 ? n : 0) : n / i); }
    var proper = 0; for (var j = 1; j <= n / 2; j++) if (n % j === 0) proper += j;
    var ds = String(n).split("").reduce(function (a, b) { return a + +b; }, 0), root = n ? 1 + (n - 1) % 9 : 0;
    function roman(v) { if (v < 1 || v > 3999) return "—"; var m = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], r = ""; m.forEach(function (q) { while (v >= q[0]) { r += q[1]; v -= q[0]; } }); return r; }
    var s = String(n);
    return { factors: f, prime: f.length === 1 && n > 1, divisors: divs, proper: proper, kind: proper > n ? "abundant" : proper === n ? "perfect" : "deficient", digitSum: ds, root: root, bin: n.toString(2), hex: n.toString(16).toUpperCase(), oct: n.toString(8), roman: roman(n), palindrome: s === s.split("").reverse().join(""), even: n % 2 === 0, sq: Math.sqrt(n) % 1 === 0 };
  };
  Z.FIVE = ["US", "DE", "FR", "ES", "IT", "MX", "TR", "FI", "MY", "TH", "HR", "GT", "PK", "LK", "DO", "SE", "CZ", "SK", "PR", "MC"];
  Z.multi = function (code) {
    return Promise.all(Z.FIVE.map(function (cc) { var c = /^(SE|CZ|SK)$/.test(cc) ? code.slice(0, 3) + " " + code.slice(3) : code; return Z.lookup(cc, c).catch(function () { return null; }); }))
      .then(function (r) { return r.filter(Boolean); });
  };

  /* =================== page controllers =================== */
  document.addEventListener("DOMContentLoaded", function () {
    var sel = $$("select[data-countries]"); sel.forEach(function (s) { s.innerHTML = Object.keys(COUNTRIES).map(function (k) { return '<option value="' + k + '">' + k + " · " + COUNTRIES[k] + "</option>"; }).join(""); });
    if ($("#hero-search")) heroSearch();
    if ($("#lookup-form")) lookupApp();
    if ($("#distance-form")) distanceApp();
    if ($("#radius-form")) radiusApp();
    if ($("#prefix-form")) prefixApp();
    if ($("#decoder-form")) decoderApp();
    if ($("#cost-form")) costApp();
    if ($("#checklist-form")) checklistApp();
    if ($("#rent-form")) rentApp();
    if ($("#quote-app")) quoteApp();
    if ($("#state-app")) stateApp();
  });

  function heroSearch() {
    var f = $("#hero-search");
    f.addEventListener("submit", function (e) { e.preventDefault(); var q = $("[name=q]", f).value.trim(), cc = $("[name=cc]", f).value; if (!q) return; location.href = ROOT + "lookup.html?cc=" + cc + "&q=" + encodeURIComponent(q); });
    $$("[data-try]").forEach(function (b) { b.addEventListener("click", function () { $("[name=q]", f).value = b.getAttribute("data-try"); $("[name=cc]", f).value = b.getAttribute("data-cc") || "US"; f.requestSubmit ? f.requestSubmit() : f.submit(); }); });
  }

  function lookupApp() {
    var f = $("#lookup-form"), out = $("#lookup-out"), p = new URLSearchParams(location.search);
    if (p.get("cc")) $("[name=cc]", f).value = p.get("cc").toUpperCase();
    if (p.get("q")) { $("[name=q]", f).value = p.get("q"); run(); }
    f.addEventListener("submit", function (e) { e.preventDefault(); run(); history.replaceState(null, "", "?cc=" + $("[name=cc]", f).value + "&q=" + encodeURIComponent($("[name=q]", f).value.trim())); });
    function run() {
      var cc = $("[name=cc]", f).value, q = $("[name=q]", f).value.trim(); if (!q) return;
      out.innerHTML = '<p><span class="spin"></span> Looking up ' + esc(q) + "…</p>";
      var isCity = /[a-z]{3,}/i.test(q) && cc === "US" && q.indexOf(",") > -1;
      if (isCity) { var parts = q.split(","), city = parts[0].trim(), st = (parts[1] || "").trim().slice(0, 2).toUpperCase();
        return fetch(API + "us/" + st.toLowerCase() + "/" + encodeURIComponent(city)).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
          if (!j) { out.innerHTML = notFound(q, cc); return; }
          out.innerHTML = '<div class="card"><h2>ZIP codes for ' + esc(j["place name"]) + ", " + esc(j["state abbreviation"]) + '</h2><p class="muted">' + j.places.length + ' ZIP codes found. Click one for full details.</p><div class="chips">' + j.places.map(function (x) { return '<a class="chip chip-l" href="?cc=US&q=' + x["post code"] + '">' + x["post code"] + "</a>"; }).join("") + "</div></div>";
        }).catch(function () { out.innerHTML = errBox(); }); }
      Z.lookup(cc, q).then(function (r) {
        if (!r) { out.innerHTML = notFound(q, cc); return; }
        var a = r.places[0], zone = cc === "US" ? tzOf(a.st) : "", us = cc === "US";
        var h = '<div class="res"><div class="res-h"><span class="pill">' + esc(r.country) + '</span><h2 style="margin:0">' + esc(r.code) + " · " + esc(a.name) + (a.st ? ", " + esc(a.st) : "") + '</h2><button class="btn btn-o btn-sm" data-share type="button">Share</button></div><div class="grid g2"><div class="card"><dl class="kv">' +
          "<dt>Place</dt><dd>" + esc(a.name) + "</dd><dt>" + (us ? "State" : "Region") + "</dt><dd>" + esc(a.state || "—") + (a.st ? " (" + esc(a.st) + ")" : "") + "</dd><dt>Coordinates</dt><dd>" + a.lat.toFixed(4) + ", " + a.lon.toFixed(4) + "</dd>";
        if (us) { h += "<dt>Region (1st digit)</dt><dd>" + esc(Z.region(r.code)) + '</dd><dt>Sectional center</dt><dd id="scf">' + r.code.slice(0, 3) + "xx</dd>"; if (zone) h += "<dt>Time zone</dt><dd>" + zone + (SPLIT[a.st] ? ' <span class="small muted">(' + SPLIT[a.st] + ")</span>" : "") + "<br><span class='small muted'>Local time now: " + localTime(zone) + "</span></dd>"; }
        if (r.places.length > 1) h += "<dt>Also covers</dt><dd>" + r.places.slice(1, 12).map(function (x) { return esc(x.name); }).join(", ") + (r.places.length > 12 ? " +" + (r.places.length - 12) + " more" : "") + "</dd>";
        h += '</dl><div class="chips" style="margin-top:14px"><a class="btn btn-p btn-sm" href="' + ROOT + "get-quotes.html?to=" + encodeURIComponent(r.code) + '">Moving here? Get quotes</a>' + (us ? '<a class="btn btn-o btn-sm" href="' + ROOT + "tools/zip-radius.html?zip=" + r.code + '">ZIPs nearby</a><a class="btn btn-o btn-sm" href="' + ROOT + "states/" + a.st.toLowerCase() + '.html">' + esc(a.st) + " overview</a>" : "") + "</div></div><div>" + Z.map(a.lat, a.lon) + "</div></div>";
        if (us) h += '<div class="card" style="margin-top:16px"><h3>Nearest ZIP codes</h3><div id="near"><button class="btn btn-o btn-sm" type="button" id="near-b">Load the 12 nearest ZIPs</button> <span class="small muted">(loads the 42,555-ZIP dataset, ~1 MB compressed)</span></div></div>';
        h += '<div class="ad-slot" data-ad="inContent"></div></div>';
        out.innerHTML = h;
        if (us) { Z.zip3().then(function (t) { var x = t[r.code.slice(0, 3)]; if (x) $("#scf").innerHTML = r.code.slice(0, 3) + "xx · " + esc(x[0]) + ", " + x[1] + " area (" + x[2] + ' ZIPs) <a class="small" href="' + ROOT + "tools/zip-prefix.html?p=" + r.code.slice(0, 3) + '">decode</a>'; });
          $("#near-b").addEventListener("click", function () { $("#near").innerHTML = '<span class="spin"></span> Loading dataset…'; Z.loadUS().then(function (c) { var arr = []; for (var k in c) { var o = c[k]; if (o.country !== "US" || k === r.code) continue; arr.push([Z.miles(a.lat, a.lon, o.latitude, o.longitude), k, o.city, o.state]); } arr.sort(function (x, y) { return x[0] - y[0]; }); $("#near").innerHTML = '<div class="table-w"><table><tr><th>ZIP</th><th>Place</th><th>Distance</th></tr>' + arr.slice(0, 12).map(function (x) { return '<tr><td><a href="?cc=US&q=' + x[1] + '">' + x[1] + "</a></td><td>" + esc(x[2]) + ", " + x[3] + "</td><td>" + x[0].toFixed(1) + " mi</td></tr>"; }).join("") + "</table></div>"; }).catch(function () { $("#near").textContent = "Could not load the dataset — try again."; }); }); }
        if (window.refreshAds) window.refreshAds();
        $$("[data-share]", out).forEach(function (b) { b.addEventListener("click", function () { var d = { title: document.title, url: location.href }; if (navigator.share) navigator.share(d).catch(function () {}); else { try { navigator.clipboard.writeText(location.href); toast("Link copied"); } catch (e) {} } }); });
      }).catch(function () { out.innerHTML = errBox(); });
    }
    function notFound(q, cc) {
      var extra = cc === "US" && /^\d{5}$/.test(q) ? '<p>This may be an unassigned, retired or private-use number (like our namesake <a href="' + ROOT + 'the-32262-story.html">32262</a>), a unique business ZIP, or a PO-box-only ZIP not in open data. <a href="' + ROOT + "tools/code-decoder.html?n=" + q + '">Decode it worldwide →</a></p>' : "";
      return '<div class="card"><h3>No match for “' + esc(q) + "” in " + esc(COUNTRIES[cc] || cc) + "</h3>" + extra + '<p class="muted small">Tip: for US cities type “City, ST” (e.g. “Jacksonville, FL”). Canada uses the first 3 characters (e.g. “M5V”); the UK uses the outward code (e.g. “SW1A”).</p></div>';
    }
    function errBox() { return '<div class="card"><h3>Lookup service is busy</h3><p class="muted">Please try again in a moment.</p></div>'; }
  }

  function distanceApp() {
    var f = $("#distance-form"), out = $("#distance-out"), p = new URLSearchParams(location.search);
    if (p.get("a")) $("[name=a]", f).value = p.get("a"); if (p.get("b")) $("[name=b]", f).value = p.get("b"); if (p.get("a") && p.get("b")) go();
    f.addEventListener("submit", function (e) { e.preventDefault(); go(); });
    function go() {
      var a = $("[name=a]", f).value, b = $("[name=b]", f).value; out.innerHTML = '<span class="spin"></span>';
      Promise.all([Z.usPoint(a), Z.usPoint(b)]).then(function (r) {
        if (!r[0] || !r[1]) { out.innerHTML = '<div class="card">One of those ZIP codes was not found.</div>'; return; }
        var m = Z.miles(r[0].lat, r[0].lon, r[1].lat, r[1].lon), road = m * 1.2, hrs = road / 55, est = Z.estimate(m, "2br", { month: new Date().getMonth() });
        out.innerHTML = '<div class="grid g3 res"><div class="card"><div class="stat">' + m.toFixed(1) + '</div><div class="stat-l">miles straight-line (' + (m * 1.609).toFixed(1) + ' km)</div></div><div class="card"><div class="stat">~' + fmt(road) + '</div><div class="stat-l">est. road miles · ~' + (hrs < 1 ? Math.round(hrs * 60) + " min" : hrs.toFixed(1) + " h") + ' drive</div></div><div class="card"><div class="stat">' + Z.bearing(r[0].lat, r[0].lon, r[1].lat, r[1].lon) + '</div><div class="stat-l">direction of travel</div></div></div>' +
          '<div class="card" style="margin-top:16px"><p><b>' + r[0].zip + "</b> " + esc(r[0].city) + ", " + r[0].st + " → <b>" + r[1].zip + "</b> " + esc(r[1].city) + ", " + r[1].st + '</p><p>Typical full-service cost for a 2-bedroom on this route: <b>' + money(est.full[0]) + "–" + money(est.full[1]) + '</b>.</p><a class="btn btn-p" href="' + ROOT + "get-quotes.html?from=" + r[0].zip + "&to=" + r[1].zip + '">Get exact quotes for this move</a> <a class="btn btn-o" href="' + ROOT + "tools/moving-cost.html?from=" + r[0].zip + "&to=" + r[1].zip + '">Detailed estimate</a></div>';
        history.replaceState(null, "", "?a=" + r[0].zip + "&b=" + r[1].zip);
      }).catch(function () { out.innerHTML = '<div class="card">Lookup failed — try again.</div>'; });
    }
  }

  function radiusApp() {
    var f = $("#radius-form"), out = $("#radius-out"), p = new URLSearchParams(location.search);
    if (p.get("zip")) { $("[name=zip]", f).value = p.get("zip"); go(); }
    f.addEventListener("submit", function (e) { e.preventDefault(); go(); });
    function go() {
      var zip = Z.norm("US", $("[name=zip]", f).value), rad = +$("[name=r]", f).value || 10;
      out.innerHTML = '<p><span class="spin"></span> Loading 42,555 ZIP codes…</p>';
      Z.loadUS().then(function (c) {
        var o = c[zip]; if (!o) { out.innerHTML = '<div class="card">ZIP ' + esc(zip) + " is not in the dataset.</div>"; return; }
        var arr = []; for (var k in c) { var x = c[k]; if (x.country !== "US") continue; var d = Z.miles(o.latitude, o.longitude, x.latitude, x.longitude); if (d <= rad) arr.push([d, k, x.city, x.state]); }
        arr.sort(function (a, b) { return a[0] - b[0]; });
        var csv = "zip,city,state,miles\n" + arr.map(function (a) { return a[1] + "," + a[2] + "," + a[3] + "," + a[0].toFixed(2); }).join("\n");
        out.innerHTML = '<div class="res-h res"><h2 style="margin:0">' + arr.length + " ZIP codes within " + rad + " mi of " + zip + '</h2><a class="btn btn-o btn-sm" download="zips-within-' + rad + "mi-of-" + zip + '.csv" href="data:text/csv;charset=utf-8,' + encodeURIComponent(csv) + '">Download CSV</a></div><div class="grid g2"><div class="table-w" style="max-height:460px;overflow:auto"><table><tr><th>ZIP</th><th>Place</th><th>Miles</th></tr>' + arr.map(function (a) { return '<tr><td><a href="' + ROOT + "lookup.html?cc=US&q=" + a[1] + '">' + a[1] + "</a></td><td>" + esc(a[2]) + ", " + a[3] + "</td><td>" + a[0].toFixed(1) + "</td></tr>"; }).join("") + "</table></div><div>" + Z.map(o.latitude, o.longitude, Math.min(1.5, rad / 55)) + "</div></div>";
        history.replaceState(null, "", "?zip=" + zip + "&r=" + rad);
      }).catch(function () { out.innerHTML = '<div class="card">Could not load the ZIP dataset. Check your connection and try again.</div>'; });
    }
  }

  function prefixApp() {
    var f = $("#prefix-form"), out = $("#prefix-out"), p = new URLSearchParams(location.search);
    Z.zip3().then(function (t) {
      function show(q) {
        q = String(q).replace(/\D/g, "").slice(0, 3); if (!q) return;
        if (q.length < 3) { var list = Object.keys(t).filter(function (k) { return k.indexOf(q) === 0; }); out.innerHTML = '<div class="card res"><h3>' + list.length + " prefixes start with " + q + '</h3><p class="muted">' + esc(q.length ? Z.region(q + "00") : "") + '</p><div class="table-w" style="max-height:420px;overflow:auto"><table><tr><th>Prefix</th><th>Main city</th><th>State</th><th>ZIPs</th></tr>' + list.map(function (k) { return '<tr><td><a href="?p=' + k + '">' + k + "xx</a></td><td>" + esc(t[k][0]) + "</td><td>" + t[k][1] + "</td><td>" + t[k][2] + "</td></tr>"; }).join("") + "</table></div></div>"; return; }
        var x = t[q]; out.innerHTML = x ? '<div class="card res"><h2>' + q + "xx → " + esc(x[0]) + ", " + x[1] + '</h2><dl class="kv"><dt>Region</dt><dd>' + esc(Z.region(q + "00")) + "</dd><dt>State</dt><dd>" + esc(STATES[x[1]] || x[1]) + "</dd><dt>Active ZIPs in open data</dt><dd>" + x[2] + '</dd></dl><p style="margin-top:12px"><a class="btn btn-o btn-sm" href="' + ROOT + "states/" + x[1].toLowerCase() + '.html">' + esc(STATES[x[1]] || x[1]) + ' ZIP overview</a></p></div>' : '<div class="card res"><h3>' + q + "xx is not an active prefix in open data</h3><p class='muted'>Unassigned or reserved. " + esc(Z.region(q + "00")) + "</p></div>";
        history.replaceState(null, "", "?p=" + q);
      }
      f.addEventListener("submit", function (e) { e.preventDefault(); show($("[name=p]", f).value); });
      if (p.get("p")) { $("[name=p]", f).value = p.get("p"); show(p.get("p")); }
    });
  }

  function decoderApp() {
    var f = $("#decoder-form"), out = $("#decoder-out"), p = new URLSearchParams(location.search);
    if (p.get("n")) { $("[name=n]", f).value = p.get("n"); go(); }
    f.addEventListener("submit", function (e) { e.preventDefault(); go(); });
    function go() {
      var s = $("[name=n]", f).value.replace(/\D/g, "").slice(0, 5); if (s.length !== 5) { toast("Enter exactly 5 digits"); return; }
      var n = +s, m = Z.mathFacts(n), mm = +s.slice(0, 1), dd = +s.slice(1, 3), yy = s.slice(3), mm2 = +s.slice(0, 2), dd2 = +s.slice(2, 4);
      var dates = []; if (mm >= 1 && dd >= 1 && dd <= 31) dates.push(mm + "/" + dd + "/" + yy); if (mm2 >= 1 && mm2 <= 12 && dd2 >= 1 && dd2 <= 31) dates.push(mm2 + "/" + dd2 + "/" + s.slice(4));
      var keys = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ" };
      out.innerHTML = '<div class="res"><div class="card"><div class="digits" style="margin-bottom:14px">' + s.split("").map(function (d) { return '<span style="background:var(--hero);color:#fff">' + d + "</span>"; }).join("") + '</div><h3>As a postal code</h3><div id="dec-geo"><span class="spin"></span> Checking ' + Z.FIVE.length + ' countries that use 5-digit codes…</div></div><div class="grid g2" style="margin-top:16px"><div class="card"><h3>Math profile</h3><dl class="kv"><dt>Prime factors</dt><dd>' + m.factors.join(" × ") + (m.prime ? ' <span class="pill ok">prime</span>' : "") + "</dd><dt>Divisors</dt><dd>" + m.divisors + "</dd><dt>Type</dt><dd>" + m.kind + " (proper divisors sum " + fmt(m.proper) + ")</dd><dt>Digit sum / root</dt><dd>" + m.digitSum + " / " + m.root + "</dd><dt>Binary</dt><dd>" + m.bin + "</dd><dt>Hex / octal</dt><dd>0x" + m.hex + " / " + m.oct + "</dd><dt>Roman</dt><dd>" + m.roman + "</dd><dt>Palindrome</dt><dd>" + (m.palindrome ? "yes" : "no") + '</dd></dl></div><div class="card"><h3>Other readings</h3><dl class="kv"><dt>US region</dt><dd>' + esc(Z.region(s)) + "</dd><dt>As a date</dt><dd>" + (dates.join(" or ") || "—") + "</dd><dt>Phone keypad</dt><dd>" + s.split("").map(function (d) { return keys[d] ? d + "=" + keys[d] : d; }).join(" · ") + '</dd><dt>Read aloud</dt><dd>' + n.toLocaleString() + '</dd></dl><p class="small muted" style="margin-top:10px">Numerology & lucky-number readings are cultural traditions, not facts — treat them as entertainment.</p></div></div></div>';
      Z.multi(s).then(function (r) {
        $("#dec-geo").innerHTML = r.length ? '<div class="table-w"><table><tr><th>Country</th><th>Place(s)</th><th></th></tr>' + r.map(function (x) { return "<tr><td>" + esc(x.country) + "</td><td>" + x.places.slice(0, 4).map(function (p) { return esc(p.name) + (p.state ? ", " + esc(p.state) : ""); }).join("; ") + (x.places.length > 4 ? " +" + (x.places.length - 4) : "") + '</td><td><a href="' + ROOT + "lookup.html?cc=" + x.cc + "&q=" + encodeURIComponent(x.code) + '">details</a></td></tr>'; }).join("") + "</table></div>" : "<p>Not an active postal code in any of the " + Z.FIVE.length + " countries checked — a genuinely free number.</p>";
      }); history.replaceState(null, "", "?n=" + s);
    }
  }

  function costApp() {
    var f = $("#cost-form"), out = $("#cost-out"), p = new URLSearchParams(location.search);
    if (p.get("from")) $("[name=from]", f).value = p.get("from"); if (p.get("to")) $("[name=to]", f).value = p.get("to");
    f.addEventListener("submit", function (e) { e.preventDefault(); go(); }); if (p.get("from") && p.get("to")) go();
    function go() {
      out.innerHTML = '<span class="spin"></span>';
      Promise.all([Z.usPoint($("[name=from]", f).value), Z.usPoint($("[name=to]", f).value)]).then(function (r) {
        if (!r[0] || !r[1]) { out.innerHTML = '<div class="card">ZIP not found.</div>'; return; }
        var miles = Z.miles(r[0].lat, r[0].lon, r[1].lat, r[1].lon) * 1.2, size = $("[name=size]", f).value, d = $("[name=date]", f).value, month = d ? new Date(d + "T12:00").getMonth() : new Date().getMonth();
        var e = Z.estimate(miles, size, { month: month, packing: $("[name=packing]", f).checked, value: +$("[name=value]", f).value || 0 });
        out.innerHTML = '<div class="res"><div class="est"><span class="small">Full-service movers · ' + e.type + "</span><b>" + money(e.full[0]) + " – " + money(e.full[1]) + "</b><span class='small'>" + esc(r[0].city) + ", " + r[0].st + " → " + esc(r[1].city) + ", " + r[1].st + " · ~" + fmt(miles) + " road miles · " + e.size + " (~" + fmt(e.weight) + " lb)" + (e.peak ? " · peak-season pricing" : "") + '</span></div><div class="grid g3" style="margin-top:16px"><div class="card"><h3>DIY truck</h3><div class="stat">' + money(e.diy[0]) + "–" + money(e.diy[1]) + '</div><p class="small muted">Rental, mileage, fuel' + (miles > 400 ? ", lodging" : "") + '. Your labor.</p></div><div class="card"><h3>Moving container</h3><div class="stat">' + money(e.container[0]) + "–" + money(e.container[1]) + '</div><p class="small muted">You pack & load; they drive.</p></div><div class="card"><h3>Packing service</h3><div class="stat">' + money(e.packing[0]) + "–" + money(e.packing[1]) + '</div><p class="small muted">Add-on for full-service moves.</p></div></div><div class="card" style="margin-top:16px"><h3>Lock in a real price</h3><p>Estimates are ranges. A binding written estimate from a USDOT-registered mover is the only price that counts.</p><a class="btn btn-p" href="' + ROOT + "get-quotes.html?from=" + r[0].zip + "&to=" + r[1].zip + "&size=" + size + '">Get up to 5 free quotes</a></div></div>';
      }).catch(function () { out.innerHTML = '<div class="card">Lookup failed — try again.</div>'; });
    }
  }

  var TASKS = [[8, "Set a moving budget and pick a move date (mid-month & mid-week are cheapest)"], [8, "Request 3–5 in-home or video estimates from USDOT-registered movers"], [8, "Start a moving folder: estimates, receipts, inventory"], [7, "Declutter — sell, donate or recycle what you won't move"], [7, "Research schools, doctors and vets at the new address"], [6, "Book your mover; get a written estimate, ‘Your Rights and Responsibilities’ booklet and ‘Ready to Move’ brochure"], [6, "Order boxes, tape and packing paper"], [5, "Give notice to your landlord or schedule your home sale closing"], [4, "File USPS change of address (online fee applies) and update banks, employer, IRS"], [4, "Schedule utility shut-off and new-home connections (power, water, internet)"], [4, "Transfer prescriptions and request medical / school records"], [3, "Pack rarely used rooms first; label boxes by room on two sides"], [3, "Arrange childcare / pet care for moving day"], [2, "Confirm the mover's date, crew arrival window and payment method"], [2, "Update voter registration, insurance and subscriptions"], [2, "Use up frozen food; plan meals for the last week"], [1, "Pack an ‘open first’ box: chargers, meds, documents, sheets, tools"], [1, "Defrost the fridge; disassemble furniture; photograph electronics wiring"], [0, "Moving day: supervise loading, check the inventory and Bill of Lading before signing"], [0, "Do a final walk-through; record meter readings; hand over keys"], [-1, "Unpack essentials; check for damage within the claim window"], [-2, "Update driver's license and vehicle registration (deadlines vary by state)"], [-4, "Meet neighbors, find the local library, and review your move costs"]];
  function checklistApp() {
    var f = $("#checklist-form"), out = $("#checklist-out"), saved = JSON.parse(window.store("ck") || "{}");
    var d0 = window.store("ck_date"); if (d0) $("[name=date]", f).value = d0;
    function draw() {
      var d = $("[name=date]", f).value, base = d ? new Date(d + "T12:00") : null, groups = {};
      TASKS.forEach(function (t, i) { (groups[t[0]] = groups[t[0]] || []).push([i, t[1]]); });
      var done = Object.keys(saved).filter(function (k) { return saved[k]; }).length;
      out.innerHTML = '<div class="bar" style="margin:12px 0 6px"><i style="width:' + Math.round(done / TASKS.length * 100) + '%"></i></div><p class="small muted">' + done + " of " + TASKS.length + " done</p>" + Object.keys(groups).map(Number).sort(function (a, b) { return b - a; }).map(function (w) {
        var when = w > 0 ? w + " week" + (w > 1 ? "s" : "") + " before" : w === 0 ? "Moving day" : -w + " week" + (w < -1 ? "s" : "") + " after";
        if (base) { var dt = new Date(base.getTime() - w * 6048e5); when += " · " + dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
        return '<div class="card" style="margin-bottom:12px"><h3>' + when + '</h3><ul class="check-list">' + groups[w].map(function (t) { return '<li class="' + (saved[t[0]] ? "done" : "") + '"><label><input type="checkbox" data-i="' + t[0] + '"' + (saved[t[0]] ? " checked" : "") + "> " + esc(t[1]) + "</label></li>"; }).join("") + "</ul></div>";
      }).join("");
      $$("input[data-i]", out).forEach(function (c) { c.addEventListener("change", function () { saved[c.getAttribute("data-i")] = c.checked; window.store("ck", JSON.stringify(saved)); draw(); }); });
    }
    $("[name=date]", f).addEventListener("change", function () { window.store("ck_date", $("[name=date]", f).value); draw(); });
    $("#ck-print") && $("#ck-print").addEventListener("click", function () { window.print(); });
    $("#ck-reset") && $("#ck-reset").addEventListener("click", function () { saved = {}; window.store("ck", "{}"); draw(); });
    draw();
  }

  function rentApp() {
    var f = $("#rent-form"), out = $("#rent-out");
    function go() {
      var inc = +$("[name=income]", f).value || 0, per = $("[name=per]", f).value, debt = +$("[name=debt]", f).value || 0, y = per === "hour" ? inc * 2080 : per === "month" ? inc * 12 : inc, mo = y / 12;
      var r30 = mo * .3, r40 = y / 40, dti = Math.max(0, mo * .43 - debt), safe = Math.min(r30, r40, dti);
      out.innerHTML = '<div class="grid g3 res"><div class="card"><div class="stat">' + money(r30) + '</div><div class="stat-l">30% rule (per month)</div></div><div class="card"><div class="stat">' + money(r40) + '</div><div class="stat-l">40× rent landlord test</div></div><div class="card"><div class="stat">' + money(dti) + '</div><div class="stat-l">after debts (43% DTI cap)</div></div></div><div class="note"><b>Comfortable target: ' + money(safe) + "/month.</b> Annual income used: " + money(y) + '. Budget another 10–15% for utilities and renter\'s insurance.</div>';
    }
    f.addEventListener("input", go); f.addEventListener("submit", function (e) { e.preventDefault(); go(); }); go();
  }

  function stateApp() { /* state pages: quick ZIP search scoped to the state */
    var f = $("#state-app"); f.addEventListener("submit", function (e) { e.preventDefault(); var q = $("[name=q]", f).value.trim(); if (!q) return; location.href = ROOT + "lookup.html?cc=US&q=" + encodeURIComponent(/^\d/.test(q) ? q : q + ", " + f.getAttribute("data-st")); }); }

  /* ---------- lead-gen: multi-step quote request ---------- */
  function quoteApp() {
    var form = $("#quote-app"), steps = $$(".step", form), bars = $$(".steps i", form), cur = 0, est = $("#q-est");
    function show(i) { cur = i; steps.forEach(function (s, k) { s.classList.toggle("on", k === i); }); bars.forEach(function (b, k) { b.classList.toggle("on", k <= i); }); var y = form.getBoundingClientRect().top + scrollY - 90; if (scrollY > y) scrollTo({ top: y, behavior: "smooth" }); if (window.gtag) gtag("event", "quote_step", { step: i + 1 }); }
    function valid(i) { var ok = true; $$("input,select,textarea", steps[i]).forEach(function (el) { if (ok && !el.checkValidity()) { el.reportValidity(); ok = false; } }); return ok; }
    $$("[data-next]", form).forEach(function (b) { b.addEventListener("click", function () { if (valid(cur)) { show(cur + 1); if (cur === 1) calc(); } }); });
    $$("[data-back]", form).forEach(function (b) { b.addEventListener("click", function () { show(cur - 1); }); });
    function calc() {
      var a = $("[name=from_zip]", form).value, b = $("[name=to_zip]", form).value, size = ($("[name=size]:checked", form) || {}).value || "2br", d = $("[name=move_date]", form).value;
      est.innerHTML = '<span class="small">Calculating your typical price range…</span>';
      Promise.all([Z.usPoint(a), Z.usPoint(b)]).then(function (r) {
        if (!r[0] || !r[1]) { est.innerHTML = '<span class="small">We\'ll confirm pricing with your quotes.</span>'; return; }
        var m = Z.miles(r[0].lat, r[0].lon, r[1].lat, r[1].lon) * 1.2, e = Z.estimate(m, size, { month: d ? new Date(d + "T12:00").getMonth() : null });
        $("[name=est_miles]", form).value = Math.round(m); $("[name=est_range]", form).value = money(e.full[0]) + "-" + money(e.full[1]); $("[name=route]", form).value = r[0].city + ", " + r[0].st + " → " + r[1].city + ", " + r[1].st;
        est.innerHTML = '<span class="small">Typical full-service range · ' + esc(r[0].city) + " → " + esc(r[1].city) + " · ~" + fmt(m) + " mi</span><b>" + money(e.full[0]) + " – " + money(e.full[1]) + '</b><span class="small">Movers often beat this when they compete. Finish step 3 to see real prices.</span>';
      }).catch(function () { est.innerHTML = '<span class="small">We\'ll confirm pricing with your quotes.</span>'; });
    }
    form.addEventListener("sent", function () { show(0); $("#q-done").hidden = false; form.hidden = true; scrollTo({ top: $("#q-done").getBoundingClientRect().top + scrollY - 100, behavior: "smooth" }); });
  }
})();
