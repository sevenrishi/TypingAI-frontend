import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import resultRoutes from './routes/resultRoutes';
import sessionRoutes from './routes/sessionRoutes';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { attachRoomHandlers } from './sockets/rooms';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/typing';
const PORT = Number(process.env.PORT) || 5000;

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/sessions', sessionRoutes);

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });
attachRoomHandlers(io);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
