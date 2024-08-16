import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader'
import './DoctorSchedule.scss'
import moment from 'moment';
import localizarion from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
        }
    }

    async componentDidMount() {
        let { language } = this.props;

        // console.log('moment vi:',moment(new Date()).format('dddd - DD/MM'));
        // console.log('moment en:',moment(new Date()).local('en').format('ddd - DD/MM'));
        this.setArrDays(language);

    }

    setArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};

            // Định dạng label và value đều thành 'YYYY-MM-DD'
            let formattedDate = moment(new Date()).add(i, 'days').format('YYYY-MM-DD');

            object.label = formattedDate;  // Gán label với định dạng 'YYYY-MM-DD'
            object.value = formattedDate;  // Gán value cũng với định dạng 'YYYY-MM-DD'

            allDays.push(object);
        }

        this.setState({
            allDays: allDays,
        });
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setArrDays(this.props.language);
        }
    }
    handleOnchangeSelect = async (event) => {
        try {
            if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
                let doctorId = this.props.doctorIdFromParent;
                let date = event.target.value;

                console.log('Doctor ID from Redux:', doctorId);
                console.log('Selected date:', date);

                // Gọi API để lấy dữ liệu lịch trình của bác sĩ theo ngày
                let res = await getScheduleDoctorByDate(doctorId, date);  // Truyền cả doctorId và date

                console.log('API response:', res); // Kiểm tra phản hồi từ API

                if (res && res.errCode === 0) {
                    console.log('All Available Time:', res.data);  // Log kiểm tra dữ liệu trả về từ API
                    this.setState({
                        allAvailableTime: res.data ? res.data : []  // Cập nhật state nếu có dữ liệu
                    });
                } else {
                    console.error('API did not return expected data');
                    this.setState({
                        allAvailableTime: []  // Nếu không có dữ liệu thì reset lại
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            this.setState({
                allAvailableTime: []  // Đặt lại mảng nếu có lỗi
            });
        }
    };





    render() {
        let { allDays, allAvailableTime } = this.state;
        let {language} = this.props;
        console.log('allAvailableTime:', allAvailableTime); // Kiểm tra mảng dữ liệu

        return (
            <div className='doctor-schedule-container'>
                <div className='all-schedule'>
                    <select onChange={(event) => this.handleOnchangeSelect(event)}>
                        {allDays && allDays.length > 0 &&
                            allDays.map((item, index) => {
                                return (
                                    <option
                                        value={item.value}
                                        key={index}>{item.label}</option>
                                )
                            })}
                    </select>
                </div>
                <div className='all-availabe-time'>
                    <div className='text-calendar'>
                        <span> <i className="fa-regular fa-calendar-days"></i> Lịch Khám</span>
                    </div>
                    <div className='time-content'>
    {allAvailableTime && allAvailableTime.length > 0 ? (
        allAvailableTime.map((item, index) => {
            let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
            
            return (
                <button
                    key={index}
                    className="time-button"  // Thêm class để dễ dàng tùy chỉnh CSS
                >
                    {timeDisplay}  {/* Hiển thị khung giờ */}
                </button>
            );
        })
    ) : (
        <div>No available times</div>
    )}
</div>


                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
