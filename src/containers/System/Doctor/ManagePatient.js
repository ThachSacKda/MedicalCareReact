import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { getAllPatientsForDoctor } from '../../../services/userService';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),  // Lưu giá trị thời gian đầy đủ
            dataPatient: []
        }
    }

    async componentDidMount() {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = moment(currentDate).toISOString(); // Sử dụng định dạng ISO 8601
        this.getDataPatient(user, formattedDate); // Gửi request với định dạng ISO đầy đủ
    }

    getDataPatient = async (user, formattedDate) => {
        let res = await getAllPatientsForDoctor({
            doctorId: user.id,
            date: formattedDate  // Đảm bảo gửi định dạng ISO có cả thời gian
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            });
        } else {
            console.log('No patients found or error occurred:', res);
        }
    }

    handleOnChangeDatePicker = (date) => {
        if (date) {
            this.setState({
                currentDate: date[0] // Cập nhật currentDate với ngày được chọn
            }, () => {
                let { user } = this.props;
                let { currentDate } = this.state;
                let formattedDate = moment(currentDate).toISOString();  // Định dạng ISO đầy đủ
                this.getDataPatient(user, formattedDate);  // Gọi API với định dạng ISO đầy đủ
            });
        }
    }

    render() {
        const { currentDate, dataPatient } = this.state;

        return (
            <div className='manage-patient-container'>
                <div className='m-p-title'>
                    Quản lí bệnh nhân khám bệnh
                </div>
                <div className='manage-patient-body row'>
                    <div className='col-4 form-group'>
                        <label>Chọn Ngày Khám</label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control date-picker'
                            value={moment(currentDate).format('DD/MM/YYYY')}
                            selected={currentDate}
                        />
                    </div>
                    <div className='col-12 table-manage-patient'>
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Thời Gian</th>
                                    <th>Họ Tên</th>
                                    <th>Địa Chỉ</th>
                                    <th>Giới Tính</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPatient && dataPatient.length > 0 ? (
                                    dataPatient.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.timeTypeDataPatient ? item.timeTypeDataPatient.valueVi : ''}</td>
                                            <td>{item.patientData ? item.patientData.firstName : ''}</td>
                                            <td>{item.patientData ? item.patientData.address : ''}</td>
                                            <td>{item.patientData && item.patientData.genderData ? item.patientData.genderData.valueVi : ''}</td>
                                            <td>
                                                <button onClick={() => this.handleViewDetail(item)}>View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No patients found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfor,
    };
};

export default connect(mapStateToProps)(ManagePatient);
