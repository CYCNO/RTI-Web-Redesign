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
  },
};

export default nextConfig;
