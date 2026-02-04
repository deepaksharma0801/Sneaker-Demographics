import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Global Sneaker Economy",
  description:
    "An editorial scrollytelling report on global sports footwear demand from 2018–2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
