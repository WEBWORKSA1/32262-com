/* =========================================================
   32262.com — site configuration (the only file you edit)
   ========================================================= */
window.SITE = {
  name: "32262 · ZIP & Move Intelligence",
  domain: "32262.com",
  partnerContact: "https://web.works/contact",

  /* Google AdSense — paste your publisher id (e.g. "ca-pub-1234567890123456") once approved.
     Leave empty and every ad slot shows a house ad that sells your own inventory. */
  ADSENSE_CLIENT: "",
  AD_SLOTS: { inContent: "", sidebar: "", footer: "" },

  /* YouTube — your channel URL and video ids. Empty list = curated topic cards linking to YouTube search. */
  YOUTUBE_CHANNEL: "",
  VIDEOS: [
    // { id: "VIDEO_ID", title: "How ZIP codes actually work", topic: "zip" },
  ],

  /* Donations — paste any of these when ready. Empty = pledge form is used. */
  DONATE: { paypal: "", kofi: "", bmac: "", stripe: "", patreon: "" },
  DONATION_GOAL: { label: "Q4 2026 data & server fund", raised: 0, goal: 2500 },

  /* Affiliate / partner deep links (optional). Empty = lead goes to the site inbox. */
  AFFILIATES: { movers: "", insurance: "", realEstate: "", storage: "", internet: "" },

  /* Analytics — GA4 measurement id, e.g. "G-XXXXXXX" */
  GA4: ""
};

/* Contact routing — obfuscated, assembled only at runtime. Never replace with plain text. */
window.__r = [90,88,84,25,91,94,86,90,80,119,6,86,68,92,69,88,64,85,82,64];
