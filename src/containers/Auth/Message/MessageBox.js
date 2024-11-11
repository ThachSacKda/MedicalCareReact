// MessageBox.js

import React, { Component } from 'react';
import { sendMessage, getMessagesBetweenUsers } from '../../../services/userService';
import './MessageBox.scss';

class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            newMessage: ''
        };
        this.messageInterval = null;
    }

    componentDidMount() {
        this.loadMessages();
        this.startMessageInterval();
    }

    componentWillUnmount() {
        this.clearMessageInterval();
    }

    startMessageInterval = () => {
        // Load messages every 5 seconds
        this.messageInterval = setInterval(this.loadMessages, 5000);
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
            timestamp: new Date().toISOString()
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

    formatTime(sentAt) {
        const date = new Date(sentAt);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    render() {
        const { messages, newMessage } = this.state;
        const { receiverName } = this.props;

        return (
            <div className="message-box-modal">
                <div className="message-box">
                    <div className="message-header">
                        <span className="receiver-name">{receiverName}</span>
                        <button className="close-btn" onClick={this.props.onClose}>&times;</button>
                    </div>
                    <div className="messages-list">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-item ${msg.senderId === this.props.senderId ? 'sent' : 'received'}`}>
                                <p>{msg.messageText}</p>
                                <span className="message-time">{this.formatTime(msg.sentAt)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress} // Enter key to send message
                            placeholder="Type a message..."
                        />
                        <button onClick={this.handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageBox;
