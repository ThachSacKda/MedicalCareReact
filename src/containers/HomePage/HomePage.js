import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader'
import Specialty from './Section/Specialty';
import Consultation from './Section/Consultation';
import OutstandingDoctor from './Section/OutstandingDoctor';




class HomePage extends Component {

    render() {
        return (
            <div>
            <HomeHeader/>
            <Specialty/>
            <Consultation/>  
            <OutstandingDoctor/>        
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
