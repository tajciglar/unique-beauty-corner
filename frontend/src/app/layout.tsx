import type { Metadata } from "next";
import {  Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { ServiceProvider } from "@/context/ServiceContext";
import "react-day-picker/style.css";

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni-moda',
  weight: ['400', '700'], // choose what weights you want
});

export const metadata: Metadata = {
  title: "Unique Beauty Corner",
  description: "Welcome to Unique Beauty Corner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="sl">
      <body className={`${bodoniModa.variable} antialiased grid bg-background`} style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
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