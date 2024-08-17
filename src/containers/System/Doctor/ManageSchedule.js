import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: null,
            currentDate: new Date(), // Thiết lập ngày hiện tại khi khởi tạo
            rangeTime: []
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();

        // Đảm bảo ngày hiện tại được thiết lập khi trang được load
        this.setState({
            currentDate: new Date()
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false })); // Khởi tạo isSelected với giá trị boolean false
            }
            this.setState({
                rangeTime: data
            });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleOnChangeDatePicker = (date) => {
        if (date && date.length > 0) {
            this.setState({
                currentDate: date[0]
            });
        }
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });

            this.setState({
                rangeTime: rangeTime
            });
        }
    }

    handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    // Kiểm tra nếu ngày không hợp lệ
    if (!currentDate || isNaN(new Date(currentDate).getTime())) {
        toast.error("INVALID DATE!");
        return;
    }

    // Kiểm tra nếu bác sĩ không được chọn
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
        toast.error("YOU NEED TO SELECT A DOCTOR");
        return;
    }

    // Kiểm tra xem có bất kỳ thời gian nào được chọn hay không
    let selectedTimeSlots = rangeTime.filter(item => item.isSelected);
    if (selectedTimeSlots.length === 0) {
        toast.error("YOU NEED TO SELECT AT LEAST ONE TIME SLOT!");
        return;
    }

    // Định dạng ngày gửi đến backend dưới dạng chuỗi (ví dụ: 'YYYY-MM-DD')
    let formatDate = moment(currentDate).format('YYYY-MM-DD');

    selectedTimeSlots.forEach(schedule => {
        let object = {};
        object.doctorId = selectedDoctor.value;
        object.date = formatDate;  // Truyền date dưới dạng chuỗi
        object.timeType = schedule.keyMap;
        result.push(object);
    });

    let res = await saveBulkScheduleDoctor({
        arrSchedule: result,
        doctorId: selectedDoctor.value,
        formatDate: formatDate  // Truyền date dưới dạng chuỗi
    });
    

    console.log('check res:', res);
    console.log('check result:', result);

    if (res && res.errCode === 0) {
        toast.success("Schedule saved successfully!");
    } else {
        toast.error("Failed to save schedule. " + res.errMessage);
    }
};


    render() {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate()-1))
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='schedule-form'>
                    <div className='form-group'>
                        <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            className='doctor-select'
                        />
                    </div>
                    <div className='form-group'>
                        <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control date-picker'
                            selected={currentDate} // Sử dụng currentDate từ state
                            minDate={yesterday}
                        />
                    </div>
                    <div className='pick-hour-container'>
                        {rangeTime && rangeTime.length > 0 &&
                            rangeTime.map((item, index) => {
                                return (
                                    <button
                                        className={item.isSelected ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                        key={index}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </button>
                                )
                            })}
                    </div>
                    <div className='form-group'>
                        <button
                            className='btn btn-save-schedule'
                            onClick={this.handleSaveSchedule}
                        >
                            <FormattedMessage id='manage-schedule.save' />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
