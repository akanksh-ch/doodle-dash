'use client';

import { useEffect, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { socket } from '@/socket';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '@/components/LoginButton';
import LogoutButton from '@/components/LogoutButton';
import Leaderboard from '@/components/Leaderboard';

type GameState = 'LOBBY' | 'PLAYING' | 'RESULTS';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [lastGuess, setLastGuess] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    socket.on('start-game', (word: string) => {
      setGameState('PLAYING');
      setLastGuess('');
      setTimeLeft(30);
      setCurrentWord(word);
      setShowLeaderboard(false); // Hide leaderboard when game starts
    });

    socket.on('timer-update', (time: number) => {
      setTimeLeft(time);
    });

    socket.on('time-up', (word: string) => {
      setLastGuess(`Time's Up! The word was: ${word}`);
      setGameState('RESULTS');
    });

    socket.on('game-over', (result: string) => {
      setLastGuess(result);
      setGameState('RESULTS');
    });

    return () => {
      socket.off('start-game');
      socket.off('timer-update');
      socket.off('time-up');
      socket.off('game-over');
    };
  }, []);

  const handleStartGame = () => {
    socket.emit('start-game');
  };

  const handleGuessSubmit = (guess: string, isWin: boolean) => {
    if (isWin) {
      socket.emit('end-game', `WINNER! AI correctly guessed: "${guess}" matches "${currentWord}"`);

      if (isAuthenticated && user) {
        // Fire and forget score save
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
        fetch(`${SERVER_URL}/api/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.name || user.email, score: 1 })
        }).catch(err => console.error("Error saving score:", err));
      }
    }
  };

  const handlePlayAgain = () => {
    socket.emit('start-game');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 relative">
      <div className="absolute top-5 right-5 flex items-center gap-4">
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded font-bold hover:bg-yellow-500 transition"
        >
          {showLeaderboard ? 'Close Leaderboard' : '🏆 Leaderboard'}
        </button>

        {isLoading ? (
          <div>Loading...</div>
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Hi, {user.name}</span>
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border" />
            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </div>

      <h1 className="text-4xl font-bold mb-8">Doodle Dash</h1>

      {showLeaderboard ? (
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border">
          <Leaderboard />
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="text-blue-500 hover:underline"
            >
              Back to Game
            </button>
          </div>
        </div>
      ) : (
        <>
          {gameState === 'LOBBY' && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl">Welcome to the Lobby!</p>
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-bold hover:bg-green-600 transition-all"
              >
                Start Game
              </button>
              <div className="mt-8 opacity-50 pointer-events-none">
                <p className="mb-2 text-sm">Preview Board:</p>
                <DrawingCanvas readOnly={true} />
              </div>
            </div>
          )}

          {gameState === 'PLAYING' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center mb-2 bg-yellow-100 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-bold text-gray-700">Drawing Phase</p>
                <div className={`text-4xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                  {timeLeft}s
                </div>
                <p className="text-xl mt-2">Draw: <span className="font-bold text-blue-600 uppercase">{currentWord}</span></p>
                <p className="text-sm text-gray-500 mt-1">AI must guess this word!</p>
              </div>
              <DrawingCanvas onGuessSubmit={handleGuessSubmit} />
            </div>
          )}

          {gameState === 'RESULTS' && (
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-3xl font-bold text-blue-600">Game Over!</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
                <p className="text-gray-500 mb-2">The AI Guessed:</p>
                <p className="text-4xl font-extrabold mb-4">"{lastGuess}"</p>
              </div>

              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-all"
              >
                Play Again
              </button>

              <div className="mt-4 opacity-75 pointer-events-none transform scale-75">
                <DrawingCanvas readOnly={true} />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
