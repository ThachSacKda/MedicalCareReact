import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTION } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            // Lưu thông tin bác sĩ
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.getAllRequiredDoctorInfor();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};

                // Xử lý cho người dùng
                if (type === 'USERS') {
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                }

                // Xử lý cho giá
                if (type === 'PRICE') {
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                }

                // Xử lý cho phương thức thanh toán hoặc tỉnh thành
                if (type === 'PAYMENT' || type === 'PROVINCE') {
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                }

                // Kiểm tra nếu object có giá trị thì đẩy vào result
                if (object.label && object.value) {
                    result.push(object);
                }
            });
        }

        return result;
    }

    componentDidUpdate(prevProps) {
        // Kiểm tra và cập nhật danh sách bác sĩ
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        // Kiểm tra và cập nhật ngôn ngữ khi thay đổi
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        // Cập nhật thông tin bắt buộc cho bác sĩ
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData, selectedPrice, selectedPayment, selectedProvince, nameClinic, addressClinic, note } = this.state;

        // Thêm điều kiện kiểm tra trước khi truy cập `.value`
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption ? this.state.selectedOption.value : '',  // Đảm bảo `selectedOption` có giá trị
            action: hasOldData ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

            selectedPrice: selectedPrice ? selectedPrice.value : '',  // Kiểm tra sự tồn tại của `selectedPrice`
            selectedPayment: selectedPayment ? selectedPayment.value : '',  // Kiểm tra sự tồn tại của `selectedPayment`
            selectProvince: selectedProvince ? selectedProvince.value : '',  // Kiểm tra sự tồn tại của `selectedProvince`
            nameClinic: nameClinic || '',  // Đảm bảo rằng `nameClinic` không bị undefined
            addressClinic: addressClinic || '',  // Đảm bảo rằng `addressClinic` không bị undefined
            note: note || ''  // Đảm bảo rằng `note` không bị undefined
        });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince } = this.state;
        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', selectedPrice='',
                selectedPayment='', selectProvince='';

            if (res.data.Doctor_infor) {
                addressClinic = res.data.Doctor_infor.addressClinic;
                nameClinic = res.data.Doctor_infor.nameClinic;
                note = res.data.Doctor_infor.note;
                paymentId = res.data.Doctor_infor.paymentId;
                priceId = res.data.Doctor_infor.priceId;
                provinceId = res.data.Doctor_infor.provinceId;

                selectedPrice = listPrice.find(item => item.value === priceId);
                selectedPayment = listPayment.find(item => item.value === paymentId);
                selectProvince = listProvince.find(item => item.value === provinceId);
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectProvince,
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: ''
            });
        }
    }

    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        this.setState({
            [name]: selectedOption
        });
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy });
    }

    render() {
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id='manage-doctor.create-doctor-infor' />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id='manage-doctor.choose-doctor' /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={'Choose a doctor'}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='manage-doctor.introductory-information' /></label>
                        <textarea className='form-control' rows='4'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        />
                    </div>

                    <div className='more-infor-extra row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='manage-doctor.price' /></label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={(selectedOption) => this.handleChangeSelectDoctorInfor(selectedOption, 'selectedPrice')}
                                options={this.state.listPrice}
                                placeholder={'Choose Price'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='manage-doctor.payment' /></label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={(selectedOption) => this.handleChangeSelectDoctorInfor(selectedOption, 'selectedPayment')}
                                options={this.state.listPayment}
                                placeholder={'Choose payment method'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='manage-doctor.province' /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={(selectedOption) => this.handleChangeSelectDoctorInfor(selectedOption, 'selectedProvince')}
                                options={this.state.listProvince}
                                placeholder={'Choose province'}
                            />
                        </div>

                        <div className="col-4 form-group">
                            <label>
                                <FormattedMessage id="manage-doctor.nameClinic" />
                            </label>
                            <input
                                className="form-control"
                                onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                                value={this.state.nameClinic}
                            />
                        </div>

                        <div className="col-4 form-group">
                            <label>
                                <FormattedMessage id="manage-doctor.addressClinic" />
                            </label>
                            <input
                                className="form-control"
                                onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                                value={this.state.addressClinic}
                            />
                        </div>

                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='manage-doctor.note' /></label>
                            <input
                                className='form-control'
                                value={this.state.note}
                                onChange={(event) => this.setState({ note: event.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    onClick={this.handleSaveContentMarkdown}
                    className='save-content-doctor'>
                    <FormattedMessage id='manage-doctor.save' />
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
