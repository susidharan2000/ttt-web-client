import { useState } from "react";

export default function LobbyPage({ onJoin, status }) {
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!username.trim()) return;
    onJoin(username);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tic Tac Toe</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        style={styles.input}
        disabled={status !== "idle" && status !== "error"}
      />
      <button
        onClick={handleJoin}
        style={{
          ...styles.button,
          opacity: status === "connecting" || status === "waiting" ? 0.6 : 1,
          cursor: status === "connecting" || status === "waiting" ? "not-allowed" : "pointer",
        }}
        disabled={status === "connecting" || status === "waiting"}
      >
        {status === "connecting" ? "Connecting..." : "Join Match"}
      </button>
      {status === "waiting" && <p style={styles.hint}>Finding opponent...</p>}
      {status === "error" && (
        <p style={{ color: "#f87171" }}>Connection failed. Try again.</p>
      )}
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
    gap: "12px",
    background: "#0f172a",
    color: "white",
  },
  title: {
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    width: "200px",
    textAlign: "center",
  },
  button: {
    padding: "10px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
  },
  hint: {
    color: "#94a3b8",
    fontSize: "14px",
  },
};