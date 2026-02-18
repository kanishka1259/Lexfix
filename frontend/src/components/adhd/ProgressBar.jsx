export default function ProgressBar({ current, total }) {
    const percent = (current / total) * 100;

    return (
        <div className="progress">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
    );
}
