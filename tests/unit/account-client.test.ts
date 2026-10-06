import { AccountClient } from "@/lib/api/account-client";
import { apiBaseUrl } from "@/lib/api";

const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(status === 204 ? null : JSON.stringify(body), { status }));

describe("AccountClient", () => {
  it("sends the session token and validates responses", async () => {
    const fetchImpl = vi.fn(() =>
      json([
        {
          id: "1",
          name: "laptop",
          prefix: "abcd1234",
          createdAt: "2026-10-05T00:00:00Z",
          lastUsedAt: null,
          revokedAt: null,
        },
      ]),
    );
    const client = new AccountClient(
      "https://api.example.org",
      () => "tok",
      fetchImpl as unknown as typeof fetch,
    );
    const keys = await client.listKeys();
    expect(keys[0]?.prefix).toBe("abcd1234");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.example.org/api/v1/keys");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(init.credentials).toBe("omit");
  });

  it("rejects created keys without the expected prefix", async () => {
    const client = new AccountClient("https://api.example.org", () => "tok", (() =>
      json({
        id: "1",
        name: "x",
        prefix: "abcd1234",
        createdAt: "",
        lastUsedAt: null,
        revokedAt: null,
        key: "sk-wrong",
      })) as unknown as typeof fetch);
    await expect(client.createKey("x")).rejects.toMatchObject({ code: "invalid-response" });
  });

  it("surfaces API error messages", async () => {
    const client = new AccountClient("https://api.example.org", () => null, (() =>
      json(
        { error: { code: "invalid_credentials", message: "Email or password is incorrect." } },
        401,
      )) as unknown as typeof fetch);
    await expect(client.login("a@b.org", "x")).rejects.toThrow("Email or password is incorrect.");
  });

  it("handles 204 on revoke", async () => {
    const client = new AccountClient("https://api.example.org", () => "tok", (() =>
      json(null, 204)) as unknown as typeof fetch);
    await expect(client.revokeKey("1")).resolves.toBeUndefined();
  });

  it("validates the configured base URL", () => {
    expect(apiBaseUrl(undefined)).toBeNull();
    expect(apiBaseUrl("javascript:alert(1)")).toBeNull();
    expect(apiBaseUrl("https://api.example.org/")).toBe("https://api.example.org");
  });
});
