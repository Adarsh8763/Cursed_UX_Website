import useCursorChaos from '../hooks/useCursorChaos';

export default function CursorChaos() {
  const { ghostCursors, mousePos } = useCursorChaos();

  return (
    <div>
      {ghostCursors.map((ghost) => (
        <div
          key={ghost.id}
          className="ghost-cursor"
          style={{
            position: 'fixed',
            left: `${mousePos.x + ghost.offsetX}px`,
            top: `${mousePos.y + ghost.offsetY}px`,
            width: `${ghost.size}px`,
            height: `${ghost.size}px`,
            opacity: ghost.opacity,
            pointerEvents: 'none',
            zIndex: 99999,
            transform: 'translate(-50%, -50%)',
            cursor: 'none',
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: '100%', height: '100%' }}
          >
            <path
              d="M4 0 L4 17 L7 14 L10 20 L12 19 L9 13 L13 13 Z"
              fill="white"
              stroke="#333"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
