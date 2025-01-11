/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*'
      }
    ]
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080'
  }
}

module.exports = nextConfig 