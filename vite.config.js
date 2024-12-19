import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/lorawan_bolt/',
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        evaluation_plan: resolve(__dirname, 'pages/evaluation_plan.html'),
        team_members: resolve(__dirname, 'pages/team_members.html'),
        test_setup: resolve(__dirname, 'pages/test_setup.html'),
        project_cost_estimation: resolve(__dirname, 'pages/project_cost_estimation.html'),
        project_implementation_timeline: resolve(__dirname, 'pages/project_implementation_timeline.html'),
        evaluation_procedure: resolve(__dirname, 'pages/evaluation_procedure.html'),
        evaluation_report: resolve(__dirname, 'pages/evaluation_report.html'),
        pre_site_visit_checklist: resolve(__dirname, 'pages/pre_site_visit_checklist.html'),
        map: resolve(__dirname, 'pages/map.html')
      }
    },
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
