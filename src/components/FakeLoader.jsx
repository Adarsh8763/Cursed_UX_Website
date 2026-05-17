import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES, getRandomMessage } from '../utils/randomMessages';

export default function FakeLoader({ isVisible, onComplete, duration = 4000 }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(getRandomMessage(LOADING_MESSAGES));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      // Chaotic progress: sometimes goes backward!
      const delta = Math.random() > 0.15
        ? Math.random() * 8 + 1
        : -(Math.random() * 5);

      current = Math.max(0, Math.min(98, current + delta));

      // Stuck at 99% moment
      if (current >= 98) current = 98;

      setProgress(Math.round(current));

      // Change message occasionally
      if (Math.random() > 0.7) {
        setMessage(getRandomMessage(LOADING_MESSAGES));
      }
    }, duration / 40);

    // After duration, jump to 100
    const completeTimer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsComplete(true);
      setTimeout(() => onComplete && onComplete(), 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 9500,
            fontFamily: '"Share Tech Mono", monospace',
          }}
        >
          {/* Government seal */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              fontSize: '4rem',
              filter: 'drop-shadow(0 0 20px rgba(0,255,65,0.8))',
            }}
          >
            🏛️
          </motion.div>

          <motion.div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px',
              color: '#00ff41',
              textAlign: 'center',
              textShadow: '0 0 10px #00ff41',
              maxWidth: '400px',
              lineHeight: 1.8,
            }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LOADING GOVERNMENT SUFFERING...
          </motion.div>

          {/* Progress bar */}
          <div style={{ width: '320px' }}>
            <div
              style={{
                background: '#111',
                border: '2px solid #00ff41',
                height: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ff41, #ffff00, #ff0040)',
                  width: `${progress}%`,
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000',
                fontSize: '11px',
                fontWeight: 'bold',
                mixBlendMode: 'difference',
                color: '#00ff41',
              }}>
                {progress}%
              </div>
            </div>
          </div>

          {/* Status message */}
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#ffff00',
              fontSize: '12px',
              fontFamily: '"VT323", monospace',
              fontSize: '18px',
              textAlign: 'center',
              maxWidth: '380px',
              padding: '0 20px',
            }}
          >
            {message}
          </motion.div>

          {/* Blinking cursor */}
          <div style={{
            color: '#00ff41',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '14px',
            animation: 'blink 0.8s step-end infinite',
          }}>
            ▮
          </div>

          {isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                color: '#00ff41',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
              }}
            >
              ✓ SUFFERING LOADED
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
