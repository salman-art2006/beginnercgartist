// Small allowlist HTML sanitizer for blog content (written by the admin, rendered to visitors).
// Keeps basic formatting, drops everything else: scripts, iframes, event handlers, javascript: URLs.

const ALLOWED_TAGS = new Set([
  "a", "abbr", "b", "blockquote", "br", "code", "div", "em", "figcaption", "figure", "h2", "h3", "h4",
  "hr", "i", "img", "li", "mark", "ol", "p", "pre", "small", "span", "strong", "sub", "sup", "table",
  "tbody", "td", "th", "thead", "tr", "u", "ul",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
};

const SAFE_URL = /^(https?:|mailto:|\/|#)/i;

export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === "undefined") return "";
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  const clean = (node: Element) => {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        if (["script", "style", "iframe", "object", "embed", "form", "input", "button", "svg", "math", "link", "meta"].includes(tag)) {
          child.remove();
        } else {
          // Unknown but harmless wrapper: keep its (cleaned) children.
          clean(child);
          child.replaceWith(...Array.from(child.childNodes));
        }
        continue;
      }
      const allowed = ALLOWED_ATTRS[tag] ?? [];
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        if (!allowed.includes(name)) child.removeAttribute(attr.name);
        else if ((name === "href" || name === "src") && !SAFE_URL.test(attr.value.trim())) child.removeAttribute(attr.name);
      }
      if (tag === "a" && child.getAttribute("target") === "_blank") child.setAttribute("rel", "noopener noreferrer");
      clean(child);
    }
  };

  clean(doc.body);
  return doc.body.innerHTML;
}
