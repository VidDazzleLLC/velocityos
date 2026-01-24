/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Firebase Hosting
  // Firebase Hosting rewrites /api/** to Cloud Functions automatically
  output: 'export',
  images: {
    unoptimized: true,
  },
  // For Firebase Hosting static export
  trailingSlash: true,
}

module.exports = nextConfig
