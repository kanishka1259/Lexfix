import React, { useEffect, useState } from 'react';
import { initiateSocketConnection, disconnectSocket, subscribeToRoomList, createRoom, joinRoom, getSocket } from '../services/socket';
import { useNavigate } from 'react-router-dom';

const CollaborationLobby = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem('token');

        if (!token || token === 'null' || token === 'undefined') {
            // Try 'user' key (set by Login.jsx)
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const parsed = JSON.parse(userStr);
                    token = parsed.token || parsed.data?.token;
                } catch (e) {
                    console.error("Error parsing user from localStorage", e);
                }
            }
        }

        // Fallback to 'userInfo' (legacy/alternative)
        if (!token || token === 'null' || token === 'undefined') {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const parsed = JSON.parse(userInfo);
                    token = parsed.token || parsed.data?.token;
                } catch (e) {
                    console.error("Error parsing userInfo", e);
                }
            }
        }

        if (token) {
            initiateSocketConnection(token);

            const socket = getSocket();
            if (socket) {
                socket.on("rooms_list", (updatedRooms) => {
                    setRooms(updatedRooms);
                });

                socket.on("room_joined", (room) => {
                    navigate(`/module4/collaboration/${room.id}`, { state: { room } });
                });
            }
        }

        return () => {
            // Do not disconnect when unmounting to navigate to a room.
            // Let the App or higher level component handle disconnect, or handle it when logging out.
            // disconnectSocket(); 
        };
    }, [navigate]);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            createRoom(newRoomName);
            setNewRoomName('');
        }
    };

    const handleJoinRoom = (roomId) => {
        joinRoom(roomId);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#5A4A42] mb-8">Collaboration Study Groups</h2>

            {/* Create Room */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
                <h3 className="text-lg font-bold text-[#5A4A42] mb-4 flex items-center gap-2">
                    <span className="bg-[#F5EBE0] p-1 rounded text-[#8B5E3C]">➕</span> Create a New Group
                </h3>
                <form onSubmit={handleCreateRoom} className="flex gap-4">
                    <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g., 'Phonics Level 2 Study'"
                        className="flex-1 rounded-lg border-gray-200 border bg-[#FAFAFA] px-4 py-3 focus:ring-2 focus:ring-[#C08B76] focus:border-[#C08B76] outline-none transition-all"
                        required
                    />
                    <button type="submit" className="bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D4930] transition-colors shadow-sm">
                        Create Group
                    </button>
                </form>
            </div>

            {/* Room List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <span className="text-4xl block mb-2">🌱</span>
                        <p className="text-gray-400 font-medium">No active groups yet.</p>
                        <p className="text-sm text-gray-400">Be the first to create one!</p>
                    </div>
                ) : (
                    rooms.map(room => (
                        <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#F5EBE0] transition-all flex flex-col justify-between h-48 group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-[#5A4A42] line-clamp-1">{room.name}</h4>
                                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Live</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                    {room.participants ? room.participants.length : 0} online
                                </p>
                            </div>
                            <button
                                onClick={() => handleJoinRoom(room.id)}
                                className="w-full bg-[#F5EBE0] text-[#5A4A42] py-2 rounded-lg font-bold text-sm hover:bg-[#EEDBC0] transition-colors group-hover:bg-[#8B5E3C] group-hover:text-white"
                            >
                                Join Session
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CollaborationLobby;
