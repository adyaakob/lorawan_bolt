import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/lorawan_bolt/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        evaluation_plan: path.resolve(__dirname, 'pages/evaluation_plan.html'),
        evaluation_report: path.resolve(__dirname, 'pages/evaluation_report.html'),
        evaluation_procedure: path.resolve(__dirname, 'pages/evaluation_procedure.html'),
        pre_site_visit_checklist: path.resolve(__dirname, 'pages/pre_site_visit_checklist.html'),
        project_implementation_timeline: path.resolve(__dirname, 'pages/project_implementation_timeline.html'),
        project_cost_estimation: path.resolve(__dirname, 'pages/project_cost_estimation.html'),
        map: path.resolve(__dirname, 'pages/map.html'),
        test_setup: path.resolve(__dirname, 'pages/test_setup.html'),
        team_members: path.resolve(__dirname, 'pages/team_members.html')
      }
    }
  }
});
