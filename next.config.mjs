/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['openpyxl'],
  },
}

module.exports = nextConfig