import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss';
import { LANGUAGES, path } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import * as actions from "../../store/actions";

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/homepage`);
        }
    }

    handleLogout = () => {
        this.props.processLogout();
        this.props.history.push(path.LOGIN); // Redirect to the login page after logout
    }

    render() {
        let language = this.props.language;
        const { isLoggedIn, userInfor } = this.props; // Sử dụng userInfor để hiển thị tên người dùng
    
        return (
            <React.Fragment>
                <div className='home-header-cotainer'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fa-solid fa-bars"></i>
                            <div className='header-logo' onClick={() => this.returnToHome()}></div>
                        </div>
                        {/* <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
    
                            {isLoggedIn && (
                                <div className='child-content'>
                                    <div><b><FormattedMessage id="homeheader.view-profile" /></b></div>
                                    <div><FormattedMessage id="homeheader.Medical-Record" /></div>
                                </div>
                            )}
                        </div> */}
                        <div className='right-content'>
                            
                            {isLoggedIn && userInfor && (
                                <div className="user-name">
                                    <span><FormattedMessage id="homeheader.welcome" /> {userInfor.firstName} {userInfor.lastName}</span>
                                </div>
                            )}

                            {/* Thêm nút điều hướng đến trang quản lý bệnh nhân cho bác sĩ */}
                            {isLoggedIn && userInfor && userInfor.roleId === 'R2' && (
                                <div className="manage-patient-link">
                                    <Link to="/doctor/manage-patient">
                                        <span>Manage Patients</span>
                                    </Link>
                                </div>
                            )}
    
                            {!isLoggedIn && (
                                <div className='register-link'>
                                    <Link to={path.LOGIN}>
                                        <span></span><span></span>
                                        <span><FormattedMessage id="homeheader.login" /></span>
                                    </Link>
                                </div>
                            )}
    
                            {/* Link to Register page */}
                            <div className='register-link'>
                                <Link to="/register">
                                    <span><FormattedMessage id="homeheader.register" /></span>
                                </Link>
                            </div>
    
                            {/* Language Switch */}
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
    
                            {isLoggedIn && (
                                <div className="btn btn-logout" onClick={this.handleLogout} title='Log Out'>
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
    
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'>MEDICAL CARE PROVISION</div>
                            <div className='title2'>Comprehensive health care</div>
                            <div className='search'>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type='text' placeholder='Searching...' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='options-child'>
                                    <div className='icon-child'><i className="fa-regular fa-hospital"></i></div>
                                    <div className='text-child'>Specialized examination</div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className="fa-solid fa-mobile"></i></div>
                                    <div className='text-child'>Remote examination</div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className="fa-solid fa-truck-medical"></i></div>
                                    <div className='text-child'>Medical tests</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
    
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfor: state.user.userInfor,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
