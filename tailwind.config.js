module.exports = {
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    './apps/**/*.html',
    './apps/web/templatetags/form_tags.py',
    './assets/**/*.{js,ts,jsx,tsx,vue}',
    './templates/**/*.html',
    './node_modules/flowbite/**/*.js',
  ],
  safelist: [
    'alert-success',
    'alert-info',
    'alert-error',
    'alert-warning',
    'pg-bg-danger',
    'pg-bg-success',
  ],
  theme: {
    extend: {
      aspectRatio: {
        '3/2': '3 / 2',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--p) / <alpha-value>)",
          foreground: "oklch(var(--pc) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--s) / <alpha-value>)",
          foreground: "oklch(var(--sc) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--er) / <alpha-value>)",
          foreground: "oklch(var(--ec) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin')({
      forms: false,
    }),
    require("daisyui"),
  ],
}
