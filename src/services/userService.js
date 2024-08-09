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
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
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


export { handleLoginApi, getAllUser, createNewUserService, 
    deleteUserService, editUserService, getAllCodeService, 
    getTopDocTorHomeService, getAllDoctors, saveDetailDoctorService,
    getDetailInforDoctor,
};
