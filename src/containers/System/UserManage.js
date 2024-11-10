import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUser } from '../../services/userService';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            selectedRole: 'All' // Lưu trữ giá trị role đã chọn
        };
    }

    async componentDidMount() {
        await this.getAllUsersFromReacts();
    }

    handleRoleChange = async (event) => {
        const roleId = event.target.value; // Giá trị role được chọn
        await this.getAllUsersFromReacts(roleId);
    };

    getAllUsersFromReacts = async (roleId = 'All') => {
        let response = await getAllUser('All', roleId); // Truyền roleId vào request
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
    };

    render() {
        return (
            <div className="users-container">
    <div className="title text-center mt-5">Account Management</div>
    
    <div className="role-filter mt-3">
        <label htmlFor="roleSelect">Filter by Role: </label>
        <select id="roleSelect" onChange={this.handleRoleChange}>
            <option value="All">All</option>
            <option value="R1">Admin</option>
            <option value="R2">Doctor</option>
            <option value="R3">Patient</option>
            <option value="R4">Nurse</option>
            <option value="R5">Pharmacy</option>
        </select>
    </div>

    <div className="table-container">
        <div className="user-table mt-5">
            <table id="customers">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.arrUsers && this.state.arrUsers.map((item, index) => (
                        <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.address}</td>
                            <td>
                                <button className="btn-contact">
                                    <i className="fa-solid fa-envelope"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</div>

        );
    }
}

export default UserManage;
