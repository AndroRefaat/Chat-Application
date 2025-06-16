import express from 'express';
import { Server } from 'socket.io';
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

await bootstrap(app, express)
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
let socketsConnected = new Set();

io.on('connection', onConnected)

function onConnected(socket) {
    console.log(`Client connected: ${socket.id}`);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        // console.log(data);
        socket.broadcast.emit('chat-message', data)
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    })
}