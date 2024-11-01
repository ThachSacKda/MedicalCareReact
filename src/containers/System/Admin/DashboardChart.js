// src/containers/System/Admin/DashboardChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';

const DashboardChart = ({ unconfirmedAppointments, confirmedAppointments }) => {
    const data = {
        labels: ['Lịch hẹn chưa xác nhận (S1)', 'Lịch hẹn đã xác nhận (S2)'],
        datasets: [
            {
                label: 'Số lượng lịch hẹn',
                data: [unconfirmedAppointments || 0, confirmedAppointments || 0],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    return (
        <div style={{ width: '400px', margin: '0 auto' }}>
            <Pie data={data} />
        </div>
    );
};

export default DashboardChart;
