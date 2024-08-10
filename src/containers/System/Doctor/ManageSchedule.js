import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';

class ManageSchedule extends Component {
    constructor(props){
        super(props);
        this.state ={
            listDoctors: [],
            selectedDoctor: null,
            currentDate: new Date(),
            rangeTime: []
        }
    }

    componentDidMount(){
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }

        if(prevProps.allScheduleTime !== this.props.allScheduleTime){
            let data = this.props.allScheduleTime.map(item => {
                return { ...item, isSelected: false };
            });
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

    handleChangeSelect = async (selectedOption) => {
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
        this.setState({
            currentDate: date[0]
        });
    }

    handleClickBtnTime = (time) => {
        let rangeTime = this.state.rangeTime;
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

    render() {
        let { rangeTime, selectedDoctor } = this.state;
        let { language } = this.props;
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title'/>
                </div>
                <div className='schedule-form'>
                    <div className='form-group'>
                        <label><FormattedMessage id='manage-schedule.choose-doctor'/></label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            className='doctor-select'
                        />
                    </div>
                    <div className='form-group'>
                        <label><FormattedMessage id='manage-schedule.choose-date'/></label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control date-picker'
                            value={this.state.currentDate}
                            minDate={new Date()}
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
                        <button className='btn btn-save-schedule'>
                            <FormattedMessage id='manage-schedule.save'/>
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
