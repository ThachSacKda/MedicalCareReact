import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            menuApp: []
        }
    }
    
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    componentDidMount() {
        let { userInfor } = this.props;
        let menu = [];
        if (userInfor && !_.isEmpty(userInfor)) {
            let role = userInfor.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu
        });
    }

    handleLogout = () => {
        this.props.processLogout();
        this.props.history.push('/login'); // Redirect to login page after logout
    }

    render() {
        const { language, userInfor } = this.props;
        return (
            <div className="header-container">
                {/* Logo and Home link */}
                <div className="header-logo">
                    <Link to="/" className="home-link">
                        <i className="fas fa-home"></i> Home
                    </Link>
                </div>

                {/* Navigation bar */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                {/* Language selection and Logout */}
                <div className="languages">
                    <span className="welcome">
                        <FormattedMessage id="homeheader.welcome" />, 
                        {userInfor && userInfor.firstName ? userInfor.firstName : ''}
                    </span>
                    <span className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>VN</span>
                    <span className={language === LANGUAGES.EN ? "language-en active" : "language-en"}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>EN</span>

                    <div className="btn btn-logout" onClick={this.handleLogout} title="Log Out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfor: state.user.userInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
