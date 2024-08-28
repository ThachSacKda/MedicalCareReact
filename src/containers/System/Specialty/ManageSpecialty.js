import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import {CreateNewSpecialty} from '../../../services/userService'
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();


class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML:'',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() { }

    async componentDidUpdate(prevProps, prevState, snapshot) {
         
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor  // Toggle detail info visibility
        });
    }

    handleOnchangeInput = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML:html,
            descriptionMarkdown: text,
        });
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveSpecialty = async () => {
        let res = await CreateNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add Specialty Successfully!');
        } else {
            toast.error('Add Specialty Failed!');
            console.log('res', res);
        }
    };
    

    render() {


        return (
           <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lí chuyên khoa</div>
                
                <div className='add-new-specialty row'>
                <div className='col-6 form-group'>
                    <label>Tên chuyên khoa</label>
                    <input className='form-control' type='text' value={this.state.name}
                    onChange={(event)=>this.handleOnchangeInput(event, 'name')}
                    
                    />
                </div>
                <div className='col-6 form-group'>
                    <label>Ảnh chuyên khoa</label>
                    <input className='form-control-file' type='file'
                        onChange={(event)=> this.handleOnchangeImage(event)}
                    />
                </div>
                <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className='col-12'>
                    <button className='btn-save-specialty'
                    onClick={()=> this.handleSaveSpecialty()}
                    >Save</button>
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

export default connect(mapStateToProps)(ManageSpecialty);
