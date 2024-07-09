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


class Specialty extends Component {


    render() {
        let settings = {
            dots: false,
            Infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            // nextArrow: <SampleNextArrow/>,
            // preArrow: <SamplePreArrow/>
        };
        return (
            <div className='section-specialty'>
                <div className='specialty-container'>
                    <div className='specialty-header'>
                        <span><FormattedMessage id="homeheader.Popular-specialties"/></span>
                        <button><FormattedMessage id="homeheader.View-Details"/></button>
                    </div>

                    <Slider {...settings}>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 1</div>
                        </div>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 2</div>
                        </div>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 3</div>
                        </div>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 4</div>
                        </div>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 5</div>
                        </div>
                        <div className='section-customize'>
                            <img src={specialtyImg} />
                            <div>Musculoskeletal 6</div>
                        </div>
                    </Slider>
                </div>
                

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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
