// components/MindGames.jsx
import { useState, useEffect } from 'react';
import './MindGames.css';

export default function MindGames({ onClose }) {
    const [game, setGame] = useState('memory');
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [timer, setTimer] = useState(120); // 2 minutes

    useEffect(() => {
        initializeMemoryGame();
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const initializeMemoryGame = () => {
        const emojis = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎯'];
        const gameCards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji, matched: false }));
        setCards(gameCards);
    };

    const handleCardClick = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setMatched([...matched, first, second]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const allMatched = matched.length === cards.length && cards.length > 0;

    return (
        <div className="mind-games">
            <div className="games-header">
                <h1>🎮 Mind Break Time!</h1>
                <p>Relax and recharge with a quick game</p>
                <div className="timer">⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
            </div>

            <div className="game-container">
                {allMatched ? (
                    <div className="game-complete">
                        <h2>🎉 Great Job!</h2>
                        <p>You matched all the cards!</p>
                        <button className="return-btn" onClick={onClose}>
                            Return to Reading →
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>Memory Match</h2>
                        <p className="instructions">Find all the matching pairs!</p>
                        <div className="memory-grid">
                            {cards.map((card, index) => (
                                <div
                                    key={card.id}
                                    className={`memory-card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
                                        } ${matched.includes(index) ? 'matched' : ''}`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {flipped.includes(index) || matched.includes(index) ? (
                                        <span className="card-emoji">{card.emoji}</span>
                                    ) : (
                                        <span className="card-back">?</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button className="close-btn" onClick={onClose}>
                ← Back to Reading
            </button>
        </div>
    );
}
