import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHmac } from "node:crypto";
import { verifyDownloadToken } from "@/lib/downloads/token";

const WHEEL = "evalsuite-0.1.0-py3-none-any.whl";
// Produced by backend/app/download_tokens.py: sign("0.1.0", WHEEL, "s"*40, 600, now=1_800_000_000)
const VECTOR =
  "eyJleHAiOjE4MDAwMDA2MDAsImYiOiJldmFsc3VpdGUtMC4xLjAtcHkzLW5vbmUtYW55LndobCIsInYiOiIwLjEuMCJ9.3a0afc33f15301d5ba74d76cf5f98d5320e0889b35f9345145d08e135534a61a";

function sign(v: string, f: string, secret: string, exp: number) {
  const encoded = Buffer.from(JSON.stringify({ exp, f, v })).toString("base64url");
  return `${encoded}.${createHmac("sha256", secret).update(encoded).digest("hex")}`;
}

describe("download token verification", () => {
  it("accepts the token produced by the Python API (cross-language vector)", () => {
    expect(verifyDownloadToken(VECTOR, "0.1.0", WHEEL, "s".repeat(40), 1_800_000_000)).toBe(true);
  });

  it("rejects expired, tampered, wrong-file and wrong-secret tokens", () => {
    expect(verifyDownloadToken(VECTOR, "0.1.0", WHEEL, "s".repeat(40), 1_800_000_601)).toBe(false);
    expect(
      verifyDownloadToken(VECTOR, "0.1.0", "evalsuite-0.1.0.tar.gz", "s".repeat(40), 1_800_000_000),
    ).toBe(false);
    expect(verifyDownloadToken(VECTOR, "0.1.0", WHEEL, "x".repeat(40), 1_800_000_000)).toBe(false);
    expect(
      verifyDownloadToken(VECTOR.slice(0, -1) + "0", "0.1.0", WHEEL, "s".repeat(40), 1_800_000_000),
    ).toBe(false);
    expect(verifyDownloadToken("garbage", "0.1.0", WHEEL, "s".repeat(40))).toBe(false);
    expect(verifyDownloadToken(VECTOR, "0.1.0", WHEEL, "", 1_800_000_000)).toBe(false);
  });
});

describe("download route", () => {
  const SECRET = "route-secret-0123456789-abcdefghijklmnop";

  async function load(files: Array<{ filename: string; kind: "wheel" | "sdist" }>) {
    vi.resetModules();
    vi.doMock("@/data/downloads.json", () => ({
      default: {
        releases: [
          {
            version: "0.1.0",
            date: "2026-11-01",
            files: files.map((f) => ({ ...f, size: 5, sha256: "a".repeat(64) })),
          },
        ],
      },
    }));
    const dir = mkdtempSync(join(tmpdir(), "rel-"));
    mkdirSync(join(dir, "0.1.0"));
    writeFileSync(join(dir, "0.1.0", WHEEL), "hello");
    vi.stubEnv("EVALSUITE_RELEASES_DIR", dir);
    vi.stubEnv("DOWNLOAD_TOKEN_SECRET", SECRET);
    return (await import("@/app/api/download/[version]/[file]/route")).GET;
  }

  const call = (
    GET: Awaited<ReturnType<typeof load>>,
    version: string,
    file: string,
    token: string,
  ) =>
    GET(new Request(`https://site.test/api/download/${version}/${file}?token=${token}`), {
      params: Promise.resolve({ version, file }),
    });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@/data/downloads.json");
  });

  it("serves the file as an attachment for a valid link", async () => {
    const GET = await load([{ filename: WHEEL, kind: "wheel" }]);
    const res = await call(
      GET,
      "0.1.0",
      WHEEL,
      sign("0.1.0", WHEEL, SECRET, Date.now() / 1000 + 60),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toBe(`attachment; filename="${WHEEL}"`);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.text()).toBe("hello");
  });

  it("refuses without a valid link (the email step cannot be skipped)", async () => {
    const GET = await load([{ filename: WHEEL, kind: "wheel" }]);
    expect((await call(GET, "0.1.0", WHEEL, "")).status).toBe(403);
    expect(
      (await call(GET, "0.1.0", WHEEL, sign("0.1.0", WHEEL, SECRET, Date.now() / 1000 - 1))).status,
    ).toBe(403);
    expect(
      (
        await call(
          GET,
          "0.1.0",
          WHEEL,
          sign("0.1.0", WHEEL, "other-secret-xxxxxxxxxxxxxxxxxxxxxx", Date.now() / 1000 + 60),
        )
      ).status,
    ).toBe(403);
  });

  it("returns 404 for unknown files and traversal attempts", async () => {
    const GET = await load([{ filename: WHEEL, kind: "wheel" }]);
    const t = sign("0.1.0", "../../etc/passwd", SECRET, Date.now() / 1000 + 60);
    expect((await call(GET, "0.1.0", "../../etc/passwd", t)).status).toBe(404);
    expect((await call(GET, "9.9.9", WHEEL, t)).status).toBe(404);
  });

  it("returns 404 when the manifest lists a file that is not on the server", async () => {
    const GET = await load([{ filename: "evalsuite-0.1.0.tar.gz", kind: "sdist" }]);
    const t = sign("0.1.0", "evalsuite-0.1.0.tar.gz", SECRET, Date.now() / 1000 + 60);
    expect((await call(GET, "0.1.0", "evalsuite-0.1.0.tar.gz", t)).status).toBe(404);
  });
});
