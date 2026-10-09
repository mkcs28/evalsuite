import { optionalUrl, packageStateLabel, siteConfig } from "@/lib/config/site";

describe("site configuration", () => {
  it("links to the published package and repository", () => {
    expect(siteConfig.links.repository).toBe("https://github.com/mkcs28/evalsuite-python");
    expect(siteConfig.links.pypi).toBe("https://pypi.org/project/evalsuite-python/");
    expect(siteConfig.links.issues).toBe("https://github.com/mkcs28/evalsuite-python/issues");
  });

  it("reports v0.2.1 as the latest release", () => {
    expect(siteConfig.package.latestRelease).toBe("v0.2.1");
    expect(packageStateLabel()).toBe("Latest release v0.2.1");
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
