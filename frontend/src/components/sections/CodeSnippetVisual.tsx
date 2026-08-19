// Decorative "code editor" mockup for TechnologyDetailServices' card
// slot, standing in for kaz.com.bd's per-technology page's stock photo
// of a code editor on some pages (e.g. Java's, unlike .NET's brand-
// colored graphic). Built from styled spans rather than an actual photo
// or real copied source, so no image asset or licensing question is
// involved — just generic, syntax-highlighted-looking placeholder code
// in the given language's general style.
const LINES: { indent: number; tokens: { text: string; color: string }[] }[] = [
  {
    indent: 0,
    tokens: [
      { text: "public class ", color: "text-[#c586c0]" },
      { text: "OrderService ", color: "text-[#4ec9b0]" },
      { text: "{", color: "text-[#d4d4d4]" },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "private final ", color: "text-[#c586c0]" },
      { text: "OrderRepository ", color: "text-[#4ec9b0]" },
      { text: "repository;", color: "text-[#9cdcfe]" },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 1,
    tokens: [
      { text: "public ", color: "text-[#c586c0]" },
      { text: "Order ", color: "text-[#4ec9b0]" },
      { text: "process(Order order) {", color: "text-[#dcdcaa]" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "validate(order);", color: "text-[#dcdcaa]" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "return ", color: "text-[#c586c0]" },
      { text: "repository", color: "text-[#9cdcfe]" },
      { text: ".save(order);", color: "text-[#dcdcaa]" },
    ],
  },
  { indent: 1, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 0, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
];

export default function CodeSnippetVisual() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#1e1e1e" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/50" />
      <pre className="relative flex h-full flex-col justify-center gap-1.5 overflow-hidden px-8 font-mono text-xs leading-relaxed sm:text-sm">
        {LINES.map((line, i) => (
          <div key={i} style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
            {line.tokens.map((token, j) => (
              <span key={j} className={token.color}>
                {token.text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
