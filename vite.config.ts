import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss(),],
  ssr: {
    noExternal: ["react-router-dom"], // Ensure proper SSR support
  },
  server: {
    hmr: {
      port: process.env.PORT ? parseInt(process.env.PORT) + 2000 : 3001,
    },
  },
});
