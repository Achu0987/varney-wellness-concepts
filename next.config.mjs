/** @type {import('next').NextConfig} */
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: false, // R3F + GSAP: avoid double-mount of WebGL contexts in dev
  transpilePackages: ['three'],
  // static export for GitHub Pages (enabled by the workflow)
  ...(process.env.STATIC_EXPORT ? { output: 'export', trailingSlash: true, images: { unoptimized: true }, basePath: base, assetPrefix: base || undefined } : {}),
};
export default nextConfig;
