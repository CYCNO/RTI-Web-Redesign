"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{
        top: 24,
        right: 24,
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#161618",
          color: "#ffffff",
          border: "1px solid #2f2f35",
          borderRadius: "16px",
          padding: "14px 20px",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "1.4",
          maxWidth: "420px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 90, 44, 0.15)",
        },
        success: {
          iconTheme: {
            primary: "#ff5a2c",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
