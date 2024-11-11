// components/PatientMessages.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllMessagesForUser } from '../../../services/userService';
import PatientMessageBox from './PatientMessageBox';
import './PatientMessages.scss';
import HomeHeader from '../../HomePage/HomeHeader'; // Import the HomeHeader component

class PatientMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            selectedConversation: null,
        };
    }

    async componentDidMount() {
        await this.loadConversations();
    }

    loadConversations = async () => {
        const userId = this.props.match.params.userId; 
        if (userId) {
            console.log("Loading conversations for userId:", userId);
            const response = await getAllMessagesForUser(userId);
            console.log("API Response in PatientMessages:", response);

            if (response && response.errCode === 0) {
                const conversations = this.groupMessagesByPartner(response.messages);
                console.log("Grouped Conversations:", conversations);
                this.setState({ conversations });
            } else {
                console.error("Failed to load messages or unexpected response format:", response);
            }
        } else {
            console.error("User ID is missing in URL.");
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

    openConversation = (conversation) => {
        this.setState({
            selectedConversation: conversation,
        });
    };

    closeConversation = () => {
        this.setState({
            selectedConversation: null,
        });
    };

    render() {
        const { conversations, selectedConversation } = this.state;
        console.log("conversation:", conversations);

        return (
            <div className="patient-messages-container">
                <HomeHeader /> {/* Add the HomeHeader component here */}
                
                <h2>Your Messages</h2>
                <div className="conversations-list">
                    {conversations.length === 0 ? (
                        <div>No messages available.</div>
                    ) : (
                        <ul>
                            {conversations.map((conv, index) => (
                                <li key={index} onClick={() => this.openConversation(conv)}>
                                    <span>{conv.partnerName}</span>
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
