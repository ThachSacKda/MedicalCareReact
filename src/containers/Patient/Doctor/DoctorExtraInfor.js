import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import { LANGUAGES } from '../../../utils';
import { getExtraInforDoctorById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
            allAvailableTime: [], // Initialize to store available time slots
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                    allAvailableTime: res.data.availableTimeSlots || [] // Assuming API returns available time slots
                });
            }
        }
    }

    handleClickScheduleTime = (timeSlot) => {
        if (timeSlot.isBooked) {
            // Nếu thời gian đã được đặt, không làm gì cả
            return;
        }

        // Nếu thời gian chưa được đặt, mở BookingModel và đánh dấu `isBooked`
        this.setState({
            selectedTimeSlot: timeSlot, // lưu timeSlot để truyền cho BookingModel
            isBookingModelOpen: true
        });
    }

    toggleBookingModel = () => {
        this.setState({ isBookingModelOpen: !this.state.isBookingModelOpen });
    }

    onBookingSuccess = (timeSlotId) => {
        // Cập nhật trạng thái isBooked của timeSlot đã chọn
        this.setState((prevState) => ({
            allAvailableTime: prevState.allAvailableTime.map((slot) =>
                slot.id === timeSlotId ? { ...slot, isBooked: true } : slot
            ),
            isBookingModelOpen: false
        }));
    }


    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor
        });
    }

    render() {
        let { isShowDetailInfor, extraInfor, allAvailableTime } = this.state;
        let { language } = this.props;

        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-price' />
                    </div>
                    <div className='name-clinic'>
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>

                <div className='content-down'>
                    {!isShowDetailInfor && (
                        <div className='brief-info'>
                            <span className='price-tag'>
                                <FormattedMessage id='patient.extra-price' />
                                <strong>
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                        <NumberFormat
                                            value={extraInfor.priceTypeData.valueVi}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' VND'}
                                        />
                                    }
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                        <NumberFormat
                                            value={extraInfor.priceTypeData.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                        />
                                    }
                                </strong>
                            </span>
                            <span className='toggle-details' onClick={this.showHideDetailInfor}>
                                <FormattedMessage id='patient.more-detail' />
                            </span>
                        </div>
                    )}

                    {isShowDetailInfor && (
                        <div className='detailed-info'>
                            <div className='title-price'><FormattedMessage id='patient.extra-price' /></div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'><FormattedMessage id='patient.extra-price' /></span>
                                    <span className='right'>
                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                            <NumberFormat
                                                value={extraInfor.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' VND'}
                                            />
                                        }
                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                value={extraInfor.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                            />
                                        }
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id='patient.payment-method' />
                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI
                                    ? extraInfor.paymentTypeData.valueVi : ''}

                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN
                                    ? extraInfor.paymentTypeData.valueEn : ''}
                            </div>
                            <div className='hide-price'>
                                <span onClick={this.showHideDetailInfor}><FormattedMessage id='patient.hide-price' /></span>
                            </div>
                        </div>
                    )}

                    {/* Render available time slots with disabled functionality */}
                    <div className="time-content">
                        {allAvailableTime && allAvailableTime.map((item, index) => (
                            <button
                                key={index}
                                className="time-button"
                                disabled={item.isBooked} // Vô hiệu hóa nếu thời gian đã được đặt
                                onClick={() => this.handleClickScheduleTime(item)}
                            >
                                <span>{language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}</span>
                                {!item.isBooked && <div className="pulse"></div>}
                            </button>
                        ))}
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

export default connect(mapStateToProps)(DoctorExtraInfor);
