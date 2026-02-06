// components/BreakReminder.jsx
import { useEffect } from "react";

export default function BreakReminder({ seconds }) {
    useEffect(() => {
        if (seconds > 0 && seconds % 300 === 0) {
            alert("🧠 Time for a short break!");
        }
    }, [seconds]);

    return null;
}
