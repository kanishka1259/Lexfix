import React, { useState } from 'react';
import axios from 'axios';

const PerformanceSubmit = () => {
    const [formData, setFormData] = useState({
        lessonId: '',
        moduleName: 'Module 1',
        difficulty: 'medium',
        score: '',
        totalQuestions: '',
        timeTakenSeconds: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token'); // Assuming standard token storage
            // If token is inside a JSON object in localStorage (e.g. 'user'), adjust accordingly.
            // Based on authController login: res.data.data.token
            // Codebase check needed: where is token stored? usually 'token' or 'userInfo'.
            // I'll assume standard 'token' for now or check Authorization header practice using 'api' service if it exists.
            // But since I must be isolated, I'll use raw axios with header.

            // Re-checking login response:
            // res.json({ success: true, data: { ... token } })
            // Usually frontend stores this in localStorage.getItem('userInfo') -> JSON.parse -> .token
            // or just 'token'. 
            // I'll try to read it safely.

            let tokenToUse = localStorage.getItem('token');
            if (!tokenToUse) {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const parsed = JSON.parse(userInfo);
                    tokenToUse = parsed.token || parsed.data?.token;
                }
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`
                }
            };

            const payload = {
                ...formData,
                score: Number(formData.score),
                totalQuestions: Number(formData.totalQuestions),
                timeTakenSeconds: Number(formData.timeTakenSeconds)
            };

            const response = await axios.post('http://localhost:5000/api/module4/performance/record', payload, config);
            setMessage('Performance recorded successfully!');
            // Reset form or redirect
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting performance');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Record Performance</h2>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="lessonId" className="block text-sm font-medium text-gray-700">Lesson ID</label>
                    <input type="text" id="lessonId" name="lessonId" value={formData.lessonId} onChange={handleChange} required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                </div>

                <div>
                    <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">Module Name</label>
                    <select id="moduleName" name="moduleName" value={formData.moduleName} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                        <option>Module 1</option>
                        <option>Module 2</option>
                        <option>Module 3</option>
                        <option>Module 4</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score</label>
                    <input type="number" id="score" name="score" value={formData.score} onChange={handleChange} required min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                </div>

                <div>
                    <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700">Total Questions</label>
                    <input type="number" id="totalQuestions" name="totalQuestions" value={formData.totalQuestions} onChange={handleChange} required min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                </div>

                <div>
                    <label htmlFor="timeTakenSeconds" className="block text-sm font-medium text-gray-700">Time Taken (Seconds)</label>
                    <input type="number" id="timeTakenSeconds" name="timeTakenSeconds" value={formData.timeTakenSeconds} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                </div>

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Submit Performance
                </button>
            </form>
        </div>
    );
};

export default PerformanceSubmit;
