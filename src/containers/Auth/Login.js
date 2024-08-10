import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })      
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
            }
        } catch (error) {
            if (error.response && error.response.data) {
                this.setState({
                    errMessage: error.response.data.message
                })
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Email:</label>
                            <input 
                                type='email' 
                                className='form-control' 
                                placeholder='Enter your email' 
                                value={this.state.username} 
                                onChange={(event) => this.handleOnChangeUsername(event)} 
                                onKeyDown={(event) => this.handleKeyDown(event)}
                                required
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input 
                                    className='form-control'
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    placeholder='Enter your password'
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                    required
                                />
                                <span onClick={this.handleShowHidePassword}>
                                    <i className={this.state.isShowPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12 err-message'>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button 
                                className='btn-login' 
                                onClick={this.handleLogin}
                            >
                                Login
                            </button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or Login with:</span>
                            <div className='col-12 social-login'>
                                <i className='fa-brands fa-google-plus-g google'></i>
                                <i className='fa-brands fa-facebook-f facebook'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
