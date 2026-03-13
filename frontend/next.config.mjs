/** @type {import('next').NextConfig} */
const backendOrigin = (process.env.BACKEND_ORIGIN || "http://localhost:8000").replace(/\/$/, "");

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
