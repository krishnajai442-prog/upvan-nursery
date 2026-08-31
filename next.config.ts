/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
},
  allowedDevOrigins: ['10.167.158.75'],
  // allowedDevOrigins: ['trek-generation-firm-nights.trycloudflare.com'],
};
export default nextConfig;


