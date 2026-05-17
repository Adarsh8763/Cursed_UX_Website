import { useEffect, useRef } from 'react';
import useCursorChaos from '../hooks/useCursorChaos';

export default function CursorChaos() {
  const { ghostCursors, mousePos } = useCursorChaos();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const ghosts = containerRef.current.querySelectorAll('.ghost-cursor');
        ghosts.forEach((ghost, i) => {
          const offsetX = (i + 1) * 30 * (i % 2 === 0 ? 1 : -1);
          const offsetY = (i + 1) * 20 * (i % 2 === 0 ? -1 : 1);
          ghost.style.left = `${e.clientX + offsetX}px`;
          ghost.style.top = `${e.clientY + offsetY}px`;
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef}>
      {ghostCursors.map((ghost) => (
        <div
          key={ghost.id}
          className="ghost-cursor"
          style={{
            position: 'fixed',
            left: `${mousePos.current?.x + ghost.offsetX || 0}px`,
            top: `${mousePos.current?.y + ghost.offsetY || 0}px`,
            width: `${ghost.size}px`,
            height: `${ghost.size}px`,
            opacity: ghost.opacity,
            pointerEvents: 'none',
            zIndex: 99999,
            transform: 'translate(-50%, -50%)',
            cursor: 'none',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: '100%', height: '100%', filter: `hue-rotate(${ghost.id * 60}deg)` }}
          >
            <path
              d="M4 0 L4 17 L7 14 L10 20 L12 19 L9 13 L13 13 Z"
              fill="#00ff41"
              stroke="#00ff41"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
