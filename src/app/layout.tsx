import type { Metadata } from "next";
import { IBM_Plex_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

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
      <body className={`${spaceGrotesk.variable} ${ibmPlexSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
