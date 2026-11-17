/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // R3F + GSAP: avoid double-mount of WebGL contexts in dev
  transpilePackages: ['three'],
};
export default nextConfig;
