const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',      // generates static /out folder — required for Netlify
  trailingSlash: true,   // /personal → /personal/index.html
  images: {
    unoptimized: true,   // required for static export
  },
};

module.exports = withPWA(nextConfig);
