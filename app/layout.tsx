// Name: V.Hemanathan
// Describe: This is the root layout component for the application. It includes the header, main content, and footer
// Framework: Next.js -15.3.2 

import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
