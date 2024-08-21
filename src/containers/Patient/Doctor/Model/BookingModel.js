import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import './BookingModel.scss';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';

class BookingModel extends Component {
    render() {
        const { isOpenModel, toggle, dataTime } = this.props;
        let doctorId = '';
        if(dataTime && !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId
        }
        console.log('data:',this.props)
        return (
            <Modal
                isOpen={isOpenModel}
                toggle={toggle} // Use the toggle prop to close the modal
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
                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-infot'>
                            <ProfileDoctor
                                doctorId={doctorId}
                            />

                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Họ tên</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Phone</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Email</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Địa chỉ</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-12 form-group'>
                                <label>Lí do khám</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Đặt cho ai</label>
                                <input className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Giớ tính</label>
                                <input className='form-control' />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button onClick={toggle}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default BookingModel;
