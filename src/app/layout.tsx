import type { Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

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
      <ConvexAuthNextjsServerProvider>
        <body className={`${includeSans.className} antialiased`}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </ConvexAuthNextjsServerProvider>
    </html>
  );
}
