import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUser, 
deleteUserService} from '../../services/userService';
import { toast } from 'react-toastify';
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart = () => {
    
    return async (dispatch, getState) => {
        try {
            dispatch({type: actionTypes.FETCH_GENDER_START})

            let res = await getAllCodeService("GENDER");
            if(res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data))
            }else{
                dispatch(fetchGenderFailed())
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
        }
    }
   
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

//position
export const fetchPositionStart = () => {
    
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            if(res && res.errCode === 0){
                dispatch(fetchPositionSuccess(res.data))
            }else{
                dispatch(fetchPositionFailed())
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
        }
    }
   
}

//roles
export const fetchRoleStart = () => {
    
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if(res && res.errCode === 0){
                dispatch(fetchRoleSuccess(res.data))
            }else{
                dispatch(fetchRoleFailed())
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
        }
    }
   
}

//show all user
export const fetchAllUserStart = () => {
    
    return async (dispatch, getState) => {
        try {
            let res = await getAllUser("All");
            console.log('loi:',res.users)
            if(res && res.errCode === 0){
                dispatch(fetchAllUserSuccess(res.users))
            }else{
                toast.error("FETCH ALL USER FAILED!");
                dispatch(fetchAllUserFailed())
            }
        } catch (e) {
            
            toast.error("FETCH ALL USER FAILED hehehe!");
            dispatch(fetchAllUserFailed());
        }
    }
   
}

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data) ;
            console.log('check user redux:',res)
            if(res && res.errCode === 0){
                toast.success("CREATE SUCCESS!");
                dispatch(saveUserSuccess(res.data))
                dispatch(fetchAllUserStart());
            }else{
                dispatch(saveUserFailed())
            }
        } catch (e) {
            dispatch(saveUserFailed());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})


export const DeleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId) ;
            if(res && res.errCode === 0){
                toast.success("DELETE SUCCESS!");
                dispatch(deleteSuccess())
                dispatch(fetchAllUserStart());
            }else{
                toast.error("DELETE FAILED!");
                dispatch(deleteFailed())
            }
        } catch (e) {
            toast.error("DELETE FAILED!");
            dispatch(deleteFailed());
        }
    }
}


export const deleteSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})
export const deleteFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

