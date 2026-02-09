// pages/student/LineByLineReader.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MindGames from '../../components/MindGames';
import './LineByLineReader.css';

export default function LineByLineReader() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMindGames, setShowMindGames] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [distractions, setDistractions] = useState(0);

    useEffect(() => {
        fetchAssignment();
        const timer = setInterval(() => {
            setTimeSpent(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/assignments/${assignmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignment(data);
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    const speakSentence = (text) => {
        if ('speechSynthesis' in window) {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.1;
            utterance.onend = () => {
                setIsPlaying(false);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in this browser');
        }
    };

    // Auto-read sentence when it changes
    useEffect(() => {
        if (assignment && assignment.sentences && assignment.sentences[currentIndex]) {
            speakSentence(assignment.sentences[currentIndex]);
        }
    }, [currentIndex, assignment]);

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
            await fetch('http://localhost:5001/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignmentId: assignment._id,
                    currentSentenceIndex: currentIndex,
                    timeSpent,
                    distractionCount: distractions,
                    status: 'in-progress'
                })
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const completeAssignment = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5001/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignmentId: assignment._id,
                    currentSentenceIndex: currentIndex,
                    timeSpent,
                    distractionCount: distractions,
                    status: 'completed'
                })
            });
            navigate('/student-dashboard');
        } catch (error) {
            console.error('Error completing assignment:', error);
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
        return <div className="loading-container">Loading...</div>;
    }

    if (showMindGames) {
        return <MindGames onClose={closeMindGames} />;
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
                        disabled={isPlaying}
                    >
                        {isPlaying ? '🔊 Playing...' : '🔊 Listen Again'}
                    </button>

                    <button
                        className="control-btn next-btn"
                        onClick={handleNext}
                    >
                        {currentIndex === assignment.sentences.length - 1 ? '✓ I\'ve finished reading' : 'Next Sentence →'}
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
