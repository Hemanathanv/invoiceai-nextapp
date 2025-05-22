// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    // If you want to center the “container” utility with padding, keep this section
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /* ─────────────────────────────────────────────────────────────────────
         1) COLORS from your original config (using CSS variables + custom palettes)
         ───────────────────────────────────────────────────────────────────── */
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Your custom brand palette
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // A small “dark” palette (for quick utility use if needed)
        dark: {
          DEFAULT: '#0F172A',
          lighter: '#1E293B',
        },
        // A small “purple” palette (so “from-purple” / “to-purple-500” works)
        purple: {
          light: '#A78BFA',
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
      },

      /* ─────────────────────────────────────────────────────────────────────
         2) Border‐radius and fonts (already in your config)
         ───────────────────────────────────────────────────────────────────── */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'], 
      },

      /* ─────────────────────────────────────────────────────────────────────
         3) Box shadows
         ───────────────────────────────────────────────────────────────────── */
      boxShadow: {
        soft: '0 5px 15px rgba(0, 0, 0, 0.05)',
        card: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },

      /* ─────────────────────────────────────────────────────────────────────
         4) Keyframes (including your “pulse-gentle” from earlier)
         ───────────────────────────────────────────────────────────────────── */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      /* ─────────────────────────────────────────────────────────────────────
         5) Animation utilities
         ───────────────────────────────────────────────────────────────────── */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // your existing plugin
  ],
}

export default config satisfies Config
