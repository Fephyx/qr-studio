
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/css/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Studio | QR Code Generator",
  description:
    "Vytvářej, přizpůsobuj a stahuj vlastní QR kódy zdarma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <link
            href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.boxicons.com/3.0.8/fonts/filled/boxicons-filled.min.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.boxicons.com/3.0.8/fonts/brands/boxicons-brands.min.css"
            rel="stylesheet"
          />
        </head>
      
      <body>{children}</body>

    </html>
  );
}
