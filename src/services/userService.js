import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUser = (inputId) => {
    return axios.get(`/api/get-all-user?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.post('/api/delete-user',{id: userId})
    return axios.delete('/api/delete-user', {data: {id: userId}});
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}

const getTopDocTorHomeService = (limit) =>{
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
const getAllDoctors = () =>{
    return axios.get(`/api/get-all-doctor`)
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data)

}
const getDetailInforDoctor = (inputId) =>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)

}
const saveBulkScheduleDoctor = (data) =>{
    return axios.post(`/api/bulk-create-schedule`, data)

}

const getScheduleDoctorByDate = (doctorId, date) =>{
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)

}

const getExtraInforDoctorById = (doctorId) =>{
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)

}
const getProfileDoctorById = (doctorId) =>{
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)

}

const postPatientBookingAppointment = (data) =>{
    return axios.post(`/api/patient-book-appointment`, data)

}

const postVerifyBookingAppointment = (data) =>{
    return axios.post(`/api/verify-book-appointment?doctorId=${data.doctorId}&token=${data.token}`);
}

const CreateNewSpecialty = (data) =>{
    return axios.post(`/api/create-new-specialty`, data)
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}

const getDetailDpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

// Create new medicine
const createNewMedicine = (data) => {
    return axios.post(`/api/create-new-medicine`, data);
}

// Get all medicines
const getAllMedicines = () => {
    return axios.get(`/api/get-all-medicine`);
}

const updateMedicine = (inputData) => {
    return axios.put(`/api/update-medicine`, inputData); // Gửi dữ liệu cập nhật qua body
};

const deleteMedicine = (id) => {
    return axios.delete('/api/delete-medicine', {
        data: { id } // Gửi ID trong body của yêu cầu
    });
};

const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
}

const getAllPatientsForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}
const getDetailPatientById = (data) => {
    return axios.get(`/api/get-detail-patient-by-id?patientId=${data.patientId}`);
};

const addMedicalRecord = (data) => {
    return axios.post('/api/add-medical-record', data);
};

const getMedicalRecordsByPatientId = (patientId) => {
    return axios.get(`/api/medical-records/${patientId}`);
};


const getPatientProfileById = (patientId) => {
    return axios.get(`/api/patient-profile/${patientId}`);
};
const getAppointmentStatistics = () => {
    return axios.get('/api/admin/dashboard/appointments');
};
const getWeeklyBookingStatistics = () => {
    return axios.get('/api/admin/dashboard/weekly-appointments');
};
const getBookingHistoryByPatientId = (patientId) => {
    return axios.get(`/api/patient/booking-history?patientId=${patientId}`);
};







export { handleLoginApi, getAllUser, createNewUserService, 
    deleteUserService, editUserService, getAllCodeService, 
    getTopDocTorHomeService, getAllDoctors, saveDetailDoctorService,
    getDetailInforDoctor, saveBulkScheduleDoctor,
    getScheduleDoctorByDate, getExtraInforDoctorById, getProfileDoctorById,
    postPatientBookingAppointment, postVerifyBookingAppointment, CreateNewSpecialty,
    getAllSpecialty, getDetailDpecialtyById, createNewMedicine, getAllMedicines,
    updateMedicine, deleteMedicine, createNewClinic, getAllPatientsForDoctor, 
    getDetailPatientById, addMedicalRecord, getMedicalRecordsByPatientId, getPatientProfileById,
    getAppointmentStatistics, getWeeklyBookingStatistics, getBookingHistoryByPatientId, 
};
