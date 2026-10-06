import { z } from "zod";
import { fetchApi } from "./network";
import { EvaluationClientError } from "./types";

/** Contract for the account endpoints of the EvalSuite API (backend/app/routers). */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.string().nullable().optional(),
  organization: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  createdAt: z.string(),
  /** Derived on the server from the date of birth (18+); the date itself is never returned. */
  eligibleForApi: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;

export const TokenSchema = z.object({
  accessToken: z.string().min(10),
  tokenType: z.literal("bearer"),
  expiresIn: z.number().int().positive(),
});
export type Token = z.infer<typeof TokenSchema>;

export const ApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  prefix: z.string(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable(),
  revokedAt: z.string().nullable(),
});
export type ApiKey = z.infer<typeof ApiKeySchema>;
export const CreatedKeySchema = ApiKeySchema.extend({ key: z.string().startsWith("es_live_") });
export type CreatedKey = z.infer<typeof CreatedKeySchema>;

export const UsageSchema = z.object({
  requestsLast24h: z.number().int(),
  requestsLast30d: z.number().int(),
  observationsLast30d: z.number().int(),
  rateLimitPerMinute: z.number().int(),
});
export type Usage = z.infer<typeof UsageSchema>;

export const ROLES = [
  ["student", "Student"],
  ["academic-researcher", "Academic researcher"],
  ["industry-practitioner", "Industry practitioner"],
  ["clinician", "Clinician"],
  ["educator", "Educator"],
  ["other", "Other"],
] as const;
export type Role = (typeof ROLES)[number][0];

export const MINIMUM_AGE = 18;

/** Whole years between an ISO date of birth and today (the birthday itself counts). */
export function ageFrom(isoDate: string, today: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  return ty - y - (tm < mo || (tm === mo && td < d) ? 1 : 0);
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  role: Role;
  organization: string;
  country: string;
  intendedUse: string;
  acceptTerms: boolean;
}

const MessageSchema = z.object({ message: z.string() });

const ErrorSchema = z.object({ error: z.object({ code: z.string(), message: z.string() }) });

export class AccountClient {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private readonly getToken: () => string | null = () => null,
    private readonly fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
  ) {
    const url = new URL(baseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new EvaluationClientError("API base URL must use http or https.", "validation");
    }
    this.baseUrl = url.toString().replace(/\/$/, "");
  }

  private async call<S extends z.ZodType>(
    path: string,
    schema: S | null,
    init: RequestInit = {},
  ): Promise<z.infer<S>> {
    const token = this.getToken();
    const response = await fetchApi(
      this.baseUrl,
      `${this.baseUrl}/api/v1${path}`,
      {
        ...init,
        credentials: "omit",
        headers: {
          Accept: "application/json",
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      this.fetchImpl,
    );
    if (response.status === 204) return undefined as z.infer<S>;
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const parsed = ErrorSchema.safeParse(body);
      const message = parsed.success
        ? parsed.data.error.message
        : `Request failed with status ${response.status}.`;
      throw new EvaluationClientError(message, response.status < 500 ? "validation" : "server");
    }
    if (!schema) return body as z.infer<S>;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new EvaluationClientError(
        "The EvalSuite API returned data in an unexpected format.",
        "invalid-response",
      );
    }
    return parsed.data;
  }

  register(input: RegisterInput): Promise<User> {
    return this.call("/auth/register", UserSchema, { method: "POST", body: JSON.stringify(input) });
  }

  login(email: string, password: string): Promise<Token> {
    return this.call("/auth/login", TokenSchema, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  me(): Promise<User> {
    return this.call("/auth/me", UserSchema);
  }

  listKeys(): Promise<ApiKey[]> {
    return this.call("/keys", z.array(ApiKeySchema));
  }

  createKey(name: string): Promise<CreatedKey> {
    return this.call("/keys", CreatedKeySchema, { method: "POST", body: JSON.stringify({ name }) });
  }

  /** Revoke the active key and receive its replacement (shown once). */
  rotateKey(id: string): Promise<CreatedKey> {
    return this.call(`/keys/${encodeURIComponent(id)}/rotate`, CreatedKeySchema, {
      method: "POST",
    });
  }

  revokeKey(id: string): Promise<void> {
    return this.call(`/keys/${encodeURIComponent(id)}`, null, { method: "DELETE" }).then(
      () => undefined,
    );
  }

  usage(): Promise<Usage> {
    return this.call("/usage", UsageSchema);
  }

  /** Always resolves with the same message, whether or not the email is registered. */
  forgotPassword(email: string): Promise<string> {
    return this.call("/auth/password/forgot", MessageSchema, {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((r) => r.message);
  }

  resetPassword(token: string, password: string): Promise<string> {
    return this.call("/auth/password/reset", MessageSchema, {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }).then((r) => r.message);
  }

  /** Returns a fresh session token; all other sessions are signed out. */
  changePassword(currentPassword: string, newPassword: string): Promise<Token> {
    return this.call("/auth/password/change", TokenSchema, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  deleteAccount(password: string): Promise<void> {
    return this.call("/auth/me", null, {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }).then(() => undefined);
  }
}
