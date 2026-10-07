/* 32262.com — shared UI: nav, theme, forms, ads, video, donations, lead modal */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (q, c) { return (c || document).querySelector(q); };
  var $$ = function (q, c) { return Array.prototype.slice.call((c || document).querySelectorAll(q)); };
  window.$q = $; window.$$q = $$;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  window.store = store;
  var ROOT = document.body.getAttribute("data-root") || "/";
  window.ROOT = ROOT;

  /* inbox routing — never rendered into the page */
  function inbox() { return (window.__r || []).slice().reverse().map(function (c) { return String.fromCharCode(c ^ 0x37); }).join(""); }

  /* theme */
  function isDark() { var t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
  function themeIcon() { $$(".theme-t").forEach(function (b) { b.textContent = isDark() ? "☀" : "☾"; }); }
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".theme-t")) return;
    var next = isDark() ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store("theme", next); themeIcon();
  });

  window.toast = function (msg) { var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); } t.textContent = msg; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("on"); }, 3200); };
  window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  document.addEventListener("DOMContentLoaded", function () {
    themeIcon();
    var nav = $(".nav"), scrim = $(".scrim"), burger = $(".burger");
    function close() { nav.classList.remove("open"); scrim.classList.remove("on"); burger.setAttribute("aria-expanded", "false"); }
    burger && burger.addEventListener("click", function () { var o = nav.classList.toggle("open"); scrim.classList.toggle("on", o); burger.setAttribute("aria-expanded", o); });
    scrim && scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); $$(".modal.on").forEach(function (m) { m.classList.remove("on"); }); } });
    var here = location.pathname.replace(/index\.html$/, "");
    $$(".nav a").forEach(function (a) { if (a.pathname.replace(/index\.html$/, "") === here) a.classList.add("active"); });
    $$(".yr").forEach(function (e) { e.textContent = new Date().getFullYear(); });
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: .06 }); $$(".reveal").forEach(function (el) { io.observe(el); }); }
    else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    /* pre-addressed email buttons (address assembled on click only) */
    $$("[data-mail]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "32262.com inquiry"); }); });
    $$("[data-share]").forEach(function (b) { b.addEventListener("click", function () { var d = { title: document.title, url: location.href }; if (navigator.share) navigator.share(d).catch(function () {}); else { try { navigator.clipboard.writeText(location.href); toast("Link copied"); } catch (e) {} } }); });
    ads(); videos(); forms(); donate(); leadModal(); prefill();
    if (S.GA4) { var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + S.GA4; document.head.appendChild(g); window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", S.GA4); }
  });

  /* ---------- ads: AdSense when configured, otherwise house ads ---------- */
  function ads() {
    var slots = $$(".ad-slot"); if (!slots.length) return;
    if (S.ADSENSE_CLIENT) {
      var sc = document.createElement("script"); sc.async = true; sc.crossOrigin = "anonymous";
      sc.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.ADSENSE_CLIENT; document.head.appendChild(sc);
      slots.forEach(function (el) {
        var ins = document.createElement("ins"); ins.className = "adsbygoogle"; ins.style.display = "block";
        ins.setAttribute("data-ad-client", S.ADSENSE_CLIENT);
        var k = el.getAttribute("data-ad") || "inContent"; if (S.AD_SLOTS && S.AD_SLOTS[k]) ins.setAttribute("data-ad-slot", S.AD_SLOTS[k]);
        ins.setAttribute("data-ad-format", "auto"); ins.setAttribute("data-full-width-responsive", "true");
        el.innerHTML = ""; el.appendChild(ins); try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    } else {
      var house = [
        ["Moving this year?", "Compare up to 5 vetted movers — free, no spam calls.", "get-quotes.html", "Get quotes"],
        ["Reach people who are about to move", "Movers, agents, insurers: sponsor a ZIP, a state or a tool.", "advertise.html", "Advertise"],
        ["Win $500 toward your move", "Enter this month's #MyZIP story contest.", "contests.html", "Enter free"],
        ["Keep these tools free", "Support data upkeep, new countries and prizes.", "donate.html", "Support us"]
      ];
      slots.forEach(function (el, i) { var h = house[(i + location.pathname.length) % house.length]; el.innerHTML = '<div class="house"><div><b>' + h[0] + '</b><span>' + h[1] + '</span></div><a class="btn btn-sm btn-p" href="' + ROOT + h[2] + '">' + h[3] + '</a></div>'; });
    }
  }

  /* ---------- YouTube (lite embeds) ---------- */
  function lite(el, id, title) {
    el.innerHTML = '<img loading="lazy" alt="' + esc(title || "Video") + '" src="https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg"><button type="button" aria-label="Play video">▶</button>';
    el.addEventListener("click", function () { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1" title="' + esc(title || "Video") + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; }, { once: true });
  }
  function videos() {
    $$("[data-yt]").forEach(function (el) { lite(el, el.getAttribute("data-yt"), el.getAttribute("data-title")); });
    var box = $("#video-grid"); if (!box) return;
    var vids = S.VIDEOS || [], topic = box.getAttribute("data-topic"), max = +box.getAttribute("data-max") || 99;
    if (topic) vids = vids.filter(function (v) { return !v.topic || v.topic === topic; });
    if (vids.length) {
      box.innerHTML = vids.slice(0, max).map(function (v) { return '<div class="card"><div class="yt" data-id="' + esc(v.id) + '"></div><h3 style="margin-top:12px">' + esc(v.title) + '</h3></div>'; }).join("");
      $$(".yt[data-id]", box).forEach(function (el, i) { lite(el, el.getAttribute("data-id"), vids[i].title); });
    } else {
      var topics = [["How ZIP codes work", "how zip codes work explained"], ["Moving day checklist", "moving checklist tips"], ["Avoid moving scams", "how to avoid moving scams FMCSA"], ["Pack like a pro", "how to pack for a move fast"], ["Cheapest way to move", "cheapest way to move long distance"], ["Choosing a neighborhood", "how to choose a neighborhood when moving"]];
      box.innerHTML = topics.slice(0, max).map(function (t) { return '<a class="card" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(t[1]) + '"><div class="ico">▶</div><h3>' + t[0] + '</h3><p class="muted">Watch top videos on YouTube →</p></a>'; }).join("");
    }
  }

  /* ---------- forms: delivered to the site inbox via FormSubmit (address never in HTML) ---------- */
  function send(form) {
    var fd = new FormData(form), data = {};
    fd.forEach(function (v, k) { if (k === "_honey") return; data[k] = data[k] ? data[k] + ", " + v : v; });
    data._subject = "32262.com — " + (form.getAttribute("data-form") || "Form") + (data.email ? " from " + data.email : "");
    data._template = "table"; data._captcha = "false";
    data.page = location.href; data.submitted = new Date().toISOString();
    return fetch("https://formsubmit.co/ajax/" + inbox(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || String(j.success) === "false") throw new Error(j.message || "send failed"); return j; }); });
  }
  window.sendForm = send;
  function forms() {
    $$("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value) return;
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var btn = form.querySelector('[type="submit"]'), msg = form.querySelector(".form-msg");
        if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
        send(form).then(function () {
          if (msg) { msg.className = "form-msg ok"; msg.textContent = form.getAttribute("data-ok") || "Thank you — received."; }
          form.reset(); toast("Sent ✓"); store("lead_done", "1");
          if (window.gtag) gtag("event", "generate_lead", { form: form.getAttribute("data-form") });
          form.dispatchEvent(new CustomEvent("sent"));
        }).catch(function () {
          if (msg) { msg.className = "form-msg err"; msg.innerHTML = 'Could not send right now. <a href="#" data-fallback>Email us instead</a>.'; var a = msg.querySelector("[data-fallback]"); a && a.addEventListener("click", function (ev) { ev.preventDefault(); var body = []; new FormData(form).forEach(function (v, k) { if (k !== "_honey") body.push(k + ": " + v); }); location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent("32262.com — " + form.getAttribute("data-form")) + "&body=" + encodeURIComponent(body.join("\n")); }); }
        }).then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
      });
    });
  }

  /* ---------- donations ---------- */
  function donate() {
    var g = S.DONATION_GOAL; $$("[data-goal]").forEach(function (el) { if (!g) return; var pct = Math.min(100, Math.round(g.raised / g.goal * 100)); el.innerHTML = '<div class="bar"><i style="width:' + Math.max(pct, 3) + '%"></i></div><p class="small muted" style="margin-top:6px">' + esc(g.label) + ': $' + g.raised.toLocaleString() + ' of $' + g.goal.toLocaleString() + ' (' + pct + '%)</p>'; });
    var box = $("#donate-links"); if (!box) return;
    var D = S.DONATE || {}, names = { paypal: "PayPal", kofi: "Ko-fi", bmac: "Buy Me a Coffee", stripe: "Card (Stripe)", patreon: "Patreon (monthly)" }, out = [];
    Object.keys(names).forEach(function (k) { if (D[k]) out.push('<a class="btn btn-s" target="_blank" rel="noopener" href="' + esc(D[k]) + '">' + names[k] + '</a>'); });
    box.innerHTML = out.length ? out.join(" ") : '<p class="muted small">Instant-payment links are being set up. Use the pledge form — we reply with secure payment details within 24 hours.</p>';
  }

  /* ---------- exit-intent lead modal (once per visitor per 7 days) ---------- */
  function leadModal() {
    var m = $("#lead-modal"); if (!m || document.body.hasAttribute("data-nomodal")) return;
    function open() { var last = +store("lm_seen") || 0; if (store("lead_done") || Date.now() - last < 6048e5) return; store("lm_seen", Date.now()); m.classList.add("on"); }
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest(".modal-x")) m.classList.remove("on"); });
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) open(); });
    var t = setTimeout(function () { if (window.innerWidth < 700 && document.body.scrollHeight > 2000 && window.scrollY > 1200) open(); }, 45000);
    $("form", m).addEventListener("sent", function () { setTimeout(function () { m.classList.remove("on"); }, 1800); clearTimeout(t); });
  }

  /* ---------- prefill form fields from URL (?from=&to=) ---------- */
  function prefill() {
    var p = new URLSearchParams(location.search);
    ["from", "to", "size", "date"].forEach(function (k) { var v = p.get(k); if (!v) return; $$('[name="' + k + '_zip"],[name="' + k + '"],[name="move_' + k + '"]').forEach(function (i) { if (i.type === "radio" || i.type === "checkbox") { i.checked = i.value === v; } else if (i.tagName === "SELECT") { i.value = v; } else if (!i.value) i.value = v; }); });
  }
})();
