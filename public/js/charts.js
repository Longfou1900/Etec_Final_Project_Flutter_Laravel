//resoucres/js/charts.js
let charts = {};

// Clean up charts when leaving a page
// function destroyCharts() {
//     Object.values(charts).forEach(c => { 
//         try { c.destroy() } catch(e) {} 
//     });
//     charts = {};
// }

// Analytics Charts Generation
function renderAnalyticsCharts() {
    setTimeout(() => {
        const rCtx = document.getElementById('revenueChart');
        if (rCtx) {
            charts.revenue = new Chart(rCtx, {
                type: 'line',
                data: {
                    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [18000, 24000, 19000, 32000, 28000, 40000],
                        borderColor: '#7c6af7',
                        backgroundColor: 'rgba(124,106,247,0.08)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        // You can add your Category and Demo charts here following the same pattern
    }, 100);
}

