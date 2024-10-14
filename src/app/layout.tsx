import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import { WalletProvider } from "@/components/WalletProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-[#D1D5DB] p-2 min-h-screen`}
      >
        <WalletProvider>
          <Navbar />
          <main className="lg:ml-[14rem] lg:mt-[3.5rem] pl-2 pr-2 lg:pr-0 pt-2">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
