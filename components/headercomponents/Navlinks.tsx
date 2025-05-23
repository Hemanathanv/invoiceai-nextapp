// components/NavLinks.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  isAuthenticated: boolean;
};

const NavLinks: React.FC<Props> = ({ isAuthenticated }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

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
    </nav>
  );
};

export default NavLinks;
