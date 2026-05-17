import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from './SoundManager';
import useCursorChaos from '../hooks/useCursorChaos';

export default function MovingButton({ children, onClick, className = '', style = {}, escapeTimes = 3 }) {
  const [escapeCount, setEscapeCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const btnRef = useRef(null);
  const { triggerCursorChaos } = useCursorChaos();

  const canEscape = escapeCount < escapeTimes;

  const handleMouseEnter = () => {
    if (!canEscape) {
      setIsClickable(true);
      return;
    }

    // Calculate random direction to move, constrained by viewport
    const maxH = typeof window !== 'undefined' ? Math.min(200, window.innerWidth / 3) : 200;
    const maxV = typeof window !== 'undefined' ? Math.min(150, window.innerHeight / 3) : 150;
    
    const directions = [
      { x: maxH, y: 0 }, { x: -maxH, y: 0 },
      { x: 0, y: maxV }, { x: 0, y: -maxV },
      { x: maxH * 0.8, y: maxV * 0.8 }, { x: -maxH * 0.8, y: -maxV * 0.8 },
      { x: maxH * 0.9, y: -maxV * 0.6 }, { x: -maxH * 0.9, y: maxV * 0.6 },
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    // Ensure we don't move too far consecutively in the same direction
    const newX = position.x === 0 ? dir.x : dir.x > 0 ? -Math.abs(dir.x) : Math.abs(dir.x);
    const newY = position.y === 0 ? dir.y : dir.y > 0 ? -Math.abs(dir.y) : Math.abs(dir.y);
    
    setPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
    setIsShaking(true);
    soundEngine.xpError();
    triggerCursorChaos(1500);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleClick = (e) => {
    if (!isClickable && canEscape) {
      e.preventDefault();
      soundEngine.xpError();
      return;
    }
    soundEngine.notification();
    onClick && onClick(e);
  };

  // After escaping enough times, settle
  useEffect(() => {
    if (escapeCount >= escapeTimes) {
      setTimeout(() => {
        setPosition({ x: 0, y: 0 });
        setIsClickable(true);
      }, 800);
    }
  }, [escapeCount, escapeTimes]);

  return (
    <motion.button
      ref={btnRef}
      className={`cursed-btn ${className}`}
      style={{ position: 'relative', ...style }}
      animate={{
        x: position.x,
        y: position.y,
        rotate: isShaking ? [-2, 2, -2, 2, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
        rotate: { duration: 0.3 },
      }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
    >
      {children}
      {!isClickable && canEscape && (
        <motion.span
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '8px',
            color: '#ff0040',
            whiteSpace: 'nowrap',
            fontFamily: 'Comic Sans MS, cursive',
          }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1 }}
          key={escapeCount}
        >
          Nice try. {escapeTimes - escapeCount} escape(s) left.
        </motion.span>
      )}
    </motion.button>
  );
}
