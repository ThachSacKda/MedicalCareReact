import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [4, 5, 6]
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        let { arrDoctorId } = this.state;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='specialty-description'>
                    {/* Nội dung mô tả chuyên khoa */}
                </div>
                {arrDoctorId && arrDoctorId.length > 0 &&
                    arrDoctorId.map((item, index) => {
                        return (
                            <div className='each-doctor' key={index}>
                                <div className='doctor-content'>
                                    <div className='content-left'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isshowDesciptionDoctor={true}
                                        />
                                    </div>
                                    <div className='content-right'>
                                        <DoctorSchedule
                                            doctorIdFromParent={item}
                                        />
                                        <DoctorExtraInfor
                                            doctorIdFromParent={item} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DetailSpecialty);
