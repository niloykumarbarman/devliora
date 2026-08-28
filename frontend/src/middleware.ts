import { NextResponse, type NextRequest } from "next/server";

/**
 * URL hygiene: one canonical casing per address.
 *
 * Every slug on this site is validated lowercase at the data layer, and
 * every internal link is built from that slug, so the site never
 * *produces* a mixed-case URL. This only catches ones that arrive from
 * outside — an old bookmark, a hand-typed address, a mistyped inbound
 * link — and 308-redirects them to the all-lowercase form instead of
 * letting them 404. The redirect is permanent and method-preserving, so
 * search engines fold any link equity onto the canonical URL.
 *
 * Trailing-slash normalisation is handled separately by Next
 * (`trailingSlash: false` in next.config.ts), and www -> non-www by both
 * next.config and nginx. Query strings and hashes are passed through
 * untouched — tracking params are analytics' business, not the URL's.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast path: no uppercase A-Z in the path, nothing to do.
  if (!/[A-Z]/.test(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on page routes only — skip Next internals, the API proxy, and
  // any path that looks like a static file (has a dot in the last
  // segment, e.g. favicon.ico, robots.txt, *.png).
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
