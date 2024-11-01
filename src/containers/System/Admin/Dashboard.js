import React, { useEffect, useState } from 'react';
import { getAppointmentStatistics, getWeeklyBookingStatistics } from '../../../services/userService';
import DashboardChart from './DashboardChart';
import DashboardWeeklyChart from './DashboardWeeklyChart'; // Thêm biểu đồ tuần mới
import './Dashboard.scss';
import Header from '../../Header/Header';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Dashboard = ({ userInfor }) => {
    const [statistics, setStatistics] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
        unconfirmedAppointments: 0,
        confirmedAppointments: 0,
    });
    const [weeklyStats, setWeeklyStats] = useState({
        Monday: { S1: 0, S2: 0 },
        Tuesday: { S1: 0, S2: 0 },
        Wednesday: { S1: 0, S2: 0 },
        Thursday: { S1: 0, S2: 0 },
        Friday: { S1: 0, S2: 0 },
        Saturday: { S1: 0, S2: 0 },
        Sunday: { S1: 0, S2: 0 },
    });

    const history = useHistory();

    useEffect(() => {
        if (userInfor?.roleId !== 'R1') {
            history.push('/login');
            return;
        }
        fetchStatistics();
        fetchWeeklyStatistics();
    }, [userInfor]);

    const fetchStatistics = async () => {
        try {
            let response = await getAppointmentStatistics();
            if (response && response.errCode === 0) {
                let data = response.data;
                setStatistics({
                    totalAppointments: data.totalAppointments || 0,
                    todayAppointments: data.todayAppointments || 0,
                    unconfirmedAppointments: data.unconfirmedAppointments || 0,
                    confirmedAppointments: data.confirmedAppointments || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching appointment statistics:", error);
        }
    };

    const fetchWeeklyStatistics = async () => {
        try {
            let response = await getWeeklyBookingStatistics();
            console.log("Full API Response:", response); // In toàn bộ response để kiểm tra cấu trúc
            if (response && response.errCode === 0) {          
                setWeeklyStats(response.data); 
            } else {
                console.warn("Invalid response or errCode is not 0:", response);
            }
        } catch (error) {
            console.error("Error fetching weekly booking statistics:", error);
        }
    };
    

    return (
        <div>
            <Header />
            <div className="dashboard-container">
                <h2>DASHBOARD</h2>
                <div className="statistics-container">
                    <div className="stat-item">
                        <p>Total number of appointments</p>
                        <p className="stat-number">{statistics.totalAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Appointment schedule today</p>
                        <p className="stat-number">{statistics.todayAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Appointment schedule not confirmed</p>
                        <p className="stat-number">{statistics.unconfirmedAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Appointment confirmed</p>
                        <p className="stat-number">{statistics.confirmedAppointments}</p>
                    </div>
                </div>
                <div className="chart-container">
                    <DashboardChart 
                        unconfirmedAppointments={statistics.unconfirmedAppointments} 
                        confirmedAppointments={statistics.confirmedAppointments} 
                    />
                </div>
                <div className="weekly-chart-container">
                    <h3>Appointment schedule by day of the week</h3>
                    <DashboardWeeklyChart weeklyStats={weeklyStats} />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userInfor: state.user.userInfor,
});

export default connect(mapStateToProps)(Dashboard);
