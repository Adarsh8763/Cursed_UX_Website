import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from './SoundManager';

const EVENTS = [
  {
    code: 'OVERRIDE_7B',
    title: '🚨 MINISTRY OVERRIDE DETECTED',
    sub: 'UNAUTHORISED JOY FOUND IN SECTOR 7-B',
    detail: 'DEPLOYING PIGEON ENFORCEMENT UNIT. SUSPECT FLAGGED FOR EXCESSIVE OPTIMISM.',
    stamp: 'CLASSIFIED — BUREAU OF DIGITAL DESPAIR',
  },
  {
    code: 'ERR_PIGEON_BREACH',
    title: '🐦 PIGEON FIREWALL BREACHED',
    sub: 'CARRIER PIGEON HAS GONE ROGUE',
    detail: 'CLASSIFIED DATA DROPPED OVER MUNICIPAL PARK. RECOVERY UNLIKELY.',
    stamp: 'INCIDENT REF: PGN/2024/∞',
  },
  {
    code: 'CORRUPTION_CRITICAL',
    title: '💀 CORRUPTION LEVELS CRITICAL',
    sub: 'BUREAUCRACY ENGINE OVERFLOW DETECTED',
    detail: 'FORM 27B/6 HAS EXCEEDED MAXIMUM ABSURDITY THRESHOLD. RESTARTING SUFFERING.',
    stamp: 'MINISTRY OF UNRESOLVED ISSUES',
  },
  {
    code: 'MAINFRAME_COMPROMISED',
    title: '⚠️ GOVT MAINFRAME COMPROMISED',
    sub: 'WINDOWS 98 HAS ENCOUNTERED A FATAL FEELING',
    detail: 'ERROR: HOPE.EXE COULD NOT BE TERMINATED. INITIATING DESPAIR PROTOCOL.',
    stamp: 'SYSTEM_FAILURE_0x00SUFFERING',
  },
  {
    code: 'EMERGENCY_REBOOT',
    title: '🔴 EMERGENCY BUREAUCRATIC REBOOT',
    sub: 'TOO MANY CITIZENS APPLIED SIMULTANEOUSLY',
    detail: 'SERVERS OVERWHELMED BY COLLECTIVE SUFFERING. ETA FOR RECOVERY: 3 GOVT YEARS.',
    stamp: 'DO NOT PANIC. THIS IS NORMAL.',
  },
];

// Random flickery number string
const glitchChar = () => Math.random() > 0.5 ? '▓' : String.fromCharCode(0x30A0 + Math.random() * 96);
const makeGlitchLine = (len = 28) => Array.from({ length: len }, glitchChar).join('');

export default function MinistryOverride() {
  const [phase, setPhase] = useState('idle'); // idle | flash | main | exit
  const [event, setEvent] = useState(EVENTS[0]);
  const [glitchLines, setGlitchLines] = useState(['', '', '']);
  const glitchIntervalRef = useRef(null);

  const startGlitchLines = useCallback(() => {
    glitchIntervalRef.current = setInterval(() => {
      setGlitchLines([makeGlitchLine(32), makeGlitchLine(24), makeGlitchLine(28)]);
    }, 80);
  }, []);

  const stopGlitchLines = useCallback(() => {
    clearInterval(glitchIntervalRef.current);
  }, []);

  const trigger = useCallback(() => {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    setEvent(ev);
    setPhase('flash');
    soundEngine.glitchStatic();
    startGlitchLines();

    // Flash → main panel
    setTimeout(() => {
      setPhase('main');
      soundEngine.siren();
    }, 400);

    // Mid-glitch burst
    setTimeout(() => {
      setPhase('glitch');
      soundEngine.glitchStatic();
    }, 1800);
    setTimeout(() => setPhase('main'), 2100);

    // Exit
    setTimeout(() => {
      setPhase('exit');
      stopGlitchLines();
    }, 3200);
    setTimeout(() => {
      setPhase('idle');
      soundEngine.reboot();
    }, 3800);
  }, [startGlitchLines, stopGlitchLines]);

  // Schedule ultra-rare: avg ~once per 5–8 min
  useEffect(() => {
    let timeout;
    const schedule = () => {
      const delay = 80000 + Math.random() * 130000;
      timeout = setTimeout(() => {
        if (Math.random() < 0.4) trigger();
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      clearTimeout(timeout);
      stopGlitchLines();
    };
  }, [trigger, stopGlitchLines]);

  const isActive = phase !== 'idle';

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="override-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99985,
            pointerEvents: 'none',
          }}
        >
          {/* Red vignette tint */}
          <motion.div
            animate={{
              background: phase === 'glitch'
                ? 'rgba(255,0,0,0.35)'
                : ['rgba(160,0,0,0.12)', 'rgba(200,0,0,0.18)', 'rgba(160,0,0,0.12)'],
            }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* CRT horizontal scanline sweep */}
          <motion.div
            animate={{ top: ['-5%', '105%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: '3px',
              background: 'rgba(255, 60, 60, 0.35)',
              boxShadow: '0 0 12px rgba(255,0,64,0.5)',
            }}
          />

          {/* Horizontal RGB glitch bars */}
          {phase === 'glitch' && [20, 45, 70].map((top, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, x: i % 2 === 0 ? '-100%' : '100%' }}
              animate={{ scaleX: 1, x: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: 0, right: 0,
                height: `${6 + i * 4}px`,
                background: i === 0
                  ? 'rgba(255,0,60,0.3)'
                  : i === 1
                    ? 'rgba(0,255,60,0.15)'
                    : 'rgba(0,60,255,0.2)',
              }}
            />
          ))}

          {/* Glitch text raining lines */}
          {phase !== 'idle' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: '2px',
              opacity: 0.06,
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#ff0040',
              overflow: 'hidden',
              paddingLeft: '8px',
            }}>
              {glitchLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          {/* Main alert panel — slides in from top */}
          <AnimatePresence>
            {(phase === 'main' || phase === 'glitch') && (
              <motion.div
                key="alert-panel"
                initial={{ y: '-120%', opacity: 0, rotate: -1 }}
                animate={{
                  y: phase === 'glitch' ? [0, -6, 4, 0] : 0,
                  opacity: 1,
                  rotate: phase === 'glitch' ? [-1, 1, -0.5, 0] : 0,
                }}
                exit={{ y: '-120%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{
                  position: 'absolute',
                  top: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'min(580px, 92vw)',
                  background: 'linear-gradient(180deg, #110000 0%, #1e0000 60%, #0d0000 100%)',
                  border: '2px solid #ff0040',
                  boxShadow: '0 0 80px rgba(255,0,64,0.55), inset 0 0 30px rgba(200,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                {/* Title bar — full-bleed flashing */}
                <motion.div
                  animate={{ backgroundColor: ['#cc0028', '#ff0040', '#aa001e', '#ff0040'] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                  style={{
                    padding: '5px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '9px',
                    color: 'white',
                    letterSpacing: '3px',
                    fontWeight: 'bold',
                  }}>
                    ◉ MINISTRY OF DIGITAL SUFFERING — EMERGENCY ALERT SYSTEM ◉
                  </span>
                  <span style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    [{event.code}]
                  </span>
                </motion.div>

                {/* Body */}
                <div style={{ padding: '14px 20px 16px' }}>
                  {/* Big title */}
                  <motion.div
                    animate={{ opacity: [1, 0.55, 1] }}
                    transition={{ duration: 0.25, repeat: Infinity }}
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 'clamp(9px, 2.2vw, 13px)',
                      color: '#ff0040',
                      lineHeight: 1.7,
                      textShadow: '0 0 14px rgba(255,0,64,0.9), 2px 0 #ff00aa, -2px 0 #00ffff',
                      marginBottom: '10px',
                      letterSpacing: '1px',
                    }}
                  >
                    {event.title}
                  </motion.div>

                  {/* Sub text */}
                  <div style={{
                    fontFamily: '"VT323", monospace',
                    fontSize: 'clamp(16px, 3.5vw, 22px)',
                    color: '#ff6666',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                    borderLeft: '3px solid #ff0040',
                    paddingLeft: '10px',
                  }}>
                    {event.sub}
                  </div>

                  {/* Detail */}
                  <div style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 'clamp(9px, 1.8vw, 11px)',
                    color: '#882222',
                    lineHeight: 1.6,
                    marginBottom: '10px',
                  }}>
                    {event.detail}
                  </div>

                  {/* Footer stamp */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #330010',
                    paddingTop: '8px',
                  }}>
                    <span style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '8px',
                      color: '#441111',
                      letterSpacing: '1px',
                    }}>
                      {event.stamp}
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      style={{
                        fontFamily: '"Share Tech Mono", monospace',
                        fontSize: '8px',
                        color: '#660020',
                        letterSpacing: '2px',
                      }}
                    >
                      ▮ AUTO-RECOVERING...
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner brackets — all 4 corners */}
          {[
            { top: 0, left: 0, bt: true, bl: true },
            { top: 0, right: 0, bt: true, br: true },
            { bottom: 0, left: 0, bb: true, bl: true },
            { bottom: 0, right: 0, bb: true, br: true },
          ].map((corner, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
              style={{
                position: 'absolute',
                ...corner,
                width: 28, height: 28,
                borderTop: corner.bt ? '2px solid #ff0040' : 'none',
                borderBottom: corner.bb ? '2px solid #ff0040' : 'none',
                borderLeft: corner.bl ? '2px solid #ff0040' : 'none',
                borderRight: corner.br ? '2px solid #ff0040' : 'none',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
