import { io } from "socket.io-client";

let socket;

export const initiateSocketConnection = (token) => {
    socket = io("http://localhost:5001", {
        auth: {
            token,
        },
    });
    console.log("Connecting to socket...");
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};

export const subscribeToRoomList = (cb) => {
    if (!socket) return;
    socket.on("rooms_list", (rooms) => {
        cb(rooms);
    });
};

export const createRoom = (name) => {
    if (!socket) return;
    socket.emit("create_room", { name });
};

export const joinRoom = (roomId) => {
    if (!socket) return;
    socket.emit("join_room", { roomId });
};

export const leaveRoom = (roomId) => {
    if (!socket) return;
    socket.emit("leave_room", { roomId });
};

export const sendMessage = (roomId, message) => {
    if (!socket) return;
    socket.emit("send_message", { roomId, message });
};

export const subscribeToMessages = (cb) => {
    if (!socket) return;
    socket.on("receive_message", (msg) => {
        cb(msg);
    });
};

export const subscribeToRoomUpdates = (cb) => {
    if (!socket) return;
    // For user joined/left/room joined events
    socket.on("room_joined", (room) => cb({ type: "ROOM_JOINED", data: room }));
    socket.on("user_joined", (data) => cb({ type: "USER_JOINED", data }));
    socket.on("user_left", (data) => cb({ type: "USER_LEFT", data }));
};

export const getSocket = () => socket;
