/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  experimental: {
    urlImports: [
      "https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js",
    ],
  },
};

module.exports = nextConfig;
