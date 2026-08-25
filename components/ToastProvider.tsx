"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#161618",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        },
        success: {
          iconTheme: {
            primary: "#ff5a2c",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
