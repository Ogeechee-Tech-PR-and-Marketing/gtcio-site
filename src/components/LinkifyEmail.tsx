const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Renders plain text with any email address turned into a mailto: link, so an
 * FAQ answer can name a contact without needing markup.
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
