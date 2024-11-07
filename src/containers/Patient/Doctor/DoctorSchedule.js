import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModel from './Model/BookingModel';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModelBooking: false,
            dataScheduleTimeModal: {},
        };
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.setArrDays(language);

        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            let timeSlots = res.data ? res.data : [];
            
            // Kiểm tra và áp dụng trạng thái `isBooked` từ `localStorage`
            const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || [];
            timeSlots = timeSlots.map(slot => {
                const bookedSlot = bookedSlots.find(b => b.id === slot.id);
                return bookedSlot ? { ...slot, isBooked: bookedSlot.isBooked } : slot;
            });

            this.setState({
                allAvailableTime: timeSlots,
                allDays
            });
        } else {
            this.setState({ allDays });
        }
    }

    setArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            let formattedDate = moment(new Date()).add(i, 'days').format('YYYY-MM-DD');
            object.label = formattedDate;
            object.value = formattedDate;
            allDays.push(object);
        }
        return allDays;
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.setArrDays(this.props.language);
            this.setState({ allDays });
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.setArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            let timeSlots = res.data ? res.data : [];

            const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || [];
            timeSlots = timeSlots.map(slot => {
                const bookedSlot = bookedSlots.find(b => b.id === slot.id);
                return bookedSlot ? { ...slot, isBooked: bookedSlot.isBooked } : slot;
            });

            this.setState({
                allAvailableTime: timeSlots,
                allDays
            });
        }
    }

    handleOnchangeSelect = async (event) => {
        try {
            if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
                let doctorId = this.props.doctorIdFromParent;
                let date = event.target.value;
                let res = await getScheduleDoctorByDate(doctorId, date);
                let timeSlots = res && res.errCode === 0 ? res.data : [];

                const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || [];
                timeSlots = timeSlots.map(slot => {
                    const bookedSlot = bookedSlots.find(b => b.id === slot.id);
                    return bookedSlot ? { ...slot, isBooked: bookedSlot.isBooked } : slot;
                });

                this.setState({
                    allAvailableTime: timeSlots
                });
            }
        } catch (error) {
            this.setState({
                allAvailableTime: []
            });
        }
    };

    handleClickScheduleTime = (time) => {
        if (!time.isBooked) { // Chỉ mở modal nếu slot chưa được đặt
            this.setState({
                isOpenModelBooking: true,
                dataScheduleTimeModal: time
            });
        }
    };

    onBookingSuccess = (timeSlotId) => {
        this.setState(prevState => {
            const updatedTimeSlots = prevState.allAvailableTime.map(slot =>
                slot.id === timeSlotId ? { ...slot, isBooked: true } : slot
            );
            
            // Lưu trạng thái đã đặt vào localStorage
            localStorage.setItem('bookedSlots', JSON.stringify(updatedTimeSlots));

            return {
                allAvailableTime: updatedTimeSlots,
                isOpenModelBooking: false
            };
        });
    };

    toggleBookingModal = () => {
        this.setState({
            isOpenModelBooking: !this.state.isOpenModelBooking
        });
    }

    render() {
        let { allDays, allAvailableTime, isOpenModelBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={this.handleOnchangeSelect}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={index}>{item.label}</option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className="fas fa-calendar-alt"></i>
                            <span>
                                <FormattedMessage id="patient.detail-doctor.schedule" />
                            </span>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.map((item, index) => (
                                <button
                                    key={index}
                                    className="time-button"
                                    disabled={item.isBooked} // Vô hiệu hóa nếu đã đặt
                                    onClick={() => this.handleClickScheduleTime(item)}
                                >
                                    <span>{language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}</span>
                                    {!item.isBooked && <div className="pulse"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <BookingModel
                    isOpenModel={isOpenModelBooking}
                    toggle={this.toggleBookingModal}
                    dataTime={dataScheduleTimeModal}
                    onBookingSuccess={this.onBookingSuccess} // Truyền callback để cập nhật trạng thái sau khi đặt
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DoctorSchedule);
