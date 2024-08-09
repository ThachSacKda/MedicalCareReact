import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader'
import Specialty from './Section/Specialty';
import Consultation from './Section/Consultation';
import OutstandingDoctor from './Section/OutstandingDoctor';
import About from './Section/About';
import HomeFooter from './HomeFooter';



class HomePage extends Component {

    render() {
        return (
            <div>
            <HomeHeader isShowBanner={true}/>
            <Specialty/>
            <Consultation/>  
            <OutstandingDoctor/>   
            {/* <About/> */}
            <HomeFooter/>

            </div>
            
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
