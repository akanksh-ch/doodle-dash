'use client';

import { useEffect, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

type GameState = 'LOBBY' | 'PLAYING' | 'RESULTS';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [lastGuess, setLastGuess] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    socket.on('start-game', () => {
      setGameState('PLAYING');
      setLastGuess('');
      setTimeLeft(30);
    });

    socket.on('timer-update', (time: number) => {
      setTimeLeft(time);
    });

    socket.on('time-up', () => {
      // For now, just end the game with a timeout message if no guess happened
      // Or maybe trigger a "Panic Guess"?
      // Let's just go to results with "Time's Up!"
      setLastGuess("Time's Up! No guess made.");
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

  const handleGuessSubmit = (guess: string) => {
    socket.emit('end-game', guess);
  };

  const handlePlayAgain = () => {
    socket.emit('start-game'); // Simple restart
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">SketchGuess Multiplayer</h1>

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
            <p className="text-sm text-gray-500 mt-1">Draw something and click Guess!</p>
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
    </main>
  );
}
