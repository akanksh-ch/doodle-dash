'use client';

import { FC, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDraw } from '@/hooks/useDraw';

const socket = io('http://localhost:3001');

interface DrawLineProps {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
}

interface Point {
    x: number;
    y: number;
}

const DrawingCanvas: FC = () => {
    const [color, setColor] = useState<string>('#000');
    const { canvasRef, onMouseDown, clear } = useDraw(createLine);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
            if (!ctx) return;
            drawLine({ prevPoint, currentPoint, ctx, color });
        });

        socket.on('clear', clear);

        return () => {
            socket.off('draw-line');
            socket.off('clear');
        };
    }, [canvasRef, clear]);

    function createLine({ ctx, currentPoint, prevPoint }: { ctx: CanvasRenderingContext2D; currentPoint: Point; prevPoint: Point | null }) {
        socket.emit('draw-line', ({ prevPoint, currentPoint, color }));
        drawLine({ prevPoint, currentPoint, ctx, color });
    }

    function drawLine({ prevPoint, currentPoint, ctx, color }: DrawLineProps & { ctx: CanvasRenderingContext2D }) {
        const { x: currX, y: currY } = currentPoint;
        const lineColor = color;
        const lineWidth = 5;

        let startPoint = prevPoint ?? currentPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    async function handleGuess() {
        if (!canvasRef.current) return;

        const image = canvasRef.current.toDataURL("image/png");

        try {
            const response = await fetch("http://localhost:3001/api/guess", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
            });

            if (!response.ok) {
                throw new Error("Failed to get guess");
            }

            const data = await response.json();
            alert(`AI says: ${data.guess}`);
        } catch (error) {
            console.error(error);
            alert("Error getting guess. Check server logs.");
        }
    }

    return (
        <div className='w-full h-screen bg-white flex justify-center items-center'>
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
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                width={750}
                height={750}
                className='border border-black rounded-md'
            />
        </div>
    );
};

export default DrawingCanvas;
