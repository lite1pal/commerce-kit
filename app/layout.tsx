import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import CartCheckoutCardServer from "./components/CartCheckoutCardServer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CommerceKit Storefront",
    template: "%s | CommerceKit",
  },
  description: "A minimal commerce storefront demo.",
  openGraph: {
    title: "CommerceKit Storefront",
    description: "A minimal commerce storefront demo.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommerceKit Storefront",
    description: "A minimal commerce storefront demo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <CartCheckoutCardServer />
      </body>
    </html>
  );
}
