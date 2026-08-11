import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export from day one: this site has no API routes, no middleware,
  // no dynamic SSR — everything is prerenderable via generateStaticParams.
  // Deploying straight to Cloudflare Pages (skipping Vercel entirely) avoids
  // the apex-domain ownership conflict that hit the main Digital Workshop
  // site on its shared free-domain provider.
  output: "export",
};

export default nextConfig;
