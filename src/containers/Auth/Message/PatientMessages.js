import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUser, getAllMessagesForUser, getUnreadMessagesCount, markMessagesAsRead } from '../../../services/userService';
import PatientMessageBox from './PatientMessageBox';
import './PatientMessages.scss';
import HomeHeader from '../../HomePage/HomeHeader';

class PatientMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nurses: [], // Store all Nurse accounts
            conversations: [], // Store conversation history
            selectedConversation: null,
            unreadCounts: {}, // Track unread message counts for each partner
        };
        this.unreadInterval = null; // Interval to periodically check unread messages
    }

    async componentDidMount() {
        await this.loadNurseAccounts(); 
        await this.loadConversations(); 
        await this.loadUnreadCounts(); 

        // Set polling to call loadUnreadCounts every 5 seconds
        this.unreadInterval = setInterval(this.loadUnreadCounts, 5000);
    }

    componentWillUnmount() {
        // Clear interval when component unmounts
        if (this.unreadInterval) {
            clearInterval(this.unreadInterval);
        }
    }

    loadNurseAccounts = async () => {
        // Fetch all users with role 'R4' (Nurse)
        const response = await getAllUser('All', 'R4');
        if (response && response.errCode === 0) {
            this.setState({ nurses: response.users });
        }
    };

    loadConversations = async () => {
        const userId = this.props.match.params.userId;
        if (userId) {
            const response = await getAllMessagesForUser(userId);
            if (response && response.errCode === 0) {
                const conversations = this.groupMessagesByPartner(response.messages);
                this.setState({ conversations });
            }
        }
    };

    loadUnreadCounts = async () => {
        const userId = this.props.match.params.userId;
        const response = await getUnreadMessagesCount(userId);

        if (response && response.errCode === 0) {
            const unreadCounts = response.unreadCounts || {}; // Assume response.unreadCounts is an object { partnerId: count }
            this.setState({ unreadCounts });
        }
    };

    groupMessagesByPartner = (messages) => {
        const conversations = {};
        const userId = parseInt(this.props.match.params.userId, 10);

        messages.forEach((message) => {
            const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
            const partnerName = partnerId === message.receiverId ? "Receiver Name" : "Nurse";

            if (!conversations[partnerId]) {
                conversations[partnerId] = {
                    partnerId,
                    partnerName,
                    lastMessage: message.messageText,
                };
            } else {
                conversations[partnerId].lastMessage = message.messageText;
            }
        });

        return Object.values(conversations);
    };

    openConversation = async (nurse) => {
        this.setState({ selectedConversation: nurse });
        const userId = this.props.match.params.userId;

        // Mark messages as read for the selected Nurse
        await markMessagesAsRead(nurse.id, userId);

        // Update unread counts immediately after marking messages as read
        this.setState((prevState) => ({
            unreadCounts: {
                ...prevState.unreadCounts,
                [nurse.id]: 0, // Reset unread count for this Nurse
            },
        }));
    };

    closeConversation = () => {
        this.setState({ selectedConversation: null });
    };

    render() {
        const { nurses, conversations, selectedConversation, unreadCounts } = this.state;

        return (
            <div className="patient-messages-container">
                <HomeHeader />
                <h2>Messages with Nurses</h2>
                <div className="conversations-list">
                    {nurses.length === 0 ? (
                        <div>No nurses available.</div>
                    ) : (
                        <ul>
                            {nurses.map((nurse, index) => (
                                <li key={index} onClick={() => this.openConversation(nurse)}>
                                    <span>{`${nurse.firstName} ${nurse.lastName}`}</span>
                                    {/* Display the unread message count for each Nurse if available */}
                                    {unreadCounts[nurse.id] > 0 && (
                                        <span className="unread-count">{unreadCounts[nurse.id]}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedConversation && (
                    <PatientMessageBox
                        senderId={parseInt(this.props.match.params.userId, 10)}
                        receiverId={selectedConversation.id}
                        receiverName={`${selectedConversation.firstName} ${selectedConversation.lastName}`}
                        onClose={this.closeConversation}
                    />
                )}
            </div>
        );
    }
}

export default PatientMessages;
