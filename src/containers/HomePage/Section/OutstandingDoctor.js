import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss'
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { LANGUAGES } from '../../../utils';

import { changeLanguageApp } from "../../../store/actions"
import * as actions from '../../../store/actions';
import { withRouter } from 'react-router';


class OutstandingDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        if(this.props.history){
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
       
    }

    render() {
        let settings = {
            dots: false,
            Infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };

        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors)
        return (
            <div className='section-outstanding-doctor'>
                <div className='specialty-container'>
                    <div className='specialty-header'>
                        <span><FormattedMessage id="homeheader.out-doctor" /></span>
                    </div>
                    <Slider {...settings}>
                        {arrDoctors && arrDoctors.length > 0 
                        && arrDoctors.map((item, index) => {
                            let imageBase64 = '';
                            if (item.image) {
                                imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                            }
                            let nameVi = ` ${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                            let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                            return (
                                <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                    <div className='customize-border'>
                                        <div className='outer-bg'>
                                            {/* <div className='bg-image section-outstading-doctor'
                                                style={{ backgroundImage: `url(${imageBase64})` }}>
                                                    
                                            </div> */}
                                            <img src={imageBase64} alt="Doctor" className='bg-image section-outstading-doctor' />

                                            
                                            
                                        </div>
                                        <div className='position text-center'>
                                            <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
