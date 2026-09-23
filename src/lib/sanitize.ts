import "server-only";

// Built via `new RegExp` (not a /.../ literal) so the \u escapes stay as
// literal source text through any tool that JSON-decodes file contents —
// a /.../ literal here once ended up holding raw NUL/0x1f/0x7f bytes.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001f\\u007f]+", "g");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Trim, cap length, and collapse newlines/control characters. Several of
 * these values end up in a notification email's subject line — never let a
 * submitted value smuggle CR/LF toward anything that builds email headers.
 */
export function clean(value: string | undefined, max: number): string {
  return (value ?? "").replace(CONTROL_CHARS, " ").trim().slice(0, max);
}

/** Loose shape check, deliberately: the mail provider does the real validation. */
export function isEmail(value: string): boolean {
  return EMAIL.test(value);
}

type JsonBody<T> = { ok: true; body: T } | { ok: false; status: 400 | 413 };

/**
 * Parses a JSON object body no larger than `maxBytes`. The byte cap is
 * enforced on what actually arrived, so a chunked request with no
 * Content-Length can't skip it; a body that isn't an object (`null`, a bare
 * string) is rejected before a route can read a field off it.
 */
export async function readJsonBody<T extends object>(
  request: Request,
  maxBytes: number
): Promise<JsonBody<T>> {
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) return { ok: false, status: 413 };
  try {
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof body !== "object" || body === null) return { ok: false, status: 400 };
    return { ok: true, body: body as T };
  } catch {
    return { ok: false, status: 400 };
  }
}
