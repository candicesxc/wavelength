import { useCallback, useEffect, useRef, useState } from 'react';

// SVG dial math ported from dansarno/wavelength-game device.js
// Viewport: 400×220, center: (200, 200), radius: 180
// Position 0 = left (angle π), Position 100 = right (angle 0)

const CX = 200;
const CY = 200;

export function positionToAngle(pos: number): number {
  // pos 0 → π (left), pos 100 → 0 (right)
  return Math.PI * (1 - pos / 100);
}

export function pointOnArc(pos: number, r = 180): { x: number; y: number } {
  const a = positionToAngle(pos);
  return {
    x: CX + r * Math.cos(a),
    y: CY - r * Math.sin(a), // SVG Y is inverted
  };
}

export interface UseDialOptions {
  svgRef: React.RefObject<SVGSVGElement | null>;
  initialPosition?: number;
  onPositionChange?: (pos: number) => void;
  enabled?: boolean;
  throttleMs?: number;
}

export function useDial({
  svgRef,
  initialPosition = 50,
  onPositionChange,
  enabled = true,
  throttleMs = 50,
}: UseDialOptions) {
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);
  const lastEmitTime = useRef(0);

  // Sync external position changes when not dragging
  useEffect(() => {
    if (!isDragging.current) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const clientToSVGPosition = useCallback(
    (clientX: number, clientY: number): number | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      // Map client coords to SVG viewport (400×220)
      const svgX = (clientX - rect.left) * (400 / rect.width);
      const svgY = (clientY - rect.top) * (220 / rect.height);

      // Vector from arc center (200, 200)
      const dx = svgX - CX;
      const dy = CY - svgY; // flip Y for standard math

      // Clamp to upper semicircle — if below center line, clamp to edges
      const clampedDy = Math.max(0, dy);

      // atan2 gives angle in standard math coordinates (0=right, π=left)
      const angle = Math.atan2(clampedDy, dx);

      // Clamp angle to [0, π]
      const clampedAngle = Math.max(0, Math.min(Math.PI, angle));

      // Convert angle to position 0–100
      // angle 0 = right = position 100, angle π = left = position 0
      const pos = (1 - clampedAngle / Math.PI) * 100;
      return Math.max(0, Math.min(100, pos));
    },
    [svgRef]
  );

  const emitPosition = useCallback(
    (pos: number) => {
      const now = Date.now();
      if (now - lastEmitTime.current >= throttleMs) {
        lastEmitTime.current = now;
        onPositionChange?.(pos);
      }
    },
    [onPositionChange, throttleMs]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!enabled) return;
      isDragging.current = true;
      (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
      const pos = clientToSVGPosition(e.clientX, e.clientY);
      if (pos !== null) {
        setPosition(pos);
        emitPosition(pos);
      }
    },
    [enabled, clientToSVGPosition, emitPosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging.current || !enabled) return;
      const pos = clientToSVGPosition(e.clientX, e.clientY);
      if (pos !== null) {
        setPosition(pos);
        emitPosition(pos);
      }
    },
    [enabled, clientToSVGPosition, emitPosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return {
    position,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging: isDragging.current,
  };
}
