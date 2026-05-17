import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from './SoundManager';

const STORAGE_KEY = 'applykaro_sound_enabled';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === null ? true : v === 'true';
    } catch { return true; }
  });
  const [labelVisible, setLabelVisible] = useState(false);

  // Sync engine + localStorage on change
  useEffect(() => {
    soundEngine.enabled = enabled;
    try { localStorage.setItem(STORAGE_KEY, String(enabled)); } catch {}
  }, [enabled]);

  // Sync on initial mount too
  useEffect(() => { soundEngine.enabled = enabled; }, []); // eslint-disable-line

  const toggle = () => {
    const next = !enabled;
    soundEngine.enabled = next;
    setEnabled(next);
    if (next) setTimeout(() => soundEngine.notification(), 60);
    setLabelVisible(true);
    setTimeout(() => setLabelVisible(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 12,
      right: 10,
      zIndex: 8600,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      pointerEvents: 'none',
    }}>
      {/* Confirmation flash label */}
      <AnimatePresence>
        {labelVisible && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: enabled ? '#00ff41' : '#ff4444',
              background: 'rgba(0,0,0,0.9)',
              border: `1px solid ${enabled ? '#163316' : '#440000'}`,
              padding: '2px 7px',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            AUDIO {enabled ? 'ENABLED' : 'MUTED'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
        title={enabled ? 'Mute all sounds' : 'Enable sounds'}
        style={{
          pointerEvents: 'all',
          background: 'rgba(0, 6, 0, 0.93)',
          border: `1px solid ${enabled ? '#163316' : '#440000'}`,
          color: enabled ? '#00aa28' : '#882222',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '9px',
          padding: '5px 9px',
          cursor: 'pointer',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: enabled
            ? '0 0 8px rgba(0,255,65,0.08)'
            : '0 0 8px rgba(255,0,0,0.08)',
          transition: 'border-color 0.3s, color 0.3s, box-shadow 0.3s',
        }}
      >
        <span style={{ fontSize: '12px' }}>{enabled ? '🔊' : '🔇'}</span>
        <span style={{ whiteSpace: 'nowrap' }}>
          SURVEILLANCE AUDIO: {enabled ? 'ON' : 'OFF'}
        </span>
      </motion.button>
    </div>
  );
}
