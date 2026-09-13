import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // גרסה גלויה בפוטר — מאפשרת לוודא מהדפדפן איזו גרסה חיה אצל הסטודנטים.
    // מקור: "version" ב-package.json. לא git describe — Vercel בונה בלי .git.
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      `${pkg.version} · ${new Date().toISOString().slice(0, 10)}`
    ),
  },
})
