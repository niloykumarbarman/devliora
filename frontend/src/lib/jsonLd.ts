/**
 * Safe serialisation for JSON-LD injected via dangerouslySetInnerHTML.
 *
 * `JSON.stringify` does not escape `<`, `>` or `&`, so a string inside
 * the structured data — a blog title, a case-study name, an office
 * address, anything ultimately sourced from the CMS — that contained
 * `</script>` would break out of the `<script type="application/ld+json">`
 * block and inject markup. Escaping those three characters (plus the
 * U+2028 / U+2029 line separators, which are valid JSON but invalid in a
 * raw script body) closes that hole. The escaped forms are still valid
 * JSON, so consumers parse the block unchanged.
 *
 * Prefer the <JsonLd> component (src/components/JsonLd.tsx); use this
 * directly only when you need the string.
 */

// Built with `new RegExp` so the U+2028 / U+2029 code points don't appear
// literally in this source file (they're line terminators to the JS
// lexer and would break the regex literal).
const UNSAFE = new RegExp("[<>&\\u2028\\u2029]", "g");

function escapeChar(ch: string): string {
  return "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
}

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE, escapeChar);
}
