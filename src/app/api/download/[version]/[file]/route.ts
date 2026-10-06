import { createReadStream, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { releases } from "@/lib/downloads/manifest";
import { verifyDownloadToken } from "@/lib/downloads/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function problem(status: number, message: string): Response {
  return Response.json({ error: { message } }, { status, headers: HEADERS });
}

/**
 * Serves a release file only for a valid, unexpired link signed by the API after the
 * visitor gave an email for security notices. Files live outside public/.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ version: string; file: string }> },
): Promise<Response> {
  const { version, file } = await params;
  const entry = releases.find((r) => r.version === version)?.files.find((f) => f.filename === file);
  if (!entry) return problem(404, "This release file does not exist.");

  const token = new URL(request.url).searchParams.get("token") ?? "";
  // Same secret as the API; the EVALSUITE_ name lets both services share one env file.
  const secret =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.EVALSUITE_DOWNLOAD_TOKEN_SECRET || "";
  if (!verifyDownloadToken(token, version, file, secret)) {
    return problem(
      403,
      "This download link is missing or has expired. Request a new one on the download page.",
    );
  }

  const root = resolve(process.env.EVALSUITE_RELEASES_DIR ?? join(process.cwd(), "releases"));
  const path = resolve(root, version, file);
  if (!path.startsWith(root + sep)) return problem(404, "This release file does not exist.");
  let size: number;
  try {
    size = statSync(path).size;
  } catch {
    return problem(404, "This release file is not available on this server.");
  }
  const body = Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
  return new Response(body, {
    status: 200,
    headers: {
      ...HEADERS,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
      "Content-Disposition": `attachment; filename="${entry.filename}"`,
      "X-Checksum-SHA256": entry.sha256,
    },
  });
}
