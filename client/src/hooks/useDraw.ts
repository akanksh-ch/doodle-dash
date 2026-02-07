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

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: DrawProps) => void) => {
    const [mouseDown, setMouseDown] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);

    const computePointInCanvas = (e: MouseEvent | TouchEvent | React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement | null) => {
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            // Touch event
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return null; // Touch end has no touches
            }
        } else {
            // Mouse event
            clientX = (e as MouseEvent | React.MouseEvent).clientX;
            clientY = (e as MouseEvent | React.MouseEvent).clientY;
        }

        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setMouseDown(true);
        const currentPoint = computePointInCanvas(e, canvasRef.current);
        const ctx = canvasRef.current?.getContext('2d');

        if (!ctx || !currentPoint) return;

        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
        prevPoint.current = currentPoint;
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            // canvas.addEventListener('mouseout', mouseUpHandler); // Optional: stop if leaves canvas?
            // We also need mouseleave to stop drawing if they go off canvas
            canvas.addEventListener('mouseleave', mouseUpHandler);

            // Touch events
            canvas.addEventListener('touchend', mouseUpHandler);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handler);
                canvas.removeEventListener('touchmove', handler);
                canvas.removeEventListener('mouseup', mouseUpHandler);
                canvas.removeEventListener('mouseleave', mouseUpHandler);
                canvas.removeEventListener('touchend', mouseUpHandler);
            }
        };
    }, [onDraw, mouseDown]);

    return { canvasRef, onMouseDown, clear };
};
