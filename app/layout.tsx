import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientBlobs from "@/components/AmbientBlobs";
import JiumiRain from "@/components/JiumiRain";
import GlobalEffects from "@/components/GlobalEffects";
import SecretCode from "@/components/SecretCode";
import HeartCursorTrail from "@/components/HeartCursorTrail";
import VinylPlayer from "@/components/VinylPlayer";
import ScrollJourney from "@/components/ScrollJourney";
import InventoryBar from "@/components/InventoryBar";
import FinalPuzzleModal from "@/components/FinalPuzzleModal";
import RouteGuard from "@/components/RouteGuard";
import GateKeeper from "@/components/GateKeeper";
import ConsoleGreeting from "@/components/ConsoleGreeting";
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
};

export const viewport: Viewport = {
  themeColor: "#E35D6A",
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
            <ConsoleGreeting />
            <GlobalEffects />
            <AmbientBlobs />
            <HeartCursorTrail />
            <SecretCode />
            <ScrollJourney />
            <VinylPlayer />
            <Navbar />
            
            <GateKeeper>
              <RouteGuard>
              <main className="flex-1 relative z-10">{children}</main>
            </RouteGuard>
            </GateKeeper>

            <Footer />
            <JiumiRain />
            <FinalPuzzleModal />
          </MusicProvider>
        </GameProvider>
      </body>
    </html>
  );
}
