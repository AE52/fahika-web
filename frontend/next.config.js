/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080'
  }
};

module.exports = nextConfig; 