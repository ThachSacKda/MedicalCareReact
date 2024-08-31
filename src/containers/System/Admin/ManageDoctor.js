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
            contentMarkdown: '',   // State to hold Markdown content
            contentHTML: '',       // State to hold HTML content generated from Markdown
            selectedOption: '',    // State to hold the selected doctor from the dropdown
            description: '',       // State to hold the introductory information
            listDoctors: [],       // State to hold the list of doctors for the dropdown
            hasOldData: false,     // Boolean to check if we are editing an existing record

            // States to hold dropdown options and selections for price, payment, province, clinic, and specialty
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            // States to hold selected values
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            // Additional states to hold clinic information
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctor();   // Fetching all doctors
        this.props.getAllRequiredDoctorInfor();   // Fetching all required information (price, payment, province, etc.)
    }

    // Function to build dropdown options based on data and type (users, price, payment, etc.)
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};

                if (type === 'USERS') {
                    // Building dropdown options for doctors
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                }

                if (type === 'PRICE') {
                    // Building dropdown options for price
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                }

                if (type === 'PAYMENT' || type === 'PROVINCE') {
                    // Building dropdown options for payment and province
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                }

                if (type === 'SPECIALTY') {
                    // Building dropdown options for specialty
                    object.label = item.name;
                    object.value = item.id;
                }

                // Push the built object to the result array if label and value exist
                if (object.label && object.value) {
                    result.push(object);
                }
            });
        }

        return result;
    }

    componentDidUpdate(prevProps) {
        // Updating the doctor list if it has changed
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        // Updating the dropdowns when the language changes
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({ listDoctors: dataSelect });
        }

        // Updating dropdowns for payment, price, province, and specialty
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
            });
        }
    }

    // Handling changes in the Markdown editor
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    }

    // Function to save the doctor's information
    handleSaveContentMarkdown = () => {
        let { hasOldData, selectedPrice, selectedPayment, selectedProvince, selectedClinic, selectedSpecialty, nameClinic, addressClinic, note } = this.state;

        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption ? this.state.selectedOption.value : '',

            // CRUD_ACTION.CREATE or CRUD_ACTION.EDIT based on hasOldData
            action: hasOldData ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

            // Safely accessing the values of selected options
            selectedPrice: selectedPrice ? selectedPrice.value : '',
            selectedPayment: selectedPayment ? selectedPayment.value : '',
            selectedProvince: selectedProvince ? selectedProvince.value : '',
            nameClinic: nameClinic || '',
            addressClinic: addressClinic || '',
            note: note || '',

            // Special handling for clinicId and specialtyId to avoid undefined errors
            clinicId: selectedClinic && selectedClinic.value ? selectedClinic.value : '',
            specialtyId: selectedSpecialty && selectedSpecialty.value ? selectedSpecialty.value : ''
        });
    }

    // Handling changes in the selected doctor
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince } = this.state;
        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', selectedPrice = '',
                selectedPayment = '', selectedProvince = '';

            if (res.data.Doctor_infor) {
                addressClinic = res.data.Doctor_infor.addressClinic;
                nameClinic = res.data.Doctor_infor.nameClinic;
                note = res.data.Doctor_infor.note;
                paymentId = res.data.Doctor_infor.paymentId;
                priceId = res.data.Doctor_infor.priceId;
                provinceId = res.data.Doctor_infor.provinceId;

                selectedPrice = listPrice.find(item => item.value === priceId);
                selectedPayment = listPayment.find(item => item.value === paymentId);
                selectedProvince = listProvince.find(item => item.value === provinceId);
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
                selectedProvince: selectedProvince,
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

    // General handler for Select component changes
    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        this.setState({
            [name]: selectedOption
        });
    }

    // General handler for text input changes
    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy });
    }

    render() {
        let { listSpecialty, listClinic } = this.state;
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
                <div className='row'>
                        <div className='col-4 form-group'>
                            <label>Chọn Chuyên Khoa</label>
                            <Select
                                value={this.state.selectedSpecialty}
                                options={listSpecialty}
                                placeholder={'Choose specialty'}
                                onChange={(selectedOption) => this.handleChangeSelectDoctorInfor(selectedOption, 'selectedSpecialty')}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label>Chọn Phòng Khám</label>
                            <Select
                                value={this.state.selectedClinic}
                                options={listClinic}
                                placeholder={'Choose clinic'}
                                onChange={(selectedOption) => this.handleChangeSelectDoctorInfor(selectedOption, 'selectedClinic')}
                            />
                        </div>
                    </div>

                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
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

// Mapping state from Redux to props
const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

// Mapping dispatch actions to props
const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

// Connecting the component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
