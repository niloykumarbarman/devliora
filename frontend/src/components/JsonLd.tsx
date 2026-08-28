import { jsonLdHtml } from "@/lib/jsonLd";

/**
 * Renders a `<script type="application/ld+json">` block with the payload
 * safely escaped (see src/lib/jsonLd.ts). Use this everywhere structured
 * data is emitted instead of `JSON.stringify` directly, so a string that
 * ever contains `</script>` can't break out of the tag.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
    />
  );
}
