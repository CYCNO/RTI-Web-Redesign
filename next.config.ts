import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LOGIN_USERNAME:
      process.env.NEXT_PUBLIC_LOGIN_USERNAME ||
      process.env.LOGIN_USERNAME ||
      process.env.LOGIN_EMAIL ||
      process.env.GMAIL ||
      process.env.EMAIL ||
      "",
    NEXT_PUBLIC_LOGIN_PASSWORD:
      process.env.NEXT_PUBLIC_LOGIN_PASSWORD ||
      process.env.LOGIN_PASSWORD ||
      process.env.PASSWORD ||
      process.env.GMAIL_PASSWORD ||
      "",
    NEXT_PUBLIC_APPWRITE_ENDPOINT:
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      process.env.APPWRITE_ENDPOINT ||
      "https://fra.cloud.appwrite.io/v1",
    NEXT_PUBLIC_APPWRITE_PROJECT_ID:
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
      process.env.APPWRITE_PROJECT_ID ||
      "6a9156ec003a9469b2b3",
    NEXT_PUBLIC_APPWRITE_PROJECT_NAME:
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME ||
      process.env.APPWRITE_PROJECT_NAME ||
      "hackathon(rti)",
    NEXT_PUBLIC_APPWRITE_DATABASE_ID:
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
      process.env.APPWRITE_DATABASE_ID ||
      "6a9158c6002d922e76a0",
    NEXT_PUBLIC_APPWRITE_COLLECTION_ID:
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID ||
      process.env.APPWRITE_COLLECTION_ID ||
      "rtis",
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
