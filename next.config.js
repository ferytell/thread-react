/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {                                         // on dev server database is allowed to acces nextjs
      serverActions: true,
      serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      remotePatterns: [                                     // list of addres that allowed to acces nextjs
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "images.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "uploadthing.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
      typescript: {
        ignoreBuildErrors: true,
      },
    },
  };
  
  module.exports = nextConfig;