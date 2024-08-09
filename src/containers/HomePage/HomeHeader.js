import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss'
import { LANGUAGES } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { changeLanguageApp } from "../../store/actions"

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    render() {
        let language = this.props.language;

        return (
            <React.Fragment>
                <div className='home-header-cotainer'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fa-solid fa-bars"></i>
                            <div className='header-logo'>

                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b> <FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b> <FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div> <FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.examination-package" /></b></div>
                                <div><FormattedMessage id="homeheader.general-examination" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'><i className="fa-regular fa-circle-question"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>

                    </div>

                </div>
                {this.props.isShowBanner===true && 
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
