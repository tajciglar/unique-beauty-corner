import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceProvider } from "@/context/ServiceContext";
import "react-day-picker/style.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unique Beauty Corner",
  description: "Welcome to Unique Beauty Corner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="sl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid bg-background`} style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
        <div>
          <ServiceProvider>
            {children}
          </ServiceProvider>
        </div>
        <footer>
          <p className="flex justify-center">© 2025 Unique Beauty Corner</p>
        </footer>
      </body>
    </html>
  );
}