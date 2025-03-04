import { useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar/NavBar";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo, useRef } from "react";
import { getUsername } from "../../hooks/getUsername";
import './MessagingPage.css';
import { useMessages } from "../../hooks/getMessages";
import { IconButton } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { sendMessage } from "../../hooks/sendMessage";  
import { censorBadWords } from "../../regex/checkBadWords";

const MessageInput = ({ sendMessage, username, friendUsername }) => {
    const [messageInput, setMessageInput] = useState("");

    const handleKeyDown = async (event) => {
        if (event.key === "Enter" && messageInput.trim()) {
            try {
                const messageToSend = censorBadWords(messageInput)
                await sendMessage(username, friendUsername, messageToSend);
                setMessageInput(""); 
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <InputGroup className="mb-3 Send-message-input" size="lg">
            <FormControl
                placeholder="Enter message ..."
                value={messageInput}
                type="input"
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button 
                onClick={() => {
                    if (messageInput.trim()) {
                        const messageToSend = censorBadWords(messageInput)
                        sendMessage(username, friendUsername, messageToSend);
                        setMessageInput(""); 
                    }
                }}
            >
                Send
            </Button>
        </InputGroup>
    );
};

export const MessagingPage = () => {
    const location = useLocation();
    const { friendUsername } = location.state || {};

    const { user } = useAuth();
    const currentUserEmail = user?.email;

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const messagesListRef = useRef(null);  

    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User");
            }
        };

        fetchUsername();
    }, [currentUserEmail]);

    const { messages } = useMessages(username, friendUsername);

    // Memoize the message list to avoid unnecessary re-renders
    const memoizedMessages = useMemo(() => messages, [messages]);

    const goBack = () => {
        navigate("/friends");
    };

    // Scroll to bottom of MessagesList whenever the messages change
    useEffect(() => {
        if (messagesListRef.current) {
            messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
    }, [memoizedMessages]);  // Trigger scroll every time messages change

    return (
        <>
            <NavBar />
            <div className="MessagingPage">
                <div className="MessagingPage-overlay">
                    <div className="MessagingPage-top-section">
                        <IconButton onClick={goBack} className="Back-button">
                            <ArrowBackIos sx={{ color: 'white' }} />
                        </IconButton>

                        <h1>
                            <span className="MessagingPage-Friend-Profile-picture">
                                <h1 className="MessagingPage-Friend-Profile-picture-text">
                                    {friendUsername.charAt(0)}
                                </h1>
                            </span>
                            {friendUsername}
                        </h1>
                    </div>

                    {!username ? (
                        <p>Loading messages...</p>
                    ) : (
                        // CHECK BAD WORDS
                        <div className="MessagesList" ref={messagesListRef}>
                            {memoizedMessages.map((message) => {
                                const isSentByCurrentUser = message.sender === username;
                                const messageClass = isSentByCurrentUser ? "sent" : "received";
                                const key = message.createdAt ? message.createdAt.seconds : message.message;

                                let timeString = "";
                                if (message.createdAt?.seconds) {
                                    const date = new Date(message.createdAt.seconds * 1000);
                                    timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                }    

                                return (
                                    <div key={key} className={`Message ${messageClass}`}>
                                        <p>{message.message}</p>
                                        <div className="Message-timestamp">
                                            {timeString}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="MessagingPage-bottom-section">
                        <MessageInput sendMessage={sendMessage} username={username} friendUsername={friendUsername} />
                    </div>
                </div>
            </div>
        </>
    );
};
