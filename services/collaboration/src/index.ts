import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis'; // Changed to standard import
import { createAdapter } from '@socket.io/redis-adapter';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Utility for path resolution in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
const httpServer = createServer(app);

/**
 * Redis Connection Configuration
 * 'maxRetriesPerRequest: null' is essential for the Socket.IO adapter.
 */
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null, 
  enableReadyCheck: true,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
};

const connectionString = process.env.REDIS_URL;

/**
 * Universal Constructor Fix:
 * We use the 'Redis' constructor directly. 
 * This satisfies both ts-node and ESM runtimes.
 */
const pubClient = connectionString 
  ? new Redis(connectionString, { maxRetriesPerRequest: null }) 
  : new Redis(redisOptions);

const subClient = pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.adapter(createAdapter(pubClient, subClient));

const collabNamespace = io.of("/collaboration");

collabNamespace.on('connection', (socket) => {
  const { roomId, userId, role } = socket.handshake.query;

  if (!roomId || !userId) {
    socket.disconnect();
    return;
  }

  socket.join(roomId as string);
  console.log(`[LexFix Collab] User ${userId} joined room ${roomId}`);

  socket.on('draw-update', (delta) => {
    socket.to(roomId as string).emit('remote-draw', delta);
  });

  socket.on('push-teaching-prompt', (prompt) => {
    if (role === 'EDUCATOR' || role === 'PARENT_EDUCATOR') {
      socket.to(roomId as string).emit('new-prompt', prompt);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[LexFix Collab] User ${userId} left`);
  });
});

const PORT = process.env.COLLAB_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`🚀 LexFix Collaboration Service active on port ${PORT}`);
});