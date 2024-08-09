import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';
import { FormattedMessage } from 'react-intl';

class About extends Component {
    render() {
        return (
            <section id="service" className="section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-sm-4">
                            <h2 className="ser-title">Our Service</h2>
                            <hr className="botm-line" />
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris cillum.</p>
                        </div>
                        <div className="col-md-4 col-sm-4">
                            <div className="service-info">
                                <div className="icon">
                                    <i className="fa fa-stethoscope"></i>
                                </div>
                                <div className="icon-info">
                                    <h4>24 Hour Support</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            </div>
                            <div className="service-info">
                                <div className="icon">
                                    <i className="fa fa-ambulance"></i>
                                </div>
                                <div className="icon-info">
                                    <h4>Emergency Services</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-4">
                            <div className="service-info">
                                <div className="icon">
                                    <i className="fa fa-user-md"></i>
                                </div>
                                <div className="icon-info">
                                    <h4>Medical Counseling</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            </div>
                            <div className="service-info">
                                <div className="icon">
                                    <i className="fa fa-medkit"></i>
                                </div>
                                <div className="icon-info">
                                    <h4>Premium Healthcare</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
