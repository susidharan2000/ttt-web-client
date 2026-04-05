import { useState, useRef } from "react";
import LobbyPage from "./LobbyPage";
import GamePage from "./GamePage";
import { Client } from "@heroiclabs/nakama-js";

function App() {
  const [screen, setScreen] = useState("lobby");
  const [status, setStatus] = useState("idle");
  const [players, setPlayers] = useState({});
  const [myId, setMyId] = useState(null);
  const [board, setBoard] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [playerRole, setPlayerRole] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [turnStartTime, setTurnStartTime] = useState(0);
  const [turnDuration, setTurnDuration] = useState(30);

  const socketRef = useRef(null);
  const matchIdRef = useRef(null);
  const statusRef = useRef("idle");
  const playerRoleRef = useRef(null);
  const currentTurnRef = useRef(1);

  const setStatusSync = (val) => { statusRef.current = val; setStatus(val); };
  const setPlayerRoleSync = (val) => { playerRoleRef.current = val; setPlayerRole(val); };
  const setCurrentTurnSync = (val) => { currentTurnRef.current = val; setCurrentTurn(val); };

  const handleJoin = async (username) => {
    try {
      setBoard([[0,0,0],[0,0,0],[0,0,0]]);
      setPlayerRoleSync(null);
      setGameResult(null);
      setStatusSync("connecting");

      const client = new Client("defaultkey", "tic-tac-toe-production-cf31.up.railway.app", "443", true);
      const deviceId = crypto.randomUUID();
      const session = await client.authenticateDevice(deviceId, true, username);

      const sock = client.createSocket(true);
      await sock.connect(session, true);

      socketRef.current = sock;
      setStatusSync("waiting");

      sock.onmatchmakermatched = async (matched) => {
        const match = await sock.joinMatch(matched.match_id);
        matchIdRef.current = match.match_id;
        console.log("Joined match. Waiting for INIT...");
      };

      sock.onmatchdata = (data) => {
        const msg = JSON.parse(new TextDecoder().decode(data.data));

        if (data.op_code === 50) {
          setPlayerRoleSync(msg.role);
          setCurrentTurnSync(msg.turn);
          setBoard(msg.board);
          setTurnStartTime(msg.turnStartTime);
          setTurnDuration(msg.turnDuration);
          setPlayers(msg.players);
          setMyId(msg.yourId);
          setScreen("game");
          setStatusSync("playing");
        }

        if (data.op_code === 10) {
          setBoard(msg.board);
          setCurrentTurnSync(msg.turn);
          setTurnStartTime(msg.turnStartTime);
        }

        if (data.op_code === 20) {
          console.log("WINNER:", msg.winner, "MY ROLE:", playerRoleRef.current);
          setBoard(msg.board);
          setGameResult(msg.winner);
          setStatusSync("finished");
        }

        if (data.op_code === 30) {
          setGameResult("draw");
          setStatusSync("finished");
        }

        if (data.op_code === 40) {
          setGameResult("opponent_left");
          setStatusSync("finished");
        }

        if (data.op_code === 60) {
          setCurrentTurnSync(msg.turn);
          setTurnStartTime(msg.turnStartTime);
        }
      };

      await sock.addMatchmaker("+properties.mode:tictactoe", 2, 2, { mode: "tictactoe" }, {});
    } catch (err) {
      console.error(err);
      setStatusSync("error");
    }
  };

  const sendMove = (row, col) => {
    if (!socketRef.current || !matchIdRef.current) return;
    if (statusRef.current !== "playing") return;
    if (currentTurnRef.current !== playerRoleRef.current) return;
    const payload = new TextEncoder().encode(JSON.stringify({ row, col }));
    socketRef.current.sendMatchState(matchIdRef.current, 1, payload);
  };

  const handleRematch = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    matchIdRef.current = null;
    playerRoleRef.current = null;
    currentTurnRef.current = 1;
    statusRef.current = "idle";

    setBoard([[0,0,0],[0,0,0],[0,0,0]]);
    setPlayerRole(null);
    setCurrentTurn(1);
    setGameResult(null);
    setPlayers({});
    setMyId(null);
    setTurnStartTime(0);
    setStatus("idle");
    setScreen("lobby");
  };

  return (
    <>
      {screen === "lobby" && (
        <LobbyPage onJoin={handleJoin} status={status} />
      )}
      {screen === "game" && (
        <GamePage
          board={board}
          sendMove={sendMove}
          currentTurn={currentTurn}
          playerRole={playerRole}
          status={status}
          gameResult={gameResult}
          players={players}
          myId={myId}
          turnStartTime={turnStartTime}
          turnDuration={turnDuration}
          onRematch={handleRematch}
        />
      )}
    </>
  );
}

export default App;