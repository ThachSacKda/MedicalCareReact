import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss'
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import specialtyImg from '../../../assets/specialty/bone.jpg'
import { LANGUAGES } from '../../../utils';

import {changeLanguageApp} from "../../../store/actions"


class About extends Component {


    render() {
        return (
            <div className='section-share section-about'>
                 
                About Us
            </div>
            
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
