// components/PatientMessageBox.js

import React, { Component } from 'react';
import { sendMessage, getMessagesBetweenUsers } from '../../../services/userService';
import './PatientMessageBox.scss';

class PatientMessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            newMessage: ''
        };
        this.messageInterval = null;
    }

    async componentDidMount() {
        await this.loadMessages();
        this.startMessageInterval();
    }

    componentWillUnmount() {
        this.clearMessageInterval();
    }

    startMessageInterval = () => {
        this.messageInterval = setInterval(this.loadMessages, 1000);
    };

    clearMessageInterval = () => {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
    };

    loadMessages = async () => {
        const { senderId, receiverId } = this.props;
        const response = await getMessagesBetweenUsers(senderId, receiverId);

        if (response && response.errCode === 0) {
            this.setState({ messages: response.messages });
        }
    };

    handleSendMessage = async () => {
        const { senderId, receiverId } = this.props;
        const { newMessage } = this.state;

        if (newMessage.trim() === '') return;

        const data = {
            senderId,
            receiverId,
            messageText: newMessage,
            timestamp: new Date().toISOString(),
        };

        const response = await sendMessage(data);
        if (response && response.errCode === 0) {
            this.setState({ newMessage: '' });
            await this.loadMessages(); // Refresh messages after sending a new one
        }
    };

    handleInputChange = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSendMessage();
        }
    };

    render() {
        const { messages, newMessage } = this.state;
        const { receiverName, onClose } = this.props;

        return (
            <div className="patient-message-box">
                <div className="message-header">
                    <span>{receiverName}</span>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-item ${msg.senderId === this.props.senderId ? 'sent' : 'received'}`}>
                            <p>{msg.messageText}</p>
                            <span className="message-time">{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ""}</span>
                        </div>
                    ))}
                </div>

                <div className="message-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={this.handleInputChange}
                        onKeyPress={this.handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <button onClick={this.handleSendMessage}>Send</button>
                </div>
            </div>
        );
    }
}

export default PatientMessageBox;
