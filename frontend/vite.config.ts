import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  
  server: {
    proxy: {
      // Proxy all /uploads requests to your backend
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Optional: Proxy API requests too if needed
      '/api-v1': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});