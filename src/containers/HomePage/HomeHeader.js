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

    navigateToMessages = () => {
        const { userInfor, history } = this.props;
        if (userInfor && userInfor.id) {
            history.push(`${path.MESSAGE}/${userInfor.id}`); // Điều hướng tới trang tin nhắn cùng với userId
        }
    }

    render() {
        let language = this.props.language;
        const { isLoggedIn, userInfor } = this.props; // Use userInfor to display the user’s name

        return (
            <React.Fragment>
                <div className='home-header-cotainer'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <div className='header-logo' onClick={() => this.returnToHome()}></div>
                        </div>

                        <div className='right-content'>
                            {isLoggedIn && userInfor && (
                                <div className="user-name">
                                    <span><FormattedMessage id="homeheader.welcome" /> {userInfor.firstName} {userInfor.lastName}</span>
                                </div>
                            )}

                            {isLoggedIn && userInfor && userInfor.roleId === 'R3' && (
                                <div className="message-icon">
                                    <i className="fa-solid fa-envelope" onClick={this.navigateToMessages} title="Messages"></i>
                                </div>
                            )}

                            {/* Link to Patient Profile Page */}
                            {isLoggedIn && userInfor && userInfor.roleId === 'R3' && (
                                <div className="profile-link">
                                    <Link to={`${path.MEDICAL_RECORD_BY_PATIENT_ID}/${userInfor.id}`}>
                                        <span><FormattedMessage id="homeheader.Profile" /></span>
                                    </Link>
                                </div>
                            )}

                            {/* New Link to Booking History */}
                            {isLoggedIn && userInfor && userInfor.roleId === 'R3' && (
                                <div className="history-link">
                                    <Link to={`${path.BOOKING_HISTORY.replace(':patientId', userInfor.id)}`}>
                                        <span><FormattedMessage id="homeheader.History" /></span>
                                    </Link>
                                </div>
                            )}

                            {/* New Link to Manage for doctor role */}
                            {isLoggedIn && userInfor && userInfor.roleId === 'R2' && (
                                <div className="dashboard-link">
                                    <Link to='/doctor/manage-patient'>
                                        <span><FormattedMessage id="homeheader.Manage" /></span>
                                    </Link>
                                </div>
                            )}

                            {/* Link to Dashboard for Admin Role */}
                            {isLoggedIn && userInfor && userInfor.roleId === 'R1' && (
                                <div className="dashboard-link">
                                    <Link to={path.DASHBOARD}>
                                        <span><FormattedMessage id="homeheader.Manage" /></span>
                                    </Link>
                                </div>
                            )}

                            {isLoggedIn && userInfor && userInfor.roleId === 'R5' && (
                                <div className="dashboard-link">
                                    <Link to={path.MEDICINE}>
                                        <span><FormattedMessage id="homeheader.ManageMedicine" /></span>
                                    </Link>
                                </div>
                            )}



                            {isLoggedIn && userInfor && userInfor.roleId === 'R4' && (
                                <div className="dashboard-link">
                                    <Link to='/system/user-manage'>
                                        <span><FormattedMessage id="homeheader.chat" /></span>
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

                            <div className='register-link'>
                                <Link to="/register">
                                    <span><FormattedMessage id="homeheader.register" /></span>
                                </Link>
                            </div>

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
                            <div className='booking'>
                                <button className='booking-button'><FormattedMessage id="homeheader.Booknow" /></button>
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
