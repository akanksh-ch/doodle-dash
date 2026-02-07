# Doodle Dash 🎨

A real-time multiplayer drawing and guessing game powered by Gemini 1.5 Flash!

## Technologies

- **Frontend**: Next.js 14, React, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **AI**: Gemini 1.5 Flash (via Google Generative AI SDK)

## Prerequisites

- Node.js (v18+)
- A Google Gemini API Key

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akanksh-ch/doodle-dash.git
    cd doodle-dash
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This will install dependencies for both the root (concurrently) and the specialized workspaces if configured, or you may need to install individually:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=3001
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

## Running the App

To run both the client and server concurrently:

```bash
npm run dev
```

Or run them strictly separately in two terminals:

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port 3002 if 3000 is taken) to play!

## How to Play

1.  Open the game in multiple browser tabs or devices.
2.  One player clicks **"Start Game"**.
3.  Everyone gets a synced canvas.
4.  Draw a picture within the 30-second time limit!
5.  Click **"Guess!"** to have Gemini AI guess what you drew.
6.  The AI will judge your drawing and announce the result to everyone.
