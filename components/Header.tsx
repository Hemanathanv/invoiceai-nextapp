"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
            <img
              src="/placeholder.svg"
              alt="InvoiceExtract Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-bold text-xl">InvoiceAI</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`text-sm ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
            Home
          </Link>
          <Link href="/pricing" className={`text-sm ${isActive('/pricing') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
            Pricing
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className={`text-sm ${isActive('/dashboard') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href={{ pathname: '/login', query: { tab: 'login' } }}>
                <Button variant="outline">Login</Button>
              </Link>
              <Link href={{ pathname: '/login', query: { tab: 'signup' } }}>
                <Button className="bg-gradient-primary hover:opacity-90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;