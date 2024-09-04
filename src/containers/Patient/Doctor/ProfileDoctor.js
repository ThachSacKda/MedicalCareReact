import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom'; // Import Link

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
            isShowDetailInfor: false
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        });
    }

    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language || this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data
            });
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            moment.locale(language === LANGUAGES.VI ? 'vi' : 'en');

            let date = language === LANGUAGES.VI
                ? moment(dataTime.date).format('dddd - DD/MM/YYYY')
                : moment(dataTime.date).format('dddd - MM/DD/YYYY');

            let time = dataTime.timeTypeData ? (language === LANGUAGES.VI
                ? dataTime.timeTypeData.valueVi
                : dataTime.timeTypeData.valueEn) : '';

            return (
                <>
                    <div>{time} - {date}</div>
                </>
            );
        }

        return <></>;
    }

    render() {
        let { dataProfile, isShowDetailInfor } = this.state;
        let { language, dataTime, isShowLinkDetail, isShowPrice } = this.props;
        let nameVi = '', nameEn = '';

        if (dataProfile && dataProfile.positionData) {
            nameVi = `Thạc sĩ ${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `Doctor ${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }

        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDetailInfor === true ?
                                <>
                                    {dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span>{dataProfile.Markdown.description}</span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${dataProfile && dataProfile.id ? dataProfile.id : ''}`}>Xem thêm</Link>
                    </div>}


                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id='patient.extra-price' />
                        {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.VI ?
                            <NumberFormat
                                value={dataProfile.Doctor_infor.priceTypeData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' VND'}
                            />
                            : ''
                        }
                        {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.EN ?
                            <NumberFormat
                                value={dataProfile.Doctor_infor.priceTypeData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                            : ''
                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(ProfileDoctor);
