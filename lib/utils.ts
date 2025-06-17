// Name: V.Hemanathan
// Describe: This file contains utility functions that are used across the application.
// Framework: Next.js -15.3.2 

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
