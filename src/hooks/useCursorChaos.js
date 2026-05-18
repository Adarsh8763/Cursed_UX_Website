import { useState, useEffect, useCallback, useRef } from 'react';

export default function useCursorChaos() {
  const [ghostCursors, setGhostCursors] = useState([]);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cleanupTimerRef = useRef(null);  // owns the "stop chaos" timer
  const scheduleTimerRef = useRef(null); // owns the "next trigger" timer

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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
      offsetX: (Math.random() - 0.5) * 150,
      offsetY: (Math.random() - 0.5) * 150,
      opacity: 0.4 + Math.random() * 0.5,
      size: 16 + Math.random() * 12,
    }));

    setGhostCursors(ghosts);

    // cleanupTimerRef is ONLY for clearing ghosts — never touched by scheduleNext
    clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = setTimeout(() => {
      setGhostCursors([]);
      setIsChaosActive(false);
    }, duration);
  }, []);

  // Jitter ghost cursor offsets while active
  useEffect(() => {
    if (ghostCursors.length === 0) return;

    const interval = setInterval(() => {
      setGhostCursors(prev => prev.map(g => ({
        ...g,
        offsetX: g.offsetX + (Math.random() - 0.5) * 24,
        offsetY: g.offsetY + (Math.random() - 0.5) * 24,
      })));
    }, 80);

    return () => clearInterval(interval);
  }, [ghostCursors.length]);

  // Auto-trigger chaos periodically — uses its OWN ref, never conflicts with cleanup
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 4000; // every 3–7 seconds
      scheduleTimerRef.current = setTimeout(() => {
        triggerCursorChaos(2500 + Math.random() * 2000);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => {
      clearTimeout(scheduleTimerRef.current);
      clearTimeout(cleanupTimerRef.current);
    };
  }, [triggerCursorChaos]);

  return { ghostCursors, mousePos, isChaosActive, triggerCursorChaos };
}
