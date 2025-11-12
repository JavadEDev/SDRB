import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text)',
        muted: {
          DEFAULT: 'var(--muted-bg)',
          foreground: 'var(--muted-text)',
        },
        primary: {
          DEFAULT: 'var(--action-primary-bg)',
          foreground: 'var(--action-primary-text)',
        },
        secondary: {
          DEFAULT: 'var(--action-secondary-bg)',
          foreground: 'var(--action-secondary-text)',
        },
        accent: {
          DEFAULT: 'var(--action-accent-bg)',
          foreground: 'var(--action-accent-text)',
        },
        destructive: {
          DEFAULT: 'var(--action-destructive-bg)',
          foreground: 'var(--action-destructive-text)',
        },
        card: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--card-text)',
        },
        popover: {
          DEFAULT: 'var(--popover-bg)',
          foreground: 'var(--popover-text)',
        },
        border: 'var(--input-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', '"Playfair Display"', 'ui-serif', 'serif'],
        mono: ['var(--font-mono)', 'Menlo', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) * 1.5)',
        xl: 'calc(var(--radius) * 2)',
      },
      maxWidth: {
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
export default config;

