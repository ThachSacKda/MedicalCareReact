// components/PatientMessages.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllMessagesForUser, getUnreadMessagesCount, markMessagesAsRead } from '../../../services/userService';
import PatientMessageBox from './PatientMessageBox';
import './PatientMessages.scss';
import HomeHeader from '../../HomePage/HomeHeader';

class PatientMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            selectedConversation: null,
            unreadCounts: {}, // Track unread message counts for each partner
        };
        this.unreadInterval = null; // Interval to periodically check unread messages
    }

    async componentDidMount() {
        await this.loadConversations();
        await this.loadUnreadCounts();

        // Thiết lập polling để gọi loadUnreadCounts mỗi 5 giây
        this.unreadInterval = setInterval(this.loadUnreadCounts, 5000);
    }

    componentWillUnmount() {
        // Xóa interval khi component bị unmount
        if (this.unreadInterval) {
            clearInterval(this.unreadInterval);
        }
    }

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

        console.log("Unread messages response:", response); // Debug: Check unread messages response

        if (response && response.errCode === 0) {
            const unreadCounts = response.unreadCounts || {}; // Assume response.unreadCounts is an object { partnerId: count }
            console.log("Unread counts data after processing:", unreadCounts); // Debug: Log unread counts data after processing
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

    openConversation = async (conversation) => {
        this.setState({ selectedConversation: conversation });
        const { partnerId } = conversation;
        const userId = this.props.match.params.userId;

        // Mark only messages from `partnerId` to the user as read
        await markMessagesAsRead(partnerId, userId);

        // Update unread counts immediately after marking as read for this partner
        this.setState((prevState) => ({
            unreadCounts: {
                ...prevState.unreadCounts,
                [partnerId]: 0, // Set unread count for this partner to 0 after marking as read
            },
        }));
    };

    closeConversation = () => {
        this.setState({ selectedConversation: null });
    };

    render() {
        const { conversations, selectedConversation, unreadCounts } = this.state;
        console.log("Render unread counts:", unreadCounts); // Debugging output to verify unread counts

        return (
            <div className="patient-messages-container">
                <HomeHeader />
                <h2>Your Messages</h2>
                <div className="conversations-list">
                    {conversations.length === 0 ? (
                        <div>No messages available.</div>
                    ) : (
                        <ul>
                            {conversations.map((conv, index) => (
                                <li key={index} onClick={() => this.openConversation(conv)}>
                                    <span>{conv.partnerName}</span>
                                    {/* Hiển thị số lượng tin nhắn chưa đọc cho từng đối tác nếu có */}
                                    {unreadCounts[conv.partnerId] > 0 && (
                                        <span className="unread-count">{unreadCounts[conv.partnerId]}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedConversation && (
                    <PatientMessageBox
                        senderId={parseInt(this.props.match.params.userId, 10)}
                        receiverId={selectedConversation.partnerId}
                        receiverName={selectedConversation.partnerName}
                        onClose={this.closeConversation}
                    />
                )}
            </div>
        );
    }
}

export default PatientMessages;
