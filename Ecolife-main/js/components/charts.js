/* =========================================================
   EcoLife — Chart.js Wrapper Components
   ========================================================= */

/** Create a weekly activity bar chart */
export function createWeeklyChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return null;
    
    const ctx = canvas.getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Points Earned',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 255, 136, 0.3)',
                borderColor: '#00FF88',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(0, 255, 136, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1E1E1E',
                    titleColor: '#F0F0F0',
                    bodyColor: '#8A8A8A',
                    borderColor: '#2A2A2A',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#555555', font: { size: 11, family: 'Inter' } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#555555', font: { size: 11, family: 'Inter' } }
                }
            }
        }
    });
}

/** Create a category breakdown doughnut chart */
export function createBreakdownChart(canvasId, data = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return null;
    
    const ctx = canvas.getContext('2d');
    const labels = ['Transport', 'Waste', 'Energy', 'Food', 'Water'];
    const colors = ['#4DA6FF', '#00FF88', '#FFB800', '#FF6B9D', '#00D4FF'];
    const values = [
        data.transport || 0, data.waste || 0, data.energy || 0,
        data.food || 0, data.water || 0
    ];
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values.every(v => v === 0) ? [1, 1, 1, 1, 1] : values,
                backgroundColor: values.every(v => v === 0) ? colors.map(c => c + '33') : colors.map(c => c + 'AA'),
                borderColor: '#141414',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1E1E1E',
                    titleColor: '#F0F0F0',
                    bodyColor: '#8A8A8A',
                    borderColor: '#2A2A2A',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw.toFixed(1)} kg CO₂`
                    }
                }
            }
        }
    });
}

/** Update chart data */
export function updateChartData(chart, newData) {
    if (!chart) return;
    chart.data.datasets[0].data = newData;
    chart.update('active');
}
