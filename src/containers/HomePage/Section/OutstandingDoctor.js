import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss'
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import OSTDoctorImg from '../../../assets/OutstandingDoctor/doctor1.jpg'
import { LANGUAGES } from '../../../utils';

import { changeLanguageApp } from "../../../store/actions"


class OutstandingDoctor extends Component {


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
            <div className='section-outstanding-doctor'>
                <div className='specialty-container'>
                    <div className='specialty-header'>
                        <span>Oustanding Doctor Last Week</span>
                        <button><FormattedMessage id="homeheader.View-Details" /></button>
                    </div>

                    <Slider {...settings}>
                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Lionel Messi</div>
                                <div>Musculoskeletal</div>
                            </div>
                        </div>

                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Lionel Messi</div>
                                <div>Musculoskeletal</div>
                            </div>
                        </div>

                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Neymar</div>
                                <div>Musculoskeletal</div>
                            </div>
                        </div>

                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Hazard</div>
                                <div>Musculoskeletal</div>
                            </div>
                        </div>

                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Suarez</div>
                                <div>Musculoskeletal</div>
                            </div>
                        </div>

                        <div className='doctor-customize'>
                            <div className='outer-bg'>
                                <img src={OSTDoctorImg} />
                            </div>

                            <div className='position text-center'>
                                <div>Kevin</div>
                                <div>Musculoskeletal</div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor);
