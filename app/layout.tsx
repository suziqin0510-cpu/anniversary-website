import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientBlobs from "@/components/AmbientBlobs";
import JiumiRain from "@/components/JiumiRain";

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
        <AmbientBlobs />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <JiumiRain />
      </body>
    </html>
  );
}
