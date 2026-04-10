import { useDrawingStore } from '../stores/useDrawingStore';
import { useRef, useEffect, useCallback, memo } from 'react';

function redrawStrokes(ctx: CanvasRenderingContext2D, drawings: { points: { x: number; y: number }[]; color: string }[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const drawing of drawings) {
    if (drawing.points.length < 2) continue;
    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
    for (let i = 1; i < drawing.points.length; i++) {
      ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
    }
    ctx.stroke();
  }
}

export const Telestrator = memo(() => {
  const { drawings, addDrawing, lineColor } = useDrawingStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Active stroke lives only in refs — no state updates during drawing
  const activeStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const activeColorRef = useRef<string>('yellow');
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw after resize since resizing clears the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) redrawStrokes(ctx, drawings);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Redraw committed strokes whenever the store changes (clear, new stroke added, etc.)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    redrawStrokes(ctx, drawings);
  }, [drawings]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDrawingRef.current = true;
      activeColorRef.current = lineColor;
      activeStrokeRef.current = [{ x: e.clientX, y: e.clientY }];
    },
    [lineColor]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = activeStrokeRef.current;
    const prev = points[points.length - 1];
    const next = { x: e.clientX, y: e.clientY };
    points.push(next);

    // Draw only the new segment — no full redraw
    ctx.strokeStyle = activeColorRef.current;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const points = activeStrokeRef.current;
    if (points.length > 1) {
      // Commit completed stroke to the store
      addDrawing({ points, color: activeColorRef.current });
    }
    activeStrokeRef.current = [];
  }, [addDrawing]);

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
