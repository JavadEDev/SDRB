/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["thumbs.dreamstime.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
      },
    ],
  },
}

module.exports = nextConfig

