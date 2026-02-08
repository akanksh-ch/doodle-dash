'use client';

import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { socket } from '@/socket';
import { useDraw } from '@/hooks/useDraw';

interface DrawLineProps {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
}

interface Point {
    x: number;
    y: number;
}

interface DrawingCanvasProps {
    readOnly?: boolean;
    onGuessSubmit?: (guess: string, isWin: boolean) => void;
}

const DrawingCanvas: FC<DrawingCanvasProps> = ({ readOnly = false, onGuessSubmit }) => {
    // ... items ...

    async function handleGuess() {
        if (!canvasRef.current) return;

        const image = canvasRef.current.toDataURL("image/png");
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

        try {
            const response = await fetch(`${SERVER_URL}/api/guess`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
            });

            if (!response.ok) {
                throw new Error("Failed to get guess");
            }

            const data = await response.json(); // { guess: string, isWin: boolean }

            if (onGuessSubmit) {
                if (data.isWin) {
                    onGuessSubmit(data.guess, true);
                } else {
                    alert(`AI guessed: "${data.guess}". Wrong! Keep drawing.`);
                }
            } else {
                alert(`AI says: ${data.guess} (Win: ${data.isWin})`);
            }
        } catch (error) {
            console.error(error);
            alert("Error getting guess. Check server logs.");
        }
    }

    return (
        <div className='w-full h-screen bg-white flex justify-center items-center'>
            {!readOnly && (
                <div className='flex flex-col gap-4 pr-10'>
                    <div className='flex flex-col gap-2'>
                        <label>Color Picker</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className='w-10 h-10'
                        />
                    </div>
                    <button
                        type='button'
                        className='p-2 rounded-md border border-black hover:bg-gray-100 transition-all'
                        onClick={() => {
                            socket.emit('clear');
                            clear();
                        }}>
                        Clear canvas
                    </button>
                    <button
                        type='button'
                        className='p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all'
                        onClick={handleGuess}>
                        Guess!
                    </button>
                </div>
            )}
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                width={750}
                height={750}
                className={`border border-black rounded-md ${readOnly ? 'cursor-default pointer-events-none' : 'cursor-crosshair'}`}
            />
        </div>
    );
};

export default DrawingCanvas;
