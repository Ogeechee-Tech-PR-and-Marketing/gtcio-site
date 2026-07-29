const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Renders plain text (CMS FAQ answers, etc.) with any email address turned
 * into a mailto: link, so editors can write "contact X at y@z.edu" without
 * needing rich text just to get a working link.
 */
export default function LinkifyEmail({ text }: { text: string }) {
  const parts = text.split(EMAIL_PATTERN);
  const emails = text.match(EMAIL_PATTERN) ?? [];

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {emails[i] && (
            <a href={`mailto:${emails[i]}`} className="font-bold text-brand-red hover:text-brand-black">
              {emails[i]}
            </a>
          )}
        </span>
      ))}
    </>
  );
}
