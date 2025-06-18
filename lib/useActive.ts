'use client'

import { usePathname } from 'next/navigation';

export function useIsActive(paths: string[]) {
    const  pathname  = usePathname()
    return paths.includes(pathname)
  }