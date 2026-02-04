// services/api.js
const API_URL = 'http://localhost:5000/api';

export const api = {
    // Session APIs
    startSession: async () => {
        const response = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    },

    endSession: async (sessionId, data) => {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/end`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    // Progress APIs
    getProgress: async () => {
        const response = await fetch(`${API_URL}/progress`);
        return response.json();
    },

    updateProgress: async (lessonId, data) => {
        const response = await fetch(`${API_URL}/progress/${lessonId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};
