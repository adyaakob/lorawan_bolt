import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // GitHub Pages base path
  base: '/your-repo-name/',
  
  // Multi-page application configuration
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        page1: path.resolve(__dirname, 'pages/page1.html'),
        page2: path.resolve(__dirname, 'pages/page2.html')
      }
    }
  }
});
