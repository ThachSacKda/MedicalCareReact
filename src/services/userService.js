import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUser = (inputId) => {
    return axios.get(`/api/get-all-user?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data: ', data)
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
export { handleLoginApi, getAllUser, createNewUserService, 
    deleteUserService, editUserService, getAllCodeService };
