import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import ChatMessage from "./ChatMessage.jsx";
import {Button, TextField, Box, Paper} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ChatPage({ username }) {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const messageInputRef = useRef();

    useEffect(() => {
        const newClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                const joinMessage = {
                    sender: username,
                    type: 'CONNECT',
                };
                console.log(messages)
                newClient.publish({ destination: '/app/chat.add-user', body: JSON.stringify(joinMessage) });
                newClient.subscribe('/topic/public', message => {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                });
            },
            onDisconnect: () => {
                if (newClient.connected) {
                    const leaveMessage = {
                        sender: username,
                        type: 'DISCONNECT',
                    };
                    newClient.publish({ destination: '/app/chat.add-user', body: JSON.stringify(leaveMessage) });
                }
            },
        });

        newClient.activate();
        setClient(newClient);

        return () => {
            newClient.deactivate();
        };
    }, [username]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (messageInputRef.current.value && client) {
            const chatMessage = {
                sender: username,
                text: messageInputRef.current.value,
                type: 'CHAT',
            };
            client.publish({ destination: '/app/chat.send-message', body: JSON.stringify(chatMessage) });
            messageInputRef.current.value = '';
        }
    };
        return (
            <Box sx={{
                width: '100%',
                margin: 'auto',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        mb: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column-reverse'
                    }}
                >
                    <Box>
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} username={username} />
                        ))}
                    </Box>
                </Paper>
                <Paper component="form" onSubmit={sendMessage} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                    <TextField
                        inputRef={messageInputRef}
                        fullWidth
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                    />
                    <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                        Send
                    </Button>
                </Paper>
            </Box>
        );
}

export default ChatPage;
