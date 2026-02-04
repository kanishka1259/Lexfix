import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FocusScreen from '../components/FocusScreen';
import SentenceViewer from '../components/SentenceViewer';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import BreakReminder from '../components/BreakReminder';
import CompletionScreen from '../components/CompletionScreen';
import { useTimer } from '../hooks/useTimer';

const defaultSentences = [
    "Welcome to your focused learning session.",
    "Take your time with each sentence.",
    "There's no rush - focus on understanding.",
    "You're doing great! Keep going.",
    "Almost there - stay focused!",
];

const messages = [
    "🔥 You're focused!",
    "💪 Keep going!",
    "✨ Nice progress!"
];

export default function Session() {
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [sentences, setSentences] = useState(defaultSentences);
    const seconds = useTimer(!isComplete);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's a task from student dashboard
        const taskData = localStorage.getItem('currentTask');
        if (taskData) {
            const task = JSON.parse(taskData);
            if (task.content && task.content.length > 0) {
                setSentences(task.content);
            }
        }
    }, []);

    const nextSentence = () => {
        if (index < sentences.length - 1) {
            setIndex(index + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleFinish = () => {
        navigate('/dashboard');
    };

    const message = messages[index % messages.length];

    if (isComplete) {
        return (
            <FocusScreen>
                <CompletionScreen onFinish={handleFinish} />
            </FocusScreen>
        );
    }

    return (
        <FocusScreen>
            <div className="session-container">
                <Timer seconds={seconds} />
                <BreakReminder seconds={seconds} />
                <ProgressBar current={index + 1} total={sentences.length} />
                <div className="motivational-message">{message}</div>
                <SentenceViewer sentence={sentences[index]} />
                <button className="adhd-btn next-btn" onClick={nextSentence}>
                    Next →
                </button>
            </div>
        </FocusScreen>
    );
}
