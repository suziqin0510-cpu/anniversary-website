import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  themeColor: "#E8A598",
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
      <body className="min-h-full flex flex-col bg-gradient-to-b from-[#FFFAF8] to-[#FFF8F5]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
