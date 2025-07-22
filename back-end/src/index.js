import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import instructorRoutes from './routes/instructorRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initializeSocket } from './utils/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initializeSocket(io);

app.use(cors());
app.use(express.json());

app.use('/api/instructor', instructorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/messages', messageRoutes);
const PORT = process.env.PORT || 6001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
