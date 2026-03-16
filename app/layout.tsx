import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Ensure this path matches where your Header file is located
import Header from "./components/Header";
import WhatsAppButton from "./components/WhatsAppButton"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safarnama",
  description: "Travel & Explore with Safarnama",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Fixed the className error by ensuring variables are defined above */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* --- FIXED GLOBAL VIDEO BACKGROUND --- */}
        <div className="video-background-container">
          <video autoPlay loop muted playsInline className="global-video-bg">
            <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="global-video-overlay"></div>
        </div>

        {/* ✅ GLOBAL HEADER - Ensure the import at the top is correct */}
        <Header />

        {/* Page Content */}
        <main className="relative-content">
          {children}
        </main>

        {/* WhatsApp Floating Button */}
        <WhatsAppButton />
      </body>
    </html>
  );
}  