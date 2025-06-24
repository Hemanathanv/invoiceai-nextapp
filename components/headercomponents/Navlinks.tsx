// components/NavLinks.tsx
"use client";

import { useIsActive } from '@/lib/useActive';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const NavLinks: React.FC<Props> = ({ isAuthenticated , isAdmin }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const adminPaths = [
    '/admin/dashboard',
    '/admin/dashboard/profiles',
    '/admin/dashboard/invoices',
    '/admin/dashboard/analytics',
    '/admin/dashboard/logs',
    '/admin/dashboard/settings'
  ]
  const isAdminActive = useIsActive(adminPaths)

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link
        href="/"
        className={`text-sm ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}
      >
        Home
      </Link>
      <Link
        href="/pricing"
        className={`text-sm ${isActive('/pricing') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}
      >
        Pricing
      </Link>
      {isAuthenticated && (
        <Link
          href="/dashboard"
          className={`text-sm ${isActive('/dashboard') ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}
        >
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className={`text-sm ${isAdminActive ? 'text-primary font-medium' : 'text-muted-foreground'} transition-colors hover:text-primary`}
        >
          Admin
        </Link>
      )}
    </nav>
  );
};

export default NavLinks;
