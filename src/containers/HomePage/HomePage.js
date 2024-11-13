import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2'; // Import SweetAlert2
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import Consultation from './Section/Consultation';
import OutstandingDoctor from './Section/OutstandingDoctor';
import HomeFooter from './HomeFooter';

class HomePage extends Component {

    componentDidMount() {
        const { isLoggedIn, userInfor } = this.props;
        
        if (isLoggedIn && userInfor) {
            Swal.fire({
                icon: 'success',
                title: `Welcome, ${userInfor.firstName}!`,
                text: 'You have successfully logged in.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                timer: 2000, // Set timer to 3 seconds
                timerProgressBar: true, // Show the timer progress bar
                willClose: () => {
                    // This function will be triggered when the alert is closed (after 3 seconds or when the user clicks OK)
                    console.log('Alert closed');
                }
            });
        }
    }

    render() {
        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <Specialty />
                <OutstandingDoctor />
                {/* <About /> */}
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfor: state.user.userInfor // Lấy thông tin người dùng từ redux
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
