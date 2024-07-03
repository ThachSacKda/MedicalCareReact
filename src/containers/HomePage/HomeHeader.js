import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss'

class HomeHeader extends Component {

    render() {
        return (
            <div className='home-header-cotainer'>
                <div className='home-header-content'>
                    <div className='left-content'>
                        <i className="fa-solid fa-bars"></i>
                        <div className='header-logo'>

                        </div>
                    </div>
                    <div className='center-content'>
                        <div className='child-content'>
                            <div><b>Chuyên khoa</b></div>
                            <div>Tìm bác sĩ theo chuyên khoa</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Cơ sở y tế</b></div>
                            <div>Chọn bệnh viện phòng khám</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Bác Sĩ</b></div>
                            <div>Chọn bác sĩ phù hợp</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Gói khám</b></div>
                            <div>Khám tổng quát</div>
                        </div>
                    </div>
                    <div className='right-content'>
                        <div className='support'><i className="fa-regular fa-circle-question"></i>Hỗ trợ</div>
                        <div className='flag'>VN</div>
                    </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
