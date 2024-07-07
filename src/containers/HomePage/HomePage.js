import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader'
import Specialty from './Section/Specialty';

<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>

class HomePage extends Component {

    render() {
        return (
            <div>
            <HomeHeader/>
            <Specialty/>
            <div style={{height: '300px'}}>

            </div>
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
