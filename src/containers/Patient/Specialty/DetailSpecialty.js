import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailDpecialtyById, getAllCodeService } from '../../../services/userService'
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: {}
        }
    }

    async componentDidMount() { }

    async componentDidUpdate(prevProps, prevState, snapshot) { }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailDpecialtyById({
                id: id,
                location: 'All'
            });

            let resProvince = await getAllCodeService('PROVINCE')

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })

                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: resProvince.data
                });
            }

        }
    }
    handleOnchangSelected = (event) => {
        console.log('onchange:', event.target.value)
    }
    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
        let { language } = this.props
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='specialty-description'>
                    {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                        && <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }} />
                    }
                </div>
                <div className='search-sp-doctor'>
                    <select onChange={(event) => this.handleOnchangSelected(event)}>
                        {listProvince && listProvince.length > 0 &&
                            listProvince.map((item, index) => {
                                return (
                                    <option key={index} value={item.keyMap}>
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                {arrDoctorId && arrDoctorId.length > 0 &&
                    arrDoctorId.map((item, index) => {
                        return (
                            <div className='each-doctor' key={index}>
                                <div className='content-left'>
                                    <ProfileDoctor
                                        doctorId={item}
                                        isshowDesciptionDoctor={true}
                                    />
                                </div>
                                <div className='content-right'>
                                    <DoctorSchedule doctorIdFromParent={item} />
                                    <DoctorExtraInfor doctorIdFromParent={item} />
                                </div>
                            </div>
                        );
                    })
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

export default connect(mapStateToProps)(DetailSpecialty);
