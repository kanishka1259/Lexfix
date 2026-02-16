// Simple in-memory room manager
const rooms = new Map(); // roomId -> Set(userIds) or Set(socketIds)
const roomDetails = new Map(); // roomId -> { name, creator, participants: [] }

export const createRoom = (roomId, name, creator) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
        roomDetails.set(roomId, {
            id: roomId,
            name,
            creator,
            participants: [] // Array of { id, name, socketId }
        });
        return roomDetails.get(roomId);
    }
    return null;
};

export const getRoom = (roomId) => {
    return roomDetails.get(roomId);
};

export const getAllRooms = () => {
    return Array.from(roomDetails.values());
};

export const joinRoom = (roomId, user) => {
    const room = roomDetails.get(roomId);
    if (room) {
        // Check if already joined
        const exists = room.participants.find(p => p.id === user.id);
        if (!exists) {
            room.participants.push(user);
        } else {
            // Update socketId if rejoining
            exists.socketId = user.socketId;
        }
        return room;
    }
    return null;
};

export const leaveRoom = (roomId, userId) => {
    const room = roomDetails.get(roomId);
    if (room) {
        room.participants = room.participants.filter(p => p.id !== userId);
        // If empty, delete room? 
        if (room.participants.length === 0) {
            rooms.delete(roomId);
            roomDetails.delete(roomId);
            return null; // Room deleted
        }
        return room;
    }
    return null;
};

// Cleanup on disconnect
export const removeUserFromAllRooms = (socketId) => {
    const affectedRooms = [];
    roomDetails.forEach(room => {
        const participantIndex = room.participants.findIndex(p => p.socketId === socketId);
        if (participantIndex !== -1) {
            room.participants.splice(participantIndex, 1);
            if (room.participants.length === 0) {
                rooms.delete(room.id);
                roomDetails.delete(room.id);
                affectedRooms.push({ roomId: room.id, isEmpty: true });
            } else {
                affectedRooms.push({ roomId: room.id, isEmpty: false, room });
            }
        }
    });
    return affectedRooms;
};
