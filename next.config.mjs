/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: "false",
  },

  async headers() {
    return [
      {
        source: "/api/gemini",
        headers: [
          {
            key: "Content-Type",
            value: "text/event-stream",
          },
          {
            key: "Cache-Control",
            value: "no-cache",
          },
          {
            key: "Connection",
            value: "keep-alive",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
