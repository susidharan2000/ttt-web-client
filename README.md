# Tic Tac Toe — Multiplayer (Server Authoritative)

A real-time multiplayer Tic Tac Toe game built using **React** and **Nakama**, with a **server-authoritative architecture** to ensure correctness and prevent cheating.

---

## Tech Stack

- React + Vite  
- Nakama JS SDK (@heroiclabs/nakama-js)  
- Go (Nakama match handler)  
- Vercel (Frontend deployment)  

---

## Features

- Real-time multiplayer via WebSocket  
- Server-authoritative game logic  
- Automatic matchmaking  
- Turn-based validation  
- 30-second turn timer (server enforced)  
- Timer synced with client UI  
- Player names display  
- Win / Draw / Opponent left handling  
- Exit match support  

---

## Architecture

```
Client (React)
   ↓ WebSocket
Nakama Server
   ↓
Match Handler (Go)
```

---

## Project Structure

```
src/
├── App.jsx
├── LobbyPage.jsx
├── GamePage.jsx
├── TimerBar.jsx
└── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Nakama server running (local or remote)

---

### Install

```bash
npm install
```

---

### Run Locally

```bash
npm run dev
```

Make sure Nakama is running on:

```
localhost:7350
server key: defaultkey
```

---

### Build

```bash
npm run build
```

---

## Environment Variables

Create a `.env` file:

```
VITE_NAKAMA_KEY=defaultkey
VITE_NAKAMA_HOST=localhost
VITE_NAKAMA_PORT=7350
VITE_NAKAMA_SSL=false
```

---

## Opcode Reference

| Opcode | Direction         | Description        |
|--------|------------------|--------------------|
| 1      | Client → Server  | Player move        |
| 10     | Server → Client  | Move applied       |
| 20     | Server → Client  | Game won           |
| 30     | Server → Client  | Draw               |
| 40     | Server → Client  | Opponent left      |
| 50     | Server → Client  | Match init         |
| 60     | Server → Client  | Timeout            |

---

## Deployment

```bash
npm run build
vercel --prod
```

Frontend deployed on Vercel. Backend runs on Nakama server.