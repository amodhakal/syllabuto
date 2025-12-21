import type { Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import "./globals.css";

const includeSans = Inclusive_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syllabuto",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${includeSans.className} antialiased`}>{children}</body>
    </html>
  );
}
