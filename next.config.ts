import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Self-contained server bundle for the Docker image (.next/standalone).
  output: "standalone",
  // Release files are private (not in public/); bundle them with the download route.
  outputFileTracingIncludes: { "/api/download/[version]/[file]": ["./releases/**/*"] },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX({
  // Plugin given by name so it works with Turbopack (GitHub-flavoured Markdown: tables).
  options: { remarkPlugins: [["remark-gfm", {}]] },
});

export default withMDX(nextConfig);
