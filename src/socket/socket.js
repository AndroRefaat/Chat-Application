import { Server } from "socket.io";



export const runSocket = function (server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    let socketsConnected = new Set();


    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socketsConnected.add(socket.id);

        io.emit('clients-total', socketsConnected.size);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            socketsConnected.delete(socket.id);
            io.emit('clients-total', socketsConnected.size);
        });

        socket.on('message', (data) => {
            socket.broadcast.emit('chat-message', data);
        });

        socket.on('feedback', (data) => {
            socket.broadcast.emit('feedback', data);
        });

        socket.on('join', (username) => {
            socket.username = username;
            // You can use socket.username for further logic
        });
    });

}




