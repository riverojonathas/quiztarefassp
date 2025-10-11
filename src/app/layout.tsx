'use client';

import { Geist, Geist_Mono } from "next/font/google";
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Quiz App</title>
        <meta name="description" content="Competitive Quiz App Demo" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {isClient && user && <Header />}
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
            {isClient && user && <div className="h-20 safe-area-bottom" />}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
