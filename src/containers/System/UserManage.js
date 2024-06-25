import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}

        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReacts();
        
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () =>{
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) => {
        try{
            let response = await createNewUserService(data);
            if(response && response.errCode !==0){
                alert(response.errMessage)
            }else{
                await this.getAllUsersFromReacts();
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        }catch(e){
            console.log(e)
        }

    }

    getAllUsersFromReacts = async () => {
        let response = await getAllUsers('All');
        if(response && response.errCode ===0){
            this.setState({
                arrUsers: response.users
            })
        }
    }

    handleDeleteUser = async (user) => {
        console.log('Click delete',user)
        try{
            let res = await deleteUserService(user.id)
            if(res && res.errCode === 0){
                await this.getAllUsersFromReacts();
            }else{
                alert(res.errMessage)
            }
        }catch(e){
            console.log(e)
        }
    }

    handleEditUser  = (user) => {
        console.log('check edit user', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    } 

    doEditUser = async(user) => {
        
        try{
            let res = await editUserService(user);
            if(res && res.errCode === 0){
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReacts()
            }else{
                alert(res.errCode)
            }
        }catch(e){
            console.log(e)
        }
        }

    render() {
        let arrUsers = this.state.arrUsers;
        console.log(arrUsers)
        return (
            <div className="users-container">
                <ModalUser
                isOpen={this.state.isOpenModalUser}
                toggleFromParent = {this.toggleUserModal}
                createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                <ModalEditUser
                isOpen={this.state.isOpenModalEditUser}
                toggleFromParent = {this.toggleEditUserModal}
                currentUser={this.state.userEdit}
                editUser={this.doEditUser}
                />
                }

                <div className='title text-center mt-5'>User Management</div>
                <div className='mx-1 px-5'>
                    <button
                    className='btn btn-primary' 
                    onClick={()=>this.handleAddNewUser()}>
                    
                    <i className="fa-solid fa-plus"></i> Add New User</button>

                </div>
                <div className='user-table mt-5 mx-5'>
                    <table id="customers">
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        
                            { arrUsers && arrUsers.map((item,index) => {
                                return(
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={()=> this.handleEditUser(item)}><i className="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete' onClick={()=> this.handleDeleteUser(item)}><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    
                                    </tr>
                                   
                                )
                            })

                            }
                            
                        
                    </table>

                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
