import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';  // Thêm withRouter
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { getAllPatientsForDoctor } from '../../../services/userService';
import { path } from "../../../utils"; // Đảm bảo import path để truy cập đường dẫn

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: []
        }
    }

    async componentDidMount() {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = moment(currentDate).toISOString();
        this.getDataPatient(user, formattedDate);
    }

    getDataPatient = async (user, formattedDate) => {
        let res = await getAllPatientsForDoctor({
            doctorId: user.id,
            date: formattedDate
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
                currentDate: date[0]
            }, () => {
                let { user } = this.props;
                let { currentDate } = this.state;
                let formattedDate = moment(currentDate).toISOString();
                this.getDataPatient(user, formattedDate);
            });
        }
    }

    handleViewDetail = (patient) => {
        console.log("Patient data:", patient);  // Kiểm tra dữ liệu bệnh nhân
        const patientId = patient.patientId;  // Lấy ID bệnh nhân từ patient.patientId
    
        if (patientId) {
            // Lưu dữ liệu bệnh nhân vào localStorage
            localStorage.setItem('selectedPatient', JSON.stringify(patient));
    
            // Chuyển hướng tới trang hiển thị thông tin bệnh nhân
            this.props.history.push(`${path.MEDICAL_RECORD}/${patientId}`);
        } else {
            console.log('Patient ID is undefined.');
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
                                    dataPatient.map((item, index) => {
                                        console.log("Item patientData:", item.patientData);  // In kiểm tra cấu trúc của item.patientData
                                        return (
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
                                        );
                                    })
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

// Thêm withRouter để có thể sử dụng đối tượng history
const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfor,
    };
};

// Bọc component với withRouter để có thể sử dụng history.push()
export default withRouter(connect(mapStateToProps)(ManagePatient));
