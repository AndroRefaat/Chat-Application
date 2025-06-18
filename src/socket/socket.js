import { Server } from "socket.io";
import { saveMessage, getMessagesForSocket } from './messages/message.service.js';

export const runSocket = function (server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });

    let socketsConnected = new Set();


    const emitClientCount = () => {
        io.emit('clients-total', socketsConnected.size);
        console.log(`Total clients connected: ${socketsConnected.size}`);
    };

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Add socket to connected set
        socketsConnected.add(socket.id);
        emitClientCount();

        // Load previous messages when user connects
        socket.on('load-messages', async (room = 'general') => {
            try {
                const messages = await getMessagesForSocket(room, 50);
                socket.emit('previous-messages', messages);
            } catch (error) {
                console.error('Error loading messages:', error);
                socket.emit('error', 'Failed to load previous messages');
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
            socketsConnected.delete(socket.id);
            emitClientCount();
        });

        socket.on('message', async (data) => {
            try {
                // Save message to database
                const savedMessage = await saveMessage(data.name, data.message, data.room || 'general');

                // Broadcast message to all other clients
                socket.broadcast.emit('chat-message', {
                    ...data,
                    _id: savedMessage._id,
                    createdAt: savedMessage.createdAt
                });

                // Send confirmation to sender
                socket.emit('message-sent', {
                    ...data,
                    _id: savedMessage._id,
                    createdAt: savedMessage.createdAt
                });
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        socket.on('feedback', (data) => {
            socket.broadcast.emit('feedback', data);
        });

        socket.on('join', (username) => {
            socket.username = username;
            console.log(`User ${username} joined with socket ${socket.id}`);
        });

        // Handle connection errors
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Handle reconnection
        socket.on('reconnect', (attemptNumber) => {
            console.log(`Socket reconnected after ${attemptNumber} attempts`);
        });
    });

    // Handle server shutdown
    process.on('SIGINT', () => {
        console.log('Shutting down socket server...');
        io.close(() => {
            console.log('Socket server closed');
            process.exit(0);
        });
    });
}




