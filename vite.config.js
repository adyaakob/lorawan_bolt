import { defineConfig } from 'vite';

export default defineConfig({
  base: '/lorawan_bolt/',
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        evaluation_plan: 'pages/evaluation_plan.html',
        evaluation_report: 'pages/evaluation_report.html',
        evaluation_procedure: 'pages/evaluation_procedure.html'
      }
    }
  }
});
