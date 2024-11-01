import React, { useEffect, useState } from 'react';
import { getAppointmentStatistics } from '../../../services/userService';
import DashboardChart from './DashboardChart';
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

    const history = useHistory();

    useEffect(() => {
        // Check if the user is an admin
        if (userInfor?.roleId !== 'R1') {
            // Redirect to login or another page if not an admin
            history.push('/login');
            return;
        }
        fetchStatistics();
    }, [userInfor]);

    const fetchStatistics = async () => {
        try {
            let response = await getAppointmentStatistics();
            console.log("Full API Response:", response);

            // Check if the data structure matches our expectations
            if (response && response.errCode === 0) {
                let data = response.data;
                console.log("Setting statistics with data:", data);
                
                // Update state with the fetched data
                setStatistics({
                    totalAppointments: data.totalAppointments || 0,
                    todayAppointments: data.todayAppointments || 0,
                    unconfirmedAppointments: data.unconfirmedAppointments || 0,
                    confirmedAppointments: data.confirmedAppointments || 0,
                });
            } else {
                console.error("Unexpected response data structure:", response.data);
            }
        } catch (error) {
            console.error("Error fetching appointment statistics:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="dashboard-container">
                <h2>DASHBOARD</h2>
                <div className="statistics-container">
                    <div className="stat-item">
                        <p>Tổng số lịch hẹn</p>
                        <p className="stat-number">{statistics.totalAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Lịch hẹn hôm nay</p>
                        <p className="stat-number">{statistics.todayAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Lịch hẹn chưa xác nhận (S1)</p>
                        <p className="stat-number">{statistics.unconfirmedAppointments}</p>
                    </div>
                    <div className="stat-item">
                        <p>Lịch hẹn đã xác nhận (S2)</p>
                        <p className="stat-number">{statistics.confirmedAppointments}</p>
                    </div>
                </div>
                <div className="chart-container">
                    <DashboardChart 
                        unconfirmedAppointments={statistics.unconfirmedAppointments} 
                        confirmedAppointments={statistics.confirmedAppointments} 
                    />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userInfor: state.user.userInfor, // Access user info from Redux state
});

export default connect(mapStateToProps)(Dashboard);
