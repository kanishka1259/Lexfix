// components/MindGames.jsx
import { useState, useEffect } from 'react';
import './MindGames.css';

export default function MindGames({ onClose }) {
    const [gameMode, setGameMode] = useState('menu'); // 'menu', 'memory', 'breathe'
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [timer, setTimer] = useState(120);

    // Breathe game state
    const [breathePhase, setBreathePhase] = useState('Inhale');
    const [breatheScale, setBreatheScale] = useState(1);

    useEffect(() => {
        if (gameMode !== 'menu') {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameMode]);

    // Handle breathing cycle
    useEffect(() => {
        if (gameMode === 'breathe') {
            const cycle = async () => {
                while (gameMode === 'breathe') {
                    setBreathePhase('Inhale');
                    setBreatheScale(1.5);
                    await new Promise(r => setTimeout(r, 4000));

                    setBreathePhase('Hold');
                    await new Promise(r => setTimeout(r, 4000));

                    setBreathePhase('Exhale');
                    setBreatheScale(1);
                    await new Promise(r => setTimeout(r, 4000));
                }
            };
            cycle();
        }
    }, [gameMode]);

    const initializeMemoryGame = () => {
        const emojis = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎯'];
        const gameCards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji, matched: false }));
        setCards(gameCards);
        setGameMode('memory');
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
        <div className="mind-games-overlay">
            <div className="mind-games-card">
                <button className="close-btn-top" onClick={onClose}>✕</button>

                {gameMode === 'menu' && (
                    <div className="game-menu">
                        <div className="menu-header">
                            <h1>🎮 Quick Break</h1>
                            <p>Choose an activity to recharge your focus</p>
                        </div>
                        <div className="menu-options">
                            <div className="menu-card" onClick={initializeMemoryGame}>
                                <span className="menu-icon">🧩</span>
                                <h3>Memory Match</h3>
                                <p>Find matching pairs to sharpen your memory</p>
                            </div>
                            <div className="menu-card" onClick={() => setGameMode('breathe')}>
                                <span className="menu-icon">🌬️</span>
                                <h3>Breathe & Focus</h3>
                                <p>Simple exercises to calm your mind</p>
                            </div>
                        </div>
                    </div>
                )}

                {gameMode === 'memory' && (
                    <div className="game-container">
                        {allMatched ? (
                            <div className="game-status-screen">
                                <div className="success-icon">✨</div>
                                <h2>Fantastic!</h2>
                                <p>Your focus is back. Ready to continue?</p>
                                <button className="action-btn" onClick={onClose}>
                                    Resume Reading →
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="game-header">
                                    <h2>Memory Match</h2>
                                    <div className="game-meta">
                                        <span>⏱️ {Math.floor(timer / 60)}:{((timer % 60)).toString().padStart(2, '0')}</span>
                                        <span>🎯 {matched.length / 2}/8 Pairs</span>
                                    </div>
                                </div>
                                <div className="memory-grid">
                                    {cards.map((card, index) => (
                                        <div
                                            key={card.id}
                                            className={`memory-card-new ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
                                            onClick={() => handleCardClick(index)}
                                        >
                                            <div className="card-inner">
                                                <div className="card-front">?</div>
                                                <div className="card-back">{card.emoji}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {gameMode === 'breathe' && (
                    <div className="game-container breathe-container">
                        <h2>{breathePhase}</h2>
                        <div
                            className="breathe-circle"
                            style={{ transform: `scale(${breatheScale})` }}
                        ></div>
                        <p className="breathe-instruction">Follow the circle to regulate your breathing</p>
                        <button className="action-btn-outline" onClick={() => setGameMode('menu')}>
                            Try Another Game
                        </button>
                    </div>
                )}

                {gameMode !== 'menu' && !allMatched && (
                    <div className="game-footer">
                        <button className="text-btn" onClick={() => setGameMode('menu')}>← Back to Menu</button>
                    </div>
                )}
            </div>
        </div>
    );
}
