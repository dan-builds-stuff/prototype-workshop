import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { CommandPaletteProvider } from "@/hooks/use-command-palette";
import { ChunkErrorReload } from "@/components/chunk-error-reload";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dan's sandbox",
  description:
    "A working space for prototypes, protected webforms and experiments connected to what I'm building and learning.",
  metadataBase: new URL("https://danbuildsstuff.dpdns.org"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "dan's sandbox",
    description:
      "A working space for prototypes, protected webforms and experiments connected to what I'm building and learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <ChunkErrorReload />
        <CommandPaletteProvider>
          <SiteHeader />
          <CommandPalette />
          <main id="main">{children}</main>
        </CommandPaletteProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
