import { optionalUrl, packageStateLabel, siteConfig } from "@/lib/config/site";

describe("site configuration", () => {
  it("does not invent external URLs when none are configured", () => {
    expect(siteConfig.links.repository).toBeNull();
    expect(siteConfig.links.pypi).toBeNull();
    expect(siteConfig.links.issues).toBeNull();
  });

  it("reports the package as unreleased", () => {
    expect(siteConfig.package.latestRelease).toBeNull();
    expect(packageStateLabel()).toContain("v0.1.0 is planned");
  });

  it("only accepts http(s) URLs", () => {
    expect(optionalUrl("https://example.org/")).toBe("https://example.org");
    expect(optionalUrl("javascript:alert(1)")).toBeNull();
    expect(optionalUrl("not a url")).toBeNull();
    expect(optionalUrl("")).toBeNull();
  });

  it("has unique navigation targets", () => {
    const hrefs = siteConfig.nav.map((n) => n.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
