import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss';
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
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.setArrDays(language);

        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            });
        }


        this.setState({ allDays });
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
            this.setState({
                allAvailableTime: res.data ? res.data : []
            });
        }
    }

    handleOnchangeSelect = async (event) => {
        try {
            if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
                let doctorId = this.props.doctorIdFromParent;
                let date = event.target.value;
                let res = await getScheduleDoctorByDate(doctorId, date);
                this.setState({
                    allAvailableTime: res && res.errCode === 0 ? res.data : []
                });
            }
        } catch (error) {
            this.setState({
                allAvailableTime: []
            });
        }
    };

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModelBooking: true,
            dataScheduleTimeModal: time
        });
    }

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
                            {allAvailableTime && allAvailableTime.length > 0 &&
                                allAvailableTime.map((item, index) => {
                                    let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                    return (
                                        <button key={index} className="time-button" onClick={() => this.handleClickScheduleTime(item)}>
                                            <span>{timeDisplay}</span>
                                            <div className="pulse"></div>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                <BookingModel
                    isOpenModel={isOpenModelBooking}
                    toggle={this.toggleBookingModal}
                    dataTime={dataScheduleTimeModal}
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
