import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'



class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    async componentDidMount() { }

    async componentDidUpdate(prevProps, prevState, snapshot) {
         
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor  // Toggle detail info visibility
        });
    }

    render() {


        return (
            <>
            <HomeHeader/>
           <div>Hello detail specialty</div>
           </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DetailSpecialty);
