import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MindGames from '../../components/MindGames';
import { useTTS } from '@reading-support/components/tts/TTSProvider';
import './LineByLineReader.css';

export default function LineByLineReader() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { speak, stop, isSpeaking } = useTTS();
    const [showMindGames, setShowMindGames] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [distractions, setDistractions] = useState(0);

    useEffect(() => {
        fetchAssignment();
        const timer = setInterval(() => {
            setTimeSpent(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
            stop(); // Stop speech on unmount
        };
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAssignment(response.data);
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    const speakSentence = (text) => {
        speak(text);
    };

    const handleNext = async () => {
        if (currentIndex < assignment.sentences.length - 1) {
            setCurrentIndex(currentIndex + 1);
            await updateProgress();
        } else {
            // Assignment completed
            await completeAssignment();
        }
    };

    const updateProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/submissions', {
                assignmentId: assignment._id,
                currentSentenceIndex: currentIndex,
                timeSpent,
                distractionCount: distractions,
                status: 'in-progress'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const completeAssignment = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/submissions', {
                assignmentId: assignment._id,
                currentSentenceIndex: currentIndex,
                timeSpent,
                distractionCount: distractions,
                status: 'completed'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Navigate back to the main dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Error completing assignment:', error);
            // Fallback navigation
            navigate('/dashboard');
        }
    };

    const handleDistraction = () => {
        setDistractions(prev => prev + 1);
        setShowMindGames(true);
    };

    const closeMindGames = () => {
        setShowMindGames(false);
    };

    if (!assignment) {
        return <div className="loading-container">Loading assignment details...</div>;
    }

    if (showMindGames) {
        return <MindGames onClose={closeMindGames} />;
    }

    if (!assignment.sentences || assignment.sentences.length === 0) {
        return (
            <div className="error-container">
                <h2>No content found</h2>
                <p>This assignment doesn't seem to have any readable content yet.</p>
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / assignment.sentences.length) * 100;
    const currentSentence = assignment.sentences[currentIndex];

    return (
        <div className="line-reader">
            <div className="reader-header">
                <h2>{assignment.title}</h2>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">
                    Sentence {currentIndex + 1} of {assignment.sentences.length}
                </p>
            </div>

            <div className="reader-content">
                <div className="sentence-display">
                    <p className="current-sentence">{currentSentence}</p>
                </div>

                <div className="reader-controls">
                    <button
                        className="control-btn listen-btn"
                        onClick={() => speakSentence(currentSentence)}
                        disabled={isSpeaking}
                    >
                        {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
                    </button>

                    <button
                        className="control-btn next-btn"
                        onClick={handleNext}
                    >
                        {currentIndex === assignment.sentences.length - 1 ? '✓ Complete' : 'Next →'}
                    </button>

                    <button
                        className="control-btn break-btn"
                        onClick={handleDistraction}
                    >
                        🎮 Take a Break
                    </button>
                </div>

                <div className="stats">
                    <span>⏱️ Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
                    <span>🎯 Focus: {distractions} breaks</span>
                </div>
            </div>
        </div>
    );
}
