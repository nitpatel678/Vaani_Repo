/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GeistSans", "ui-sans-serif", "system-ui"],
        mono: ["GeistMono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        background: "#ffffff",
        foreground: "#1f2937",

        card: "#f1f5f9",
        "card-foreground": "#1f2937",

        popover: "#ffffff",
        "popover-foreground": "#1f2937",

        primary: "#1f2937",
        "primary-foreground": "#ffffff",

        secondary: "#6366f1",
        "secondary-foreground": "#ffffff",

        muted: "#f1f5f9",
        "muted-foreground": "#1f2937",

        accent: "#6366f1",
        "accent-foreground": "#ffffff",

        destructive: "#d97706",
        "destructive-foreground": "#ffffff",

        border: "#e5e7eb",
        input: "#f1f5f9",
        ring: "rgba(99, 102, 241, 0.5)",

        "chart-1": "#6366f1",
        "chart-2": "#d97706",
        "chart-3": "#1f2937",
        "chart-4": "#f1f5f9",
        "chart-5": "#374151",

        sidebar: "#f1f5f9",
        "sidebar-foreground": "#1f2937",
        "sidebar-primary": "#6366f1",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#d97706",
        "sidebar-accent-foreground": "#ffffff",
        "sidebar-border": "#e5e7eb",
        "sidebar-ring": "rgba(99, 102, 241, 0.5)",
      },
      borderRadius: {
        sm: "calc(0.5rem - 4px)",
        md: "calc(0.5rem - 2px)",
        lg: "0.5rem",
        xl: "calc(0.5rem + 4px)",
      },
    },
  },
  plugins: [],
};
