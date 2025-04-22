/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/nic-nlp-games' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nic-nlp-games/' : '',
  trailingSlash: true,
}

module.exports = nextConfig 