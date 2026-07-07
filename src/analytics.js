// Thin Google Analytics 4 (gtag.js) wrapper. Keeping it tool-agnostic behind
// track() means the rest of the app never touches gtag directly.
//
// The measurement id is not a secret (it's exposed client-side by gtag anyway),
// so it's hard-coded with an optional env override. Real data is only sent to
// Google in a production build; in dev, events still buffer into window.dataLayer
// (never leaving the browser) which keeps the wiring testable.

const envGaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
const GA_ID = envGaId !== undefined ? envGaId : "G-5C7CQL933S";
const SEND = process.env.NODE_ENV === "production" && !!GA_ID;

function ensureGtag() {
  if (typeof window === "undefined") return;
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  ensureGtag();
  window.gtag("js", new Date());
  if (!SEND) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(script);
  window.gtag("config", GA_ID);
}

// track a custom event, e.g. track("run_start", { source: "play" })
export function track(event, params) {
  if (typeof window === "undefined") return;
  ensureGtag();
  window.gtag("event", event, params || {});
}
