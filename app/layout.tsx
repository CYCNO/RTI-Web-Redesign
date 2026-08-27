import type { Metadata } from "next";
import { Poppins, Anton } from "next/font/google";
import "./globals.css";
import TopProgressBar from "@/components/TopProgressBar";
import ToastProvider from "@/components/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Right to Information Portal",
  description: "File RTI applications and first appeals online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${anton.variable} ${poppins.className} font-poppins h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-poppins"
      >
        <ToastProvider />
        <TopProgressBar />
        {children}
      </body>
    </html>
  );
}
