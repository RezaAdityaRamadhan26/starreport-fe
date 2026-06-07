import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StarReport — Platform Laporan Masyarakat",
  description:
    "Platform pelaporan masyarakat modern untuk menyampaikan keluhan, saran, dan laporan kepada pihak terkait secara transparan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ 
                duration: 5000,
                style: {
                  borderRadius: '12px',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                success: {
                  iconTheme: { primary: '#10B981', secondary: 'var(--card)' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: 'var(--card)' },
                },
              }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
