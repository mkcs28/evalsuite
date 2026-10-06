import { z } from "zod";
import { EvaluationClientError } from "./types";

export const DownloadGrantSchema = z.object({
  downloadPath: z.string().startsWith("/api/download/").nullable(),
  expiresIn: z.number().int().positive().nullable(),
  message: z.string(),
});
export type DownloadGrant = z.infer<typeof DownloadGrantSchema>;

const ErrorSchema = z.object({ error: z.object({ message: z.string() }) });
const MessageSchema = z.object({ message: z.string() });

async function post<S extends z.ZodType>(
  base: string,
  path: string,
  body: unknown,
  schema: S,
): Promise<z.infer<S>> {
  let res: Response;
  try {
    res = await fetch(`${base}/api/v1${path}`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new EvaluationClientError(
      "The EvalSuite API is unavailable. Try again later.",
      "unavailable",
    );
  }
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const parsed = ErrorSchema.safeParse(json);
    throw new EvaluationClientError(
      parsed.success ? parsed.data.error.message : `Request failed with status ${res.status}.`,
      res.status < 500 ? "validation" : "server",
    );
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    throw new EvaluationClientError("Unexpected response from the API.", "invalid-response");
  return parsed.data;
}

/** Give an email (mandatory) and receive a short-lived signed download link. */
export function requestDownload(
  base: string,
  input: { email: string; version: string; filename: string | null },
): Promise<DownloadGrant> {
  return post(
    base,
    "/downloads/request",
    { ...input, acceptSecurityNotices: true },
    DownloadGrantSchema,
  );
}

export function unsubscribe(base: string, token: string): Promise<string> {
  return post(base, "/downloads/unsubscribe", { token }, MessageSchema).then((r) => r.message);
}
