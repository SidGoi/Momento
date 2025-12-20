/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
