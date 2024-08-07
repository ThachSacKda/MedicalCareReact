import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss'
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTION, CommonUtils } from '../../../utils';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'chocolate', label: 'Chocolate' },
]




class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctor();
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })

        }

        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value
        })
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        // console.log(`Option selected:`, selectedOption);
    }

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }


    render() {
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id='manage-doctor.create-doctor-infor' />

                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id='manage-doctor.choose-doctor' />
                        </label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}

                        />
                    </div>
                    <div className='content-right'>
                        <label>
                            <FormattedMessage id='manage-doctor.introductory-information' />

                        </label>
                        <textarea className='form-control' rows="4"
                            onChange={(event) => this.handleOnChangeDesc(event)}
                            value={this.state.description}
                        >
                            sdsdsfsd
                        </textarea>
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange} />

                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
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
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: (id) => dispatch(actions.fetchAllDoctor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
