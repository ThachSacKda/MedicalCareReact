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
            inputData.forEach(item => {
                let object = {};
                let labelVi = type === 'USERS' ? `${item.lastName} ${item.firstName}` : item.valueVi;
                let labelEn = type === 'USERS' ? `${item.firstName} ${item.lastName}` : item.valueEn;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice);
            let dataSelectPayment = this.buildDataInputSelect(resPayment);
            let dataSelectProvince = this.buildDataInputSelect(resProvince);

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
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,
        });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
            });
        }
    }

    handleOnChangeDesc = (event) => {
        this.setState({ description: event.target.value });
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
                            onChange={this.handleOnChangeDesc}
                            value={this.state.description}
                        />
                    </div>

                    <div className='more-infor-extra row'>
                        <div className='col-4 form-group'>
                            <label>Chọn giá</label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={(selectedOption) => this.setState({ selectedPrice: selectedOption })}
                                options={this.state.listPrice}
                                placeholder={'Choose Price'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Chọn phương thức thanh toán</label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={(selectedOption) => this.setState({ selectedPayment: selectedOption })}
                                options={this.state.listPayment}
                                placeholder={'Choose payment method'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Chọn tỉnh thành</label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={(selectedOption) => this.setState({ selectedProvince: selectedOption })}
                                options={this.state.listProvince}
                                placeholder={'Choose province'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Tên phòng khám</label>
                            <input
                                className='form-control'
                                value={this.state.nameClinic}
                                onChange={(event) => this.setState({ nameClinic: event.target.value })}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Địa chỉ phòng khám</label>
                            <input
                                className='form-control'
                                value={this.state.addressClinic}
                                onChange={(event) => this.setState({ addressClinic: event.target.value })}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Note</label>
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
