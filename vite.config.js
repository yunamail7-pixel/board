import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages 預設會把網站放在 /Rinka/ 這種路徑下
  // 所以我們設定 base 為 './' (相對路徑) 讓資源能正確載入
  base: './',
})
