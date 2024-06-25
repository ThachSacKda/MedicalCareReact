import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUsers, createNewUserService } from '../../services/userService';
import ModalUser from './ModalUser';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,

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
                                            <button className='btn-edit'><i className="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete'><i className="fa-solid fa-trash"></i></button>
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
