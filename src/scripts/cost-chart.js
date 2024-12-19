import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('costPieChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        'Equipment Procurement', 
        'Travel Expenses', 
        'Testing & Evaluation', 
        'Data Analysis', 
        'Reporting & Documentation'
      ],
      datasets: [{
        label: 'Estimated Project Costs (MYR)',
        data: [15000, 5000, 10000, 7500, 2500],
        backgroundColor: [
          '#3B82F6',  // Blue for Equipment
          '#8B5CF6',  // Purple for Travel
          '#10B981',  // Green for Testing
          '#EF4444',  // Red for Analysis
          '#F59E0B'   // Amber for Reporting
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += 'MYR ' + context.parsed.toLocaleString();
              return label;
            }
          }
        }
      }
    }
  });
});
