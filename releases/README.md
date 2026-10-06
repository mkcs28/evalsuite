Release files live here as `releases/<version>/<file>`. This folder is deliberately **not** public:
files are served only by `src/app/api/download/[version]/[file]/route.ts` to visitors holding a
short-lived signed link, issued by the API after they give an email for security notices.

Do not add files by hand: run `npm run release:add` (see the repository README).
