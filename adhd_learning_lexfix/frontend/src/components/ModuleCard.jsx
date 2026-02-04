import { useNavigate } from 'react-router-dom';
import './ModuleCard.css';

const ModuleCard = ({ title, description, progress, id, isLocked, onClick }) => {
    return (
        <div
            className={`module-card ${isLocked ? 'locked' : ''}`}
            onClick={!isLocked ? onClick : undefined}
        >
            <div className="module-header">
                <h3>{title}</h3>
                {isLocked && <span className="lock-icon">🔒</span>}
            </div>
            <p className="module-description">{description}</p>

            <div className="module-footer">
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{progress}% Completed</span>
                </div>

                <button
                    className="start-btn"
                    disabled={isLocked}
                >
                    {progress > 0 ? 'Continue' : 'Start'}
                </button>
            </div>
        </div>
    );
};

export default ModuleCard;
