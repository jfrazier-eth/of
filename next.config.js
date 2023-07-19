/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  typescript: {
    tsconfigPath: "./tsconfig.extension.json",
  },
};

module.exports = nextConfig;
