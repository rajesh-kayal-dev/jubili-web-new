//
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/contexts/ToastContext';
import FullscreenWrapper from "@/components/layout/FullscreenWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jubili",
  description: "next gen ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          {/* <FullscreenWrapper> */}
            {children}
          {/* </FullscreenWrapper> */}
        </ToastProvider>
      </body>
    </html>
  );
}
