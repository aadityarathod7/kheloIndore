import DOMPurify from "dompurify";

/**
 * Sanitize server-provided HTML (blog descriptions, coach/trainer bios,
 * venue descriptions, policies) before rendering with dangerouslySetInnerHTML.
 * DOMPurify removes scripts, event handlers, javascript: URLs and other XSS
 * vectors while keeping the rich-text formatting admins expect (inline
 * styles are kept but CSS-sanitized by DOMPurify).
 */
export const sanitizeHtml = (dirtyHtml: string | null | undefined): string => {
  if (!dirtyHtml) return "";
  return DOMPurify.sanitize(dirtyHtml, {
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "link",
      "meta",
      "base",
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data:image\/[a-z+]+):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
};
