// TimerBar.jsx
import { useEffect, useState } from "react";

export default function TimerBar({ turnStartTime, turnDuration, currentTurn, playerRole }) {
  const [timeLeft, setTimeLeft] = useState(turnDuration);

  useEffect(() => {
    // Recalculate immediately when turn changes
    const calc = () => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - turnStartTime;
      const remaining = Math.max(0, turnDuration - elapsed);
      setTimeLeft(remaining);
    };

    calc();
    const interval = setInterval(calc, 500);
    return () => clearInterval(interval);
  }, [turnStartTime, turnDuration]);

  const pct = (timeLeft / turnDuration) * 100;
  const isMyTurn = currentTurn === playerRole;
  const color = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f97316" : "#22c55e";

  return (
    <div style={styles.wrapper}>
      <span style={{ color: "#94a3b8", fontSize: "13px" }}>
        {isMyTurn ? "Your turn — " : "Opponent's turn — "}
        <span style={{ color, fontWeight: "bold" }}>{timeLeft}s</span>
      </span>
      <div style={styles.track}>
        <div style={{ ...styles.bar, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: { width: "250px", marginBottom: "16px" },
  track: { height: "6px", background: "#1e293b", borderRadius: "99px", marginTop: "6px" },
  bar: { height: "100%", borderRadius: "99px", transition: "width 0.5s linear, background 0.3s" },
};