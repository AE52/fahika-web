/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
    unoptimized: true
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080'
  }
}

module.exports = nextConfig 