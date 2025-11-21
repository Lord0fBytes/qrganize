import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QRganize - Smart Location & Item Tracking",
  description: "Organize your items across locations with QR codes",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QRganize",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#3b82f6",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ServiceWorkerRegister />
        <InstallPrompt />
        {user ? (
          // Authenticated layout with sidebar
          <div className="flex h-screen overflow-hidden bg-slate-900">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto bg-slate-900">
                {children}
              </main>
            </div>
          </div>
        ) : (
          // Unauthenticated layout with header
          <div className="min-h-screen bg-slate-900">
            <Header />
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
