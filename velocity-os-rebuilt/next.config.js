/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // For Firebase Hosting static export
  trailingSlash: true,
}

module.exports = nextConfig
