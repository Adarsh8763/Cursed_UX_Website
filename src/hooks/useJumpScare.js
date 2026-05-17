import { useState, useEffect, useCallback, useRef } from 'react';
import { JUMPSCARE_MESSAGES } from '../utils/randomMessages';
import { soundEngine } from '../components/SoundManager';

export default function useJumpScare() {
  const [jumpscare, setJumpscare] = useState(null);
  const timerRef = useRef(null);

  const triggerJumpScare = useCallback(() => {
    const msg = JUMPSCARE_MESSAGES[Math.floor(Math.random() * JUMPSCARE_MESSAGES.length)];
    const positions = [
      { top: '10%', left: '-20%' },
      { top: '20%', right: '-20%' },
      { bottom: '10%', left: '-20%' },
      { top: '-20%', left: '30%' },
      { bottom: '-20%', right: '30%' },
    ];
    const pos = positions[Math.floor(Math.random() * positions.length)];

    setJumpscare({ ...msg, position: pos, id: Date.now() });

    // Play a random scary sound
    const sounds = ['roar', 'scream', 'boom', 'error', 'siren'];
    soundEngine.glitchStatic();
    setTimeout(() => {
      const s = sounds[Math.floor(Math.random() * sounds.length)];
      switch (s) {
        case 'roar': soundEngine.dinosaurRoar(); break;
        case 'scream': soundEngine.cartoonScream(); break;
        case 'boom': soundEngine.vineBoom(); break;
        case 'error': soundEngine.xpError(); break;
        case 'siren': soundEngine.siren(); break;
        default: break;
      }
    }, 100);

    setTimeout(() => setJumpscare(null), 2500);
  }, []);

  const startRandomJumpScares = useCallback((minMs = 15000, maxMs = 35000) => {
    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs);
      timerRef.current = setTimeout(() => {
        triggerJumpScare();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [triggerJumpScare]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return { jumpscare, triggerJumpScare, startRandomJumpScares };
}
