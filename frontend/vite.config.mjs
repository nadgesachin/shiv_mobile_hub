import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split heavy third-party libs into their own chunks so the main
        // bundle stays small and the browser caches each lib independently.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'charts': ['recharts', 'd3'],
          'icons': ['lucide-react', 'react-icons'],
          'forms': ['react-hook-form'],
          'helmet': ['react-helmet', 'react-helmet-async'],
          'utils': ['date-fns', 'axios', 'clsx', 'class-variance-authority', 'tailwind-merge'],
          'socket': ['socket.io-client'],
        },
      },
    },
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4029",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});