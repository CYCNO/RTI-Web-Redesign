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
      "",
    NEXT_PUBLIC_APPWRITE_PROJECT_NAME:
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME ||
      process.env.APPWRITE_PROJECT_NAME ||
      "",
    NEXT_PUBLIC_APPWRITE_DATABASE_ID:
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
      process.env.APPWRITE_DATABASE_ID ||
      "rti_db",
    NEXT_PUBLIC_APPWRITE_COLLECTION_ID:
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID ||
      process.env.APPWRITE_COLLECTION_ID ||
      "rtis",
  },
};

export default nextConfig;
