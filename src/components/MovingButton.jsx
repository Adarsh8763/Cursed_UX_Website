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

    // Calculate random direction to move
    const directions = [
      { x: 200, y: 0 }, { x: -200, y: 0 },
      { x: 0, y: 150 }, { x: 0, y: -150 },
      { x: 150, y: 100 }, { x: -150, y: -100 },
      { x: 180, y: -80 }, { x: -180, y: 80 },
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    setPosition({ x: dir.x, y: dir.y });
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
