import { useDrawingStore } from '../stores/useDrawingStore';
import { useState, useRef, useEffect, useCallback, memo } from 'react';

export const Telestrator = memo(() => {
  const { drawings, setDrawings, lineColor } = useDrawingStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const drawing of drawings) {
      // Draw lines
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (drawing.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        ctx.stroke();
      }
    }
  }, [drawings]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDrawing(true);
      setDrawings([...drawings, { points: [{ x: e.clientX, y: e.clientY }], color: lineColor }]);
    },
    [drawings, lineColor, setDrawings]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing) return;
      const lastDrawing = drawings[drawings.length - 1];
      setDrawings([
        ...drawings.slice(0, -1),
        {
          ...lastDrawing,
          points: [...lastDrawing.points, { x: e.clientX, y: e.clientY }],
        },
      ]);
    },
    [isDrawing, drawings, setDrawings]
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 touch-none pointer-events-auto"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
});
