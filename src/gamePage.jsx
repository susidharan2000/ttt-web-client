import TimerBar from "./TimerBar";

export default function GamePage({
  board,
  sendMove,
  currentTurn,
  playerRole,
  status,
  gameResult,
  players,
  myId,
  turnStartTime,
  turnDuration,
}) {
  const opponentId = Object.keys(players || {}).find((id) => id !== myId);
  const myName = players?.[myId] || "You";
  const opponentName = players?.[opponentId] || "Opponent";

  const resolveStatusText = () => {
    if (status === "finished") {
      if (gameResult === null) return "Game over";
      if (gameResult === "draw") return "It's a Draw!";
      if (gameResult === "opponent_left") return `${opponentName} left. You win! 🎉`;
      if (gameResult === playerRole) return "You Win 🎉";
      return "You Lose 😔";
    }
    return null;
  };

  const isMyTurn = currentTurn === playerRole && status === "playing";
  const statusText = resolveStatusText();

  const handleExit = () => {
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tic Tac Toe</h1>

      <div style={styles.nameRow}>
        <span style={{ color: "#60a5fa" }}>
          {playerRole === 1 ? myName : opponentName} (X)
        </span>
        <span style={styles.vs}>vs</span>
        <span style={{ color: "#f87171" }}>
          {playerRole === 2 ? myName : opponentName} (O)
        </span>
      </div>

      <p style={styles.role}>
        You are{" "}
        <span style={{ color: playerRole === 1 ? "#60a5fa" : "#f87171" }}>
          {playerRole === 1 ? "X" : "O"}
        </span>
      </p>

      {status === "playing" && (
        <TimerBar
          turnStartTime={turnStartTime}
          turnDuration={turnDuration}
          currentTurn={currentTurn}
          playerRole={playerRole}
        />
      )}

      {statusText && (
        <p style={styles.statusText}>{statusText}</p>
      )}

      <div style={styles.board}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => sendMove(i, j)}
              style={{
                ...styles.cell,
                cursor: isMyTurn && cell === 0 ? "pointer" : "not-allowed",
                opacity: !isMyTurn && cell === 0 ? 0.6 : 1,
              }}
            >
              <span style={{ color: cell === 1 ? "#60a5fa" : "#f87171" }}>
                {cell === 1 ? "X" : cell === 2 ? "O" : ""}
              </span>
            </button>
          ))
        )}
      </div>

        <button onClick={handleExit} style={styles.exitBtn}>
          Exit
        </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  title: { marginBottom: "16px" },
  nameRow: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  vs: { color: "#475569", fontSize: "14px" },
  role: { fontSize: "14px", color: "#94a3b8", marginBottom: "4px" },
  statusText: {
    fontSize: "20px",
    marginBottom: "16px",
    color: "#e2e8f0",
    fontWeight: "bold",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 80px)",
    gap: "10px",
  },
  cell: {
    width: "80px",
    height: "80px",
    fontSize: "28px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
  },
  exitBtn: {
    marginTop: "24px",
    padding: "10px 32px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#374151",
    color: "white",
    cursor: "pointer",
  },
};