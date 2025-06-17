import express from 'express';
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { runSocket } from './src/socket/socket.js';




// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')));

await bootstrap(app, express)
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

runSocket(server)



