import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
        <Header />
        
        <main className="flex-1">{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
