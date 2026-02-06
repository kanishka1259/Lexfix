// components/CompletionScreen.jsx
export default function CompletionScreen({ onFinish }) {
    return (
        <div className="completion-screen">
            <h1>🎉 Lesson Complete!</h1>
            <button className="adhd-btn" onClick={onFinish}>
                Go to Dashboard
            </button>
        </div>
    );
}
