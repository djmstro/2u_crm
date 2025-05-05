import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "2U Studio Knowledge Base",
  description: "Web application for 2U Studio employees to create, store, and use accumulated experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
