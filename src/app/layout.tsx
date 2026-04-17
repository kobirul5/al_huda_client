import type { Metadata } from "next";
import { Amiri, Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-arabic-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Al-Huda",
  description: "Al-Huda authentication and access experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body

        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${notoNaskhArabic.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
