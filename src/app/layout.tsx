'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Header } from "../components/Header";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { PageTransition } from "../components/PageTransition";
import { useSessionStore } from "../state/useSessionStore";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const user = useSessionStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if current path is an auth page (signin/signup)
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  return (
    <html lang="en">
      <head>
        <title>Quiz App</title>
        <meta name="description" content="Competitive Quiz App Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {isClient && user && !isAuthPage && <Header />}
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
            {isClient && user && !isAuthPage && <div className="h-20 safe-area-bottom" />}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
