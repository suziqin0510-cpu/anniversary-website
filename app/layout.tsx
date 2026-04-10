import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import InventoryBar from "@/components/InventoryBar";
import { GameProvider } from "@/lib/game-context";
import { MusicProvider } from "@/lib/music-context";

export const metadata: Metadata = {
  title: "苏子钦 & 李丹 | 我们的第一年",
  description: "记录我们恋爱一周年的美好时光",
  keywords: ["恋爱", "纪念", "一周年", "苏子钦", "李丹"],
  authors: [{ name: "苏子钦" }],
  openGraph: {
    title: "苏子钦 & 李丹 | 我们的第一年",
    description: "记录我们恋爱一周年的美好时光",
    type: "website",
  },
  // PWA manifest
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "S&L",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-[#FFF5F5] to-[#FFE4E1] relative">
        <GameProvider>
          <MusicProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </MusicProvider>
        </GameProvider>
      </body>
    </html>
  );
}
