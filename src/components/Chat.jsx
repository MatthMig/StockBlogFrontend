import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { UserDetailsModal, WarningModal } from "./Modals";
import { deleteMessage, fetchMessages, fetchUserDetails, postMessage } from "./api";
import { getTokens } from "./auth";

export default function Chat({ asset }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const chatWindowRef = useRef(null);

    const updateMessages = useCallback(() => {
        fetchMessages(asset)
            .then(newMessages => {
                const updatedMessages = newMessages.map(message => ({
                    username: message.user.name,
                    userMail: message.userMail,
                    content: message.content,
                    id: message.id
                }));
                setMessages(updatedMessages);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching messages:", error);
            });
    }, [asset]);

    useEffect(() => {
        if (asset) {
            setIsLoading(true);
            updateMessages();
            // Start polling for new messages every second
            const intervalId = setInterval(updateMessages, 1000);
            // Clean up the interval on component unmount
            return () => {
                clearInterval(intervalId);
                setIsLoading(false);
            };
        }
        setIsLoading(false);
    }, [asset, updateMessages]);

    useEffect(() => {
        // Scroll to the bottom when the chat window or sidebar is displayed
        scrollToBottom();
    }, [messages]); // Run this effect when new messages are received

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            const token = getTokens().token;
            if (token === null) {
                setShowWarningModal(true);
                return;
            }
            const newMessage = { text: messageInput, token: token };
            // Send the message to the server
            postMessage(asset, newMessage)
                .then(() => {
                    // Update the messages state with the new message locally only if no error occurred
                    const localMessage = { content: newMessage.text, username: getTokens().name }
                    setMessages(prevMessages => [...prevMessages, localMessage]);
                    updateMessages();
                })
                .catch(error => {
                    console.error("Error posting message:", error);
                })
                .finally(() => {
                    // Clear the input field regardless of whether an error occurred
                    setMessageInput('');
                });
        }
    };

    const removeMessage = (id) => {
        deleteMessage(id)
            .then(() => {
                // Remove the message from the local state
                setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
            })
            .catch(error => {
                console.error("Error deleting message:", error);
            });
    };

    const handleKeyPress = (e) => {
        if (asset && e.key === "Enter") {
            sendMessage();
        }
    };

    const handleChange = (e) => {
        setMessageInput(e.target.value);
    };

    const handleUserClick = async (userMail) => {
        const userDetails = await fetchUserDetails(userMail);
        setSelectedUser(userDetails);
        setShowUserModal(true);
    };

    const scrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    };

    const userRole = getTokens().role;

    return (
        <Row className="chat-box">
            <h1>Chat</h1>
            <div ref={chatWindowRef} className="chat-messages">
                {isLoading ? (
                    <div className="spinner-chat">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : ( asset ? (
                    messages.map((message, index) => (
                        <div key={index} className="d-flex justify-content-between">
                            <div>
                                {userRole === 'admin' ? (
                                    <strong onClick={() => handleUserClick(message.userMail)} className="link">
                                        {message.username}:
                                    </strong>
                                ) : (
                                    <strong>{message.username}:</strong>
                                )}
                                {message.content}
                            </div>
                            {userRole === 'admin' && (
                                <Button
                                    variant="secondary"
                                    className="ml-2 rounded-circle btn-xs"
                                    onClick={() => removeMessage(message.id)}
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <em>Please select a symbol to start a chat.</em>
                ))}
            </div>
            <Row className="bar">
                <Col className="input-field">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={handleChange}
                        onKeyUp={handleKeyPress}
                    />
                </Col>
                <Col xs="auto" className="send-button">
                    <button
                        className={`btn ${asset ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={sendMessage}
                        disabled={!asset}
                    >
                        Send
                    </button>
                </Col>
            </Row>
            <WarningModal
                show={showWarningModal}
                handleClose={() => setShowWarningModal(false)}
                text={'You must be logged in to post messages.'}
            />
            <UserDetailsModal
                show={showUserModal}
                handleClose={() => {
                    setShowUserModal(false);
                    updateMessages();
                }}
                user={selectedUser}
                currentUser={{ role: userRole }}
            />
        </Row>
    );
}

Chat.propTypes = {
    asset: PropTypes.object,
};
