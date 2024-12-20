import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';

const htmlFiles = glob.sync('pages/*.html').reduce((input, file) => {
  const name = path.basename(file, '.html');
  input[name] = file;
  return input;
}, {
  main: 'index.html'
});

export default defineConfig({
  base: '/lorawan_bolt/',
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      input: htmlFiles
    }
  }
});
