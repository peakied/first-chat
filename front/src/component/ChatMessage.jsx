import Avatar from 'react-avatar';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

function ChatMessage({ message, username }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isOwnMessage = message.sender === username;

    if (message.type !== "CHAT") {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', margin: '10px 0', color: 'text.secondary'}}>
                {message.sender} {message.type === "CONNECT" ? "connected" : "disconnected"}
            </Box>
        );
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: isOwnMessage ? 'flex-end' : 'flex-start', margin: '10px 0', maxWidth: '100%'}}>
            <Box sx={{display: 'flex', flexDirection: isOwnMessage ? 'row-reverse' : 'row', alignItems: 'center', gap: 1}}>
                <Avatar name={message.sender} size={isMobile ? "30" : "35"} round={true} />
                <Typography variant="subtitle2">{message.sender}</Typography>
            </Box>
            <Box sx={{backgroundColor: isOwnMessage ? 'primary.main' : 'secondary.main', color: 'common.white', borderRadius: '12px', padding: '10px', maxWidth: isMobile ? '80%' : '50%', wordBreak: 'break-word', boxShadow: 1}}>
                <Typography variant="body2">{message.text}</Typography>
            </Box>
        </Box>
    );
}

export default ChatMessage;