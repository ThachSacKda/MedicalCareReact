import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUser, getUnreadMessagesCount, markMessagesAsRead } from '../../services/userService';
import MessageBox from '../Auth/Message/MessageBox';
import { path } from '../../utils';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            selectedRole: 'All',
            isMessageBoxOpen: false,
            selectedUserId: null,
            selectedUserName: null,
            unreadCounts: {}, // Track unread message counts for each partner
        };
        this.unreadInterval = null; // Interval to periodically check unread messages
    }

    async componentDidMount() {
        const { userInfor } = this.props;
        const roleId = userInfor && userInfor.roleId === 'R4' ? 'R3' : 'All';
        await this.getAllUsersFromReacts(roleId);
        await this.loadUnreadCounts();

        // Thiết lập polling để gọi loadUnreadCounts mỗi 5 giây
        this.unreadInterval = setInterval(this.loadUnreadCounts, 1000);
    }

    componentWillUnmount() {
        // Xóa polling interval khi component bị unmount
        if (this.unreadInterval) {
            clearInterval(this.unreadInterval);
        }
    }

    loadUnreadCounts = async () => {
        const { userInfor } = this.props;
        if (userInfor) {
            const response = await getUnreadMessagesCount(userInfor.id);

            if (response && response.errCode === 0) {
                const unreadCounts = response.unreadCounts || {}; // Giả định response.unreadCounts là một đối tượng { partnerId: count }
                console.log("Processed unread counts:", unreadCounts); // Debugging output
                this.setState({ unreadCounts });
            } else {
                console.error("Error fetching unread counts:", response);
            }
        }
    };

    handleRoleChange = async (event) => {
        const roleId = event.target.value;
        await this.getAllUsersFromReacts(roleId);
        await this.loadUnreadCounts();
    };

    getAllUsersFromReacts = async (roleId = 'All') => {
        const response = await getAllUser('All', roleId);
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users,
                selectedRole: roleId,
            });
        }
    };

    openMessageBox = async (user) => {
        this.setState({
            isMessageBoxOpen: true,
            selectedUserId: user.id,
            selectedUserName: `${user.firstName} ${user.lastName}`,
        });

        const { userInfor } = this.props;
        if (userInfor) {
            await markMessagesAsRead(user.id, userInfor.id); // Mark messages as read
            this.setState((prevState) => ({
                unreadCounts: {
                    ...prevState.unreadCounts,
                    [user.id]: 0, // Reset unread count for this user
                },
            }));
        }
    };

    closeMessageBox = () => {
        this.setState({
            isMessageBoxOpen: false,
            selectedUserId: null,
            selectedUserName: null,
        });
    };

    navigateToPatientProfile = (userId) => {
        this.props.history.push(`${path.MEDICAL_RECORD_BY_PATIENT_ID}/${userId}`);
    };

    render() {
        const { userInfor } = this.props;
        const { arrUsers, isMessageBoxOpen, selectedUserId, selectedUserName, selectedRole, unreadCounts } = this.state;
        const isNurse = userInfor && userInfor.roleId === 'R4';

        return (
            <div className="users-container">
                <div className="title text-center mt-5">Account Management</div>

                {!isNurse && (
                    <div className="role-filter mt-3">
                        <label htmlFor="roleSelect">Filter by Role: </label>
                        <select id="roleSelect" value={selectedRole} onChange={this.handleRoleChange}>
                            <option value="All">All</option>
                            <option value="R1">Admin</option>
                            <option value="R2">Doctor</option>
                            <option value="R3">Patient</option>
                            <option value="R4">Nurse</option>
                            <option value="R5">Pharmacy</option>
                        </select>
                    </div>
                )}

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
                                {arrUsers && arrUsers.map((item, index) => (
                                    <tr key={index} onClick={() => this.navigateToPatientProfile(item.id)}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className="btn-contact" onClick={(e) => { e.stopPropagation(); this.openMessageBox(item); }}>
                                                <i className="fa-solid fa-envelope"></i>
                                                {unreadCounts[item.id] > 0 && (
                                                    <span className="unread-count">{unreadCounts[item.id]}</span>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isMessageBoxOpen && userInfor && (
                    <div className="message-box-modal">
                        <MessageBox
                            senderId={userInfor.id}
                            receiverId={selectedUserId}
                            receiverName={selectedUserName}
                            onClose={this.closeMessageBox}
                        />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfor: state.user.userInfor,
});

export default connect(mapStateToProps)(UserManage);
