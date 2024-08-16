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
        }
    }

    async componentDidMount() {
        let {language} = this.props;

        // console.log('moment vi:',moment(new Date()).format('dddd - DD/MM'));
        // console.log('moment en:',moment(new Date()).local('en').format('ddd - DD/MM'));
        this.setArrDays(language);
        
    }

    setArrDays = (language) => {
        let allDays = []
        for (let i=0; i<7; i++){
            let object = {};

            if(language === LANGUAGES.VI){
                object.label = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
            }else{
                object.label = moment(new Date()).add(i, 'days').format('ddd - DD/MM');

            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            
            allDays.push(object);
        }

        this.setState({
            allDays: allDays,
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language){
           this.setArrDays(this.props.language);
        }
    }
    handleOnchangeSelect = async (event) => {
        try {
            if(this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1){
                console.log('Doctor ID:', this.props.doctorIdFromParent); // Kiểm tra ID bác sĩ
                let doctorId = this.props.doctorIdFromParent;
                let date = event.target.value;
                console.log('Selected date:', date); // Kiểm tra ngày được chọn
                let res = await getScheduleDoctorByDate(doctorId, date);
                console.log('res:', res); // In kết quả API
            }
        } catch (error) {
            console.error('Error fetching schedule:', error); // In lỗi nếu có
        }
    }
    
    render() {
        let {allDays} = this.state;
        return (
            <div className='doctor-schedule-container'>
                <div className='all-schedule'>
                    <select onChange={(event)=> this.handleOnchangeSelect(event)}>
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
