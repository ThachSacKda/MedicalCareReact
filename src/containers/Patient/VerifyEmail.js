import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {postVerifyBookingAppointment} from '../../services/userService'
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
           statusVerify: false,
           errCode: 0
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let res = await postVerifyBookingAppointment({
                token: token,
                doctorId: doctorId
            })

            if(res && res.errCode === 0){
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode

                })
            }else{
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            } 
        }
    }
    
    

    async componentDidUpdate(prevProps, prevState, snapshot) {
         
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor  // Toggle detail info visibility
        });
    }

    render() {

        let {statusVerify, errCode} = this.state;
        console.log("state:", this.state)
        return (
            <>
                <HomeHeader/>
                <div className='verify-email-container'>

                
                {statusVerify === false ?
                    <div>
                        Loading Data
                    </div>
                    :
                    <div>
                        {errCode === 0 ?
                        <div>Xác nhận lịch hẹn thành công</div> :
                        <div>Lịch hẹn không tồn tại hoặc đã được xác nhận</div>
                        }
                    </div>
                }
                </div>
            </>
           
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(VerifyEmail);
