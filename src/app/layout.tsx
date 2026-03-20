import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { BottomNav, Header } from "@/components/features/navigation";
import { Providers } from "@/app/components/providers";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/utils/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Suspense fallback={null}>
          <Providers>
            <Header />
            <main className="container mx-auto px-4 pb-20 pt-6 md:pb-6">{children}</main>
            <BottomNav />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
