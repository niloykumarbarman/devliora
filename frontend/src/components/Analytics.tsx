"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

// Google Tag Manager container. Unlike GA4 / Clarity above, GTM is not
// gated on an env var being present: `GTM-TK49XR3M` is Devliora's own
// fixed container (a public ID, not a secret — it ends up in page HTML)
// and it ships on every environment. Set NEXT_PUBLIC_GTM_ID at build
// time only to point a non-prod deploy at a different container.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TK49XR3M";

// Both GA and Microsoft Clarity load with `lazyOnload` — after the page
// has fully loaded and the main thread is quiet — instead of
// `afterInteractive`. Neither is needed for first paint or first input,
// and Clarity in particular (a session recorder) is heavy; keeping both
// off the critical path protects LCP/INP/TBT. Analytics still fires on
// every real visit, just a beat later.
//
// GTM is the exception: it loads `afterInteractive` (right after
// hydration), not `lazyOnload`. It's just a lightweight loader for the
// container, and any consent / event tags configured inside GTM need it
// in place early to be useful. The `<noscript>` iframe below is GTM's
// fallback for JS-disabled visits; `www.googletagmanager.com` is in the
// CSP `frame-src` (next.config.ts) so it isn't blocked.
export default function Analytics() {
  return (
    <>
      {GTM_ID && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}
      {CLARITY_PROJECT_ID && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
    </>
  );
}
