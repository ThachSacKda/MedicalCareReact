import React from 'react';
import { Bar } from 'react-chartjs-2';

const DashboardWeeklyChart = ({ weeklyStats }) => {
    const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const unconfirmedData = labels.map(day => weeklyStats[day]?.S1 || 0);
    const confirmedData = labels.map(day => weeklyStats[day]?.S2 || 0);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Appointment schedule not confirmed',
                data: unconfirmedData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Appointment confirmed',
                data: confirmedData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { position: 'top' },
        },
    };

    return (
        <div style={{ width: '600px', margin: '0 auto' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default DashboardWeeklyChart;
