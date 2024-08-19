import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false
        }
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor  // Đảo ngược giá trị của isShowDetailInfor
        });
    }

    render() {
        let { isShowDetailInfor } = this.state;
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>Địa chỉ khám</div>
                    <div className='name-clinic'>Phòng Khám Chuyên Khoa Da Liễu</div>
                    <div className='detail-address'>Cần Thơ</div>
                </div>

                <div className='content-down'>
                    {!isShowDetailInfor && (
                        <div className='brief-info'>
                            <span className='price-tag'>GIÁ KHÁM: <strong>250.000VND</strong></span>
                            <span className='toggle-details' onClick={this.showHideDetailInfor}>
                                Xem chi tiết
                            </span>
                        </div>
                    )}

                    {isShowDetailInfor && (
                        <div className='detailed-info'>
                            <div className='title-price'>GIÁ KHÁM:</div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>Giá Khám</span>
                                    <span className='right'>250.000VND</span>
                                </div>
                                <div className='note'>
                                    GÁI XINH THÌ GIẢM GIÁ
                                </div>
                            </div>
                            <div className='payment'>
                                Có thể thanh toán bằng tiền mặt hoặc quẹt thẻ
                            </div>
                            <div className='hide-price'>
                                <span onClick={this.showHideDetailInfor}>Ẩn bảng giá</span>
                            </div>
                        </div>
                    )}
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
