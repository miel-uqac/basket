const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? "/basket" : "",
  assetPrefix: isProd ? "/basket/" : "",
  reactStrictMode: false,
};

module.exports = nextConfig;
