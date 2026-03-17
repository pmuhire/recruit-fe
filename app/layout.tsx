"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Providers from "@/context/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-100">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
