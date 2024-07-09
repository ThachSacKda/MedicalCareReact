import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss'
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

import { LANGUAGES } from '../../utils';

import {changeLanguageApp} from "../../store/actions"


class HomeFooter extends Component {


    render() {
        return (
            <div className='home-footer'>
                <p>&copy; 2024 Medical Care. <a href='#'>More Information</a></p> 
                
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
