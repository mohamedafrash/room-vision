import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: 'RoomVision AI Studio',
  description:
    'RoomVision AI turns your room photos into photoreal design variations powered by Gemini 2.5 Flash Image via Vercel AI Gateway.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'RoomVision AI Studio',
    description:
      'Upload a room photo, describe the change, and generate polished interior concepts in minutes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoomVision AI Studio',
    description:
      'Photoreal room transformations powered by Vercel AI Gateway + Gemini 2.5 Flash Image.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
