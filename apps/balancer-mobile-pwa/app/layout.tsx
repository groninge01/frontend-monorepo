import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";
import { satoshiFont } from "@repo/lib/assets/fonts/satoshi/satoshi";
import { MobilePwaProviders } from "@repo/lib/modules/mobile-pwa/providers/MobilePwaProviders";
import "@mobile/app/globals.css";

export const metadata: Metadata = {
  title: "Balancer Mobile",
  description: "A mobile-first PWA for watching Balancer portfolio positions.",
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/icon.svg" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Balancer",
  },
};

export const viewport: Viewport = {
  themeColor: "#383E47",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={satoshiFont.className}>
        <MobilePwaProviders>{children}</MobilePwaProviders>
      </body>
    </html>
  );
}
