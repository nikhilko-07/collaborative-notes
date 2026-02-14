import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import notesRoutes from './routes/note.routes.js';
import { setupSockets } from './sockets/notesSocket.js';
import activityRoutes from "./routes/activity.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/activity', activityRoutes);

setupSockets(io);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
