import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";
import { satoshiFont } from "@repo/lib/assets/fonts/satoshi/satoshi";
import { MobileSwipeNavigationProvider } from "@repo/lib/modules/mobile-pwa/layout/MobileShell";
import { MobilePwaProviders } from "@repo/lib/modules/mobile-pwa/providers/MobilePwaProviders";
import "@mobile/app/globals.css";

export const metadata: Metadata = {
  title: "Balancer",
  description: "A mobile-first PWA for watching Balancer portfolio positions.",
  icons: [
    { rel: "icon", url: "/favicon-dark.avif" },
    { rel: "apple-touch-icon", url: "/favicon-dark.avif" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Balancer",
  },
};

export const viewport: Viewport = {
  themeColor: "#11141c",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={satoshiFont.className}>
        <MobilePwaProviders>
          <MobileSwipeNavigationProvider>{children}</MobileSwipeNavigationProvider>
        </MobilePwaProviders>
      </body>
    </html>
  );
}
