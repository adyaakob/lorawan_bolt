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
        evaluation_procedure: 'pages/evaluation_procedure.html',
        pre_site_visit_checklist: 'pages/pre_site_visit_checklist.html',
        project_implementation_timeline: 'pages/project_implementation_timeline.html',
        project_cost_estimation: 'pages/project_cost_estimation.html',
        map: 'pages/map.html',
        test_setup: 'pages/test_setup.html'
      }
    }
  }
});
