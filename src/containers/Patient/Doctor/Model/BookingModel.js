import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import './BookingModel.scss';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { connect } from 'react-redux';
import { postPatientBookingAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';

class BookingModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            genders: [],
            doctorId: '',
            timeType: ''
        };
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
                return null;
            });
        }
        return result;
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language || this.props.genders !== prevProps.genders) {
            let genderOptions = this.buildDataGender(this.props.genders);
            this.setState({
                genders: genderOptions
            });
        }

        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                });
            }
        }
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        });
    }

    handleOnchangSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime();

        let res = await postPatientBookingAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
        });

        if (res && res.errCode === 0) {
            toast.success('Booking Successfully!');
        } else {
            toast.error('Booking has an error.');
        }
    }

    render() {
        const { isOpenModel, toggle, dataTime } = this.props;

        return (
            <Modal
                isOpen={isOpenModel}
                toggle={toggle}
                className="booking-modal-container"
                size="lg"
                centered
                backdrop={true}
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>Thông tin đặt lịch khám bệnh</span>
                        <span className='right' onClick={toggle}>
                            <i className="fa-regular fa-circle-xmark"></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-info'>
                            <ProfileDoctor
                                doctorId={this.state.doctorId}
                                isshowDesciptionDoctor={false}
                                dataTime={dataTime}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Họ tên</label>
                                <input
                                    className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Phone</label>
                                <input
                                    className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Email</label>
                                <input
                                    className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Địa chỉ</label>
                                <input
                                    className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label>Lí do khám</label>
                                <input
                                    className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Ngày Sinh</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Giới tính</label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleOnchangSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className="confirm-btn" onClick={this.handleConfirmBooking}>Xác Nhận</button>
                        <button className="close-btn" onClick={toggle}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModel);
    