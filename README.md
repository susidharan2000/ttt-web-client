# Tic Tac Toe — Web Client

A real-time multiplayer Tic Tac Toe game built with React and Nakama.

## Tech Stack

- React + Vite
- Nakama JS SDK (@heroiclabs/nakama-js)
- Deployed on Vercel

## Features

- Real-time multiplayer via Nakama WebSocket
- Automatic matchmaking
- Turn timer (30 seconds per turn)
- Player names displayed in game
- Turn timeout auto-switches to opponent
- Win / Draw / Opponent left detection
- Exit button to leave match

## Project Structure

src/
├── App.jsx        # Root component, Nakama connection, game state
├── LobbyPage.jsx  # Username input and matchmaking screen
├── GamePage.jsx   # Game board, player info, result screen
├── TimerBar.jsx   # Countdown timer synced with server
└── main.jsx       # React entry point

## Getting Started

### Prerequisites

- Node.js 18+
- A running Nakama server (local or remote)

### Install

npm install

### Run locally

npm run dev

Make sure Nakama is running on localhost:7350 with defaultkey.

### Build

npm run build

## Environment Variables

Create a .env file to point to a remote Nakama server:

VITE_NAKAMA_KEY=defaultkey
VITE_NAKAMA_HOST=your-server-ip
VITE_NAKAMA_PORT=7350
VITE_NAKAMA_SSL=false

Then update App.jsx:

const client = new Client(
  import.meta.env.VITE_NAKAMA_KEY ?? "defaultkey",
  import.meta.env.VITE_NAKAMA_HOST ?? "localhost",
  import.meta.env.VITE_NAKAMA_PORT ?? "7350",
  import.meta.env.VITE_NAKAMA_SSL === "true"
);

## Opcode Reference

| Opcode | Direction          | Description                        |
|--------|--------------------|------------------------------------|
| 1      | Client → Server    | Player move { row, col }           |
| 10     | Server → Client    | Move applied, board update         |
| 20     | Server → Client    | Game over, winner declared         |
| 30     | Server → Client    | Draw                               |
| 40     | Server → Client    | Opponent left, you win             |
| 50     | Server → Client    | Match init, role and board state   |
| 60     | Server → Client    | Turn timeout, turn switched        |

## Deployment

Deployed on Vercel. Every push to main triggers a new production deployment.

npm run build
vercel --prod