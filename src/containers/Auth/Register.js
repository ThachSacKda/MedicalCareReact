import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTION, CommonUtils } from '../../utils';
import * as actions from "../../store/actions";
import './Register.scss';
import Lighbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import HomeHeader from '../HomePage/HomeHeader';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            avatar: '',

            action: CRUD_ACTION.CREATE,
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: this.props.genderRedux && this.props.genderRedux.length > 0 ? this.props.genderRedux[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTION.CREATE,
                previewImgURL: ''
            });
        }
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        });
    };

    handleSaveUser = () => {
        let isValid = this.checkValidIput();
        if (isValid === false) return;

        this.props.createNewUser({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phonenumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: 'R3', // Set the role to 'R3'
            avatar: this.state.avatar
        });
    };

    checkValidIput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    };

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let { email, password, firstName, lastName, phoneNumber, address, gender, avatar } = this.state;
        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='user-redux-container'>
                    <div className='title'>
                        Registration
                    </div>
                    <div>{isGetGenders === true ? 'Loading genders' : ''} </div>
                    <div className="user-redux-body">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-3'>
                                    <label>Email</label>
                                    <input className='form-control' type='email'
                                        value={email}
                                        onChange={(event) => { this.onChangeInput(event, 'email') }}
                                        placeholder='Email'
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Password</label>
                                    <input className='form-control' type='password' placeholder='Password'
                                        value={password}
                                        onChange={(event) => { this.onChangeInput(event, 'password') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>First Name</label>
                                    <input className='form-control' type='text' placeholder='First Name'
                                        value={firstName}
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Last Name</label>
                                    <input className='form-control' type='text' placeholder='Last Name'
                                        value={lastName}
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Phone Number</label>
                                    <input className='form-control' type='text' placeholder='Phone Number'
                                        value={phoneNumber}
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                    />
                                </div>
                                <div className='col-9'>
                                    <label>Address</label>
                                    <input className='form-control' type='text' placeholder='Address'
                                        value={address}
                                        onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Gender</label>
                                    <select className='form-control'
                                        onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                        value={gender}
                                    >
                                        {genders && genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })
                                        }
                                    </select>
                                    <div className='col-12 my-3'>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.handleSaveUser()}
                                        >
                                            <FormattedMessage id='manage-user.save' />
                                        </button>
                                    </div>
                                </div>

                                <div className='col-3'>
                                    <label>Image</label>
                                    <div className='preview-img-container'>
                                        <input id='previewImg' type='file' hidden
                                            onChange={(event) => this.handleOnchangeImage(event)}
                                        />
                                        <label className='label-upload' htmlFor='previewImg'>Upload<i className='fas fa-upload'></i> </label>
                                        <div className='preview-image'
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.openPreviewImage()}></div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    {this.state.isOpen === true &&
                        <Lighbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
