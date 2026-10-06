import { fetchApi, unreachableMessage } from "@/lib/api/network";
import { AccountClient } from "@/lib/api/account-client";

describe("API network handling", () => {
  it("retries once, so a server that is waking up still answers", async () => {
    let calls = 0;
    const flaky = vi.fn(async () => {
      calls += 1;
      if (calls === 1) throw new TypeError("Failed to fetch");
      return new Response("{}");
    });
    const res = await fetchApi(
      "https://api.example.org",
      "https://api.example.org/x",
      {},
      flaky as unknown as typeof fetch,
      0,
    );
    expect(res.ok).toBe(true);
    expect(calls).toBe(2);
  });

  it("names the API host and the likely causes when it stays unreachable", async () => {
    const down = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(
      fetchApi(
        "https://evalsuite-api.onrender.com",
        "https://evalsuite-api.onrender.com/api/v1/x",
        {},
        down as unknown as typeof fetch,
        0,
      ),
    ).rejects.toMatchObject({
      code: "unavailable",
      message: unreachableMessage("https://evalsuite-api.onrender.com"),
    });
    expect(down).toHaveBeenCalledTimes(2);
    expect(unreachableMessage("https://evalsuite-api.onrender.com")).toMatch(
      /evalsuite-api\.onrender\.com.*waking up.*allow requests from this website/s,
    );
  });

  it("does not retry HTTP errors (only network failures)", async () => {
    const fail = vi.fn(
      async () =>
        new Response(JSON.stringify({ error: { code: "validation_error", message: "nope" } }), {
          status: 422,
        }),
    );
    const client = new AccountClient(
      "https://api.example.org",
      () => null,
      fail as unknown as typeof fetch,
    );
    await expect(client.forgotPassword("a@gmail.com")).rejects.toThrow("nope");
    expect(fail).toHaveBeenCalledTimes(1);
  });
});
