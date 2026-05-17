import { useState, useEffect, useCallback, useRef } from 'react';

export default function useCursorChaos() {
  const [ghostCursors, setGhostCursors] = useState([]);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const chaosTimerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const triggerCursorChaos = useCallback((duration = 3000) => {
    setIsChaosActive(true);

    // Create 3-5 ghost cursors at random offsets
    const count = 3 + Math.floor(Math.random() * 3);
    const ghosts = Array.from({ length: count }, (_, i) => ({
      id: i,
      offsetX: (Math.random() - 0.5) * 120,
      offsetY: (Math.random() - 0.5) * 120,
      opacity: 0.3 + Math.random() * 0.5,
      size: 14 + Math.random() * 10,
    }));

    setGhostCursors(ghosts);

    clearTimeout(chaosTimerRef.current);
    chaosTimerRef.current = setTimeout(() => {
      setGhostCursors([]);
      setIsChaosActive(false);
    }, duration);
  }, []);

  useEffect(() => {
    if (ghostCursors.length === 0) return;

    const interval = setInterval(() => {
      setGhostCursors(prev => prev.map(g => ({
        ...g,
        offsetX: g.offsetX + (Math.random() - 0.5) * 20,
        offsetY: g.offsetY + (Math.random() - 0.5) * 20,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [ghostCursors.length]);

  useEffect(() => {
    return () => clearTimeout(chaosTimerRef.current);
  }, []);

  return { ghostCursors, mousePos, isChaosActive, triggerCursorChaos };
}
