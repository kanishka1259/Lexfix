import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getSocket, sendMessage, leaveRoom } from '../services/socket';

const CollaborationRoom = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [room, setRoom] = useState(location.state?.room || { id: roomId, name: 'Loading...', participants: [] });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !socket.connected) {
            // Redirect to lobby if no socket connection (page refresh case)
            navigate('/module4/collaboration');
            return;
        }

        // Listeners
        const handleMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
        };

        const handleUserJoined = ({ user, room: updatedRoom }) => {
            setRoom(updatedRoom);
            setMessages(prev => [...prev, { system: true, text: `${user.name} joined the room.` }]);
        };

        const handleUserLeft = ({ userId }) => {
            // We'd ideally need the updated room list or filter participants locally
            setRoom(prev => ({
                ...prev,
                participants: prev.participants.filter(p => p.id !== userId)
            }));
            // Can't easily get name of user who left unless we store map. 
            setMessages(prev => [...prev, { system: true, text: `A user left the room.` }]);
        };

        socket.on("receive_message", handleMessage);
        socket.on("user_joined", handleUserJoined);
        socket.on("user_left", handleUserLeft);

        return () => {
            socket.off("receive_message", handleMessage);
            socket.off("user_joined", handleUserJoined);
            socket.off("user_left", handleUserLeft);
        };
    }, [navigate, roomId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(roomId, input);
            setInput('');
        }
    };

    const handleLeave = () => {
        leaveRoom(roomId);
        navigate('/module4/collaboration');
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row gap-4">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-lg">{room.name}</h2>
                    <button onClick={handleLeave} className="text-red-600 hover:text-red-800 text-sm font-medium">Leave Room</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`max-w-[80%] ${msg.system ? 'w-full text-center' : ''} ${msg.userId === getSocket()?.auth?.token ? 'ml-auto' : ''}`}>
                            {/* Note: socket.auth doesn't have ID. We can compare msg.userId with some stored ID but for now simple styling */}
                            {msg.system ? (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{msg.text}</span>
                            ) : (
                                <div className={`p-3 rounded-lg ${msg.userId === getSocket()?.id ? 'bg-blue-100' : 'bg-white border'}`}>
                                    <p className="text-xs font-bold text-gray-700 mb-1">{msg.userName}</p>
                                    <p className="text-sm">{msg.text}</p>
                                    <span className="text-[10px] text-gray-400 block mt-1 text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button type="submit" className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700">
                        {/* Send Icon */}
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>

            {/* Participants Panel */}
            <div className="w-full md:w-64 bg-white border rounded-lg shadow-sm p-4 hidden md:block">
                <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Participants ({room.participants?.length || 0})</h3>
                <ul className="space-y-2">
                    {room.participants && room.participants.map(p => (
                        <li key={p.id || p.socketId} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{p.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CollaborationRoom;
