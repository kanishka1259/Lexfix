import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createRoom, joinRoom, leaveRoom, removeUserFromAllRooms, getAllRooms } from "./room.manager.js";
import User from "../../../backend/models/User.js";

const PORT = 5001; // Separate port for socket server

export const startSocketServer = () => {
    console.log(`[Socket] Starting Socket.io server on port ${PORT}...`);

    const io = new Server(PORT, {
        cors: {
            origin: "http://localhost:5173", // Frontend URL
            methods: ["GET", "POST"]
        }
    });

    // JWT Auth Middleware
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "lexfix-secret-key-2024");

            // Fetch user details to get name
            const user = await User.findById(decoded.id).select("name email role");

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = {
                id: user._id.toString(),
                name: user.name,
                role: user.role
            };
            next();
        } catch (err) {
            console.error("Socket auth error:", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] User connected: ${socket.user.name} (${socket.id})`);

        // Send list of rooms on connect
        socket.emit("rooms_list", getAllRooms());

        socket.on("create_room", ({ name }) => {
            const roomId = `room-${Date.now()}`;
            const room = createRoom(roomId, name, socket.user);
            console.log(`[Socket] Room created: ${name} (${roomId})`);

            // Broadcast new room list
            io.emit("rooms_list", getAllRooms());
        });

        socket.on("join_room", ({ roomId }) => {
            const user = { id: socket.user.id, name: socket.user.name, socketId: socket.id };
            const room = joinRoom(roomId, user);
            if (room) {
                socket.join(roomId);
                // Notify room
                io.to(roomId).emit("user_joined", { user, room });
                socket.emit("room_joined", room);
                console.log(`[Socket] ${user.name} joined ${roomId}`);
            }
        });

        socket.on("leave_room", ({ roomId }) => {
            leaveRoom(roomId, socket.user.id);
            socket.leave(roomId);
            io.to(roomId).emit("user_left", { userId: socket.user.id });
        });

        socket.on("send_message", ({ roomId, message }) => {
            // Broadcast to room
            io.to(roomId).emit("receive_message", {
                id: Date.now(),
                userId: socket.user.id,
                userName: socket.user.name,
                text: message,
                timestamp: new Date()
            });
        });

        socket.on("disconnect", () => {
            const updates = removeUserFromAllRooms(socket.id);
            updates.forEach(({ roomId, isEmpty }) => {
                if (!isEmpty) {
                    io.to(roomId).emit("user_left", { userId: socket.user.id });
                } else {
                    io.emit("rooms_list", getAllRooms()); // Room deleted
                }
            });
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });

    console.log(`✅ Socket.io server ready on port ${PORT}`);
};
