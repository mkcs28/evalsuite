# Security

## Reporting

Please report vulnerabilities privately to the maintainers rather than in a public issue. A dedicated contact
will be listed here once the repository is public.

## Website

- No `eval`, `new Function` or dynamic code execution (enforced by ESLint).
- No user-supplied HTML or Markdown is rendered. The only `dangerouslySetInnerHTML` is Shiki output generated
  from repository-authored code, which Shiki escapes.
- Playground input is parsed as plain numeric tokens with size limits and validated with Zod.
- API calls use `credentials: "omit"`, time out, and validate every response with Zod.
- The session token is kept in `sessionStorage` (cleared when the tab closes), is short-lived, and cannot read
  API-key secrets. Reset tokens are read from the URL fragment and removed from the address bar immediately.
- Only `NEXT_PUBLIC_*` variables reach the browser; none may contain secrets.

## API

- Passwords: Argon2id. Identical errors for unknown emails and wrong passwords; constant-time verification
  path for unknown users.
- Sessions: HS256 JWTs with issuer, audience and expiry checks, bound to a password version so a password
  change or reset ends every other session.
- Eligibility: API access requires a self-declared date of birth showing age 18 or over, enforced on the server
  at registration, key creation and evaluation. This is a declaration, not identity verification.
- API keys: one active key per account (database-enforced), rotatable in one step. Format `es_live_<prefix>_<secret>`; only the prefix and an HMAC-SHA256 with a server-side pepper are
  stored. Keys cannot manage keys. Revocation is immediate.
- Password reset: single-use tokens stored as SHA-256, 30-minute expiry, all outstanding links invalidated on
  use, link token in the URL fragment, identical responses whether or not an account exists.
- Abuse limits: sliding-window rate limits (Redis in production) on sign-in, registration, reset and
  evaluation; 1 MB request bodies; caps on observations and bootstrap resamples.
- Privacy: evaluation data is processed in memory and never stored or logged. Access logs record method,
  path (without query string), status, duration and request id only. Account deletion removes keys, usage
  counters and reset tokens.
- Production start-up fails without distinct secrets, PostgreSQL, SMTP and an `https` site URL.
- Containers run as non-root users. CI runs `npm audit` and `pip-audit`.

## Downloads

- Package files are served only through `/api/download/<version>/<file>` with an HMAC-SHA256 signed link valid
  for 10 minutes, bound to one file. Links are issued by the API after a mandatory email step, rate-limited
  per IP. Files are stored outside `public/`; path traversal and unknown files return 404.
- The email is used only for security notices about the downloaded version. Every notice includes an
  unsubscribe link (token stored as SHA-256, carried in the URL fragment).
- The email is not verified before the download; it is a contact for advisories, not identity proof.

## Known limitations

- No email verification at registration and no multi-factor authentication yet.
- Sessions are bearer tokens in `sessionStorage`; a successful XSS could use one until it expires.
