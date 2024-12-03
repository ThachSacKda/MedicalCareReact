import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }
    handleViewDetailSpecialty = (item) => {
        if(this.props.history){
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4, // Hiển thị 4 ảnh cùng lúc
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
        };

        let { dataSpecialty } = this.state;

        return (
            <div className='section-specialty'>
                <div className='specialty-container'>
                    <div className='specialty-header'>
                        <span><FormattedMessage id="homeheader.Popular-specialties" /></span>
                    </div>

                    <Slider {...settings}>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                    <div className="section-customize" 
                                    key={index}
                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div
                                            className="bg-image section-specialty"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        ></div>
                                        <div>{item.name}</div>
                                    </div>
                                );
                            })
                        }
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

export default withRouter(connect(mapStateToProps)(Specialty));
