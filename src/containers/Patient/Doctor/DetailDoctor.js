import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            loading: true, // Add loading state to handle data fetching
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            });

            try {
                let res = await getDetailInforDoctor(id);
                console.log("Fetched Doctor Details:", res); // Debug fetched data
                if (res && res.errCode === 0) {
                    this.setState({
                        detailDoctor: res.data,
                        loading: false
                    });
                } else {
                    console.error("Failed to fetch doctor details:", res.errMessage);
                    this.setState({ loading: false });
                }
            } catch (error) {
                console.error("Error fetching doctor details:", error);
                this.setState({ loading: false });
            }
        }
    }

    render() {
        let { language } = this.props;
        let { detailDoctor, loading } = this.state;

        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        if (loading) {
            return <div>Loading...</div>; // Add a loading message while data is being fetched
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div
                            className='content-left'
                            style={{
                                backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})`,
                            }}
                        ></div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor.Markdown &&
                                    detailDoctor.Markdown.description && (
                                        <span>{detailDoctor.Markdown.description}</span>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfor doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {detailDoctor &&
                            detailDoctor.Markdown &&
                            detailDoctor.Markdown.contentHTML && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: detailDoctor.Markdown.contentHTML,
                                    }}
                                ></div>
                            )}
                    </div>
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

export default connect(mapStateToProps)(DetailDoctor);
