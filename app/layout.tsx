// Name: V.Hemanathan
// Describe: This is the root layout component for the application. It includes the header, main content, and footer
// Framework: Next.js -15.3.2 

import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { GlobalStateProvider, ProfileProvider } from '@/context/GlobalState';
import { AppProvider } from './providers/app-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "InvoiceAI (Beta)",
  description: "AI-powered invoice and document extraction platform",
  creator: "SPRConsultech",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col"  cz-shortcut-listen="true">
        <AppProvider>
      <ProfileProvider>
        <GlobalStateProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <Footer />
        </GlobalStateProvider>
        </ProfileProvider>
        </AppProvider>
      </body>
    </html>
  );
}
