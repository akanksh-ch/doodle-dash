import { useEffect, useRef, useState } from 'react';

interface Point {
    x: number;
    y: number;
}

interface DrawProps {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    prevPoint: Point | null;
}

export const useDraw = (onDraw: (draw: DrawProps) => void) => {
    const [mouseDown, setMouseDown] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);

    const onMouseDown = () => setMouseDown(true);

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            if (!mouseDown) return;

            const currentPoint = computePointInCanvas(e, canvasRef.current);

            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx || !currentPoint) return;

            onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
            prevPoint.current = currentPoint;
        };

        const computePointInCanvas = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement | null) => {
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const y = 'touches' in e ? e.touches[0].clientY : e.clientY;

            return { x: x - rect.left, y: y - rect.top };
        };

        const mouseUpHandler = () => {
            setMouseDown(false);
            prevPoint.current = null;
        };

        // Add event listeners
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('mousemove', handler);
            canvas.addEventListener('touchmove', handler);
            canvas.addEventListener('mouseup', mouseUpHandler);
            canvas.addEventListener('touchend', mouseUpHandler);
            // We also need mouseleave to stop drawing if they go off canvas
            canvas.addEventListener('mouseleave', mouseUpHandler);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handler);
                canvas.removeEventListener('touchmove', handler);
                canvas.removeEventListener('mouseup', mouseUpHandler);
                canvas.removeEventListener('touchend', mouseUpHandler);
                canvas.removeEventListener('mouseleave', mouseUpHandler);
            }
        };
    }, [onDraw, mouseDown]);

    return { canvasRef, onMouseDown, clear };
};
