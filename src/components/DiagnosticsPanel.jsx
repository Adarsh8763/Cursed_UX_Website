import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data ---
const CYCLE_STATUSES = [
  { label: 'Pigeon Firewall',       value: 'ACTIVE',             color: '#00ff41' },
  { label: 'Citizen Happiness',     value: 'ILLEGAL',            color: '#ff0040' },
  { label: 'Bureaucracy Engine',    value: 'ONLINE',             color: '#00ff41' },
  { label: 'Govt Servers',          value: 'Barely Functional',  color: '#ff6600' },
  { label: 'Emotional Damage',      value: 'CRITICAL',           color: '#ff0040' },
  { label: 'Corruption Scanner',    value: 'DISABLED',           color: '#ff0040' },
  { label: 'Hope Detection System', value: 'FAILED',             color: '#ff0040' },
  { label: 'Aadhaar Sync',          value: 'Timed Out (Again)',  color: '#ffff00' },
  { label: 'Common Sense Module',   value: 'NOT FOUND',          color: '#ff0040' },
  { label: 'Form 27B/6 Status',     value: 'Infinite Loop',      color: '#ffff00' },
  { label: 'Pigeon Carrier',        value: 'In Transit (3yrs)',   color: '#ffff00' },
  { label: 'Digital Empathy',       value: 'UNINSTALLED',        color: '#ff0040' },
  { label: 'Windows 98 Core',       value: 'Rebooting...',       color: '#ffff00' },
  { label: 'Suffering Index',       value: 'HIGH',               color: '#ff6600' },
  { label: 'Digital Suffering DSI', value: '9847 / 9999',        color: '#ff0040' },
];

function fakePercent(seed) {
  return ((seed * 37 + Date.now() / 10000) % 100).toFixed(1);
}

function fakeMs(seed) {
  return Math.floor(150 + (seed * 53 + Date.now() / 5000) % 800);
}

export default function DiagnosticsPanel() {
  const [visible, setVisible]       = useState(false);
  const [minimized, setMinimized]   = useState(false);
  const [statusIdx, setStatusIdx]   = useState(0);
  const [tick, setTick]             = useState(0);
  const seedRef = useRef(Math.random() * 100);

  // Appear after 2s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Cycle status every 3.2s
  useEffect(() => {
    const i = setInterval(() => setStatusIdx(s => (s + 1) % CYCLE_STATUSES.length), 3200);
    return () => clearInterval(i);
  }, []);

  // Tick every second for live metrics
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (!visible) return null;

  const current = CYCLE_STATUSES[statusIdx];
  const cpu     = fakePercent(seedRef.current + tick * 0.3);
  const ram     = fakePercent(seedRef.current * 1.4 + tick * 0.1);
  const latency = fakeMs(seedRef.current + tick * 0.7);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: 60,   // sit above SoundToggle
        right: 10,
        zIndex: 8500,
        width: minimized ? '130px' : '210px',
        background: 'rgba(0, 6, 0, 0.93)',
        border: '1px solid #163316',
        fontFamily: '"Share Tech Mono", monospace',
        overflow: 'hidden',
        boxShadow: '0 0 14px rgba(0,255,65,0.1)',
        transition: 'width 0.3s ease',
      }}
    >
      {/* ── Titlebar ── */}
      <div
        onClick={() => setMinimized(m => !m)}
        style={{
          background: 'linear-gradient(90deg, #001800, #002a00)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: '1px solid #163316',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '9px', color: '#00aa28', letterSpacing: '1px' }}
        >
          ▮ GOV_SYS_DIAG v2.0
        </motion.span>
        <span style={{ fontSize: '9px', color: '#1eca1eff' }}>
          {minimized ? '[+]' : '[−]'}
        </span>
      </div>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '7px 9px', display: 'flex', flexDirection: 'column', gap: '3px' }}>

              {/* Static portal info */}
              <Row label="PORTAL"  value="ApplyKaro.gov" color="#00ff41" />
              <Row label="STATUS"  value="SUFFERING"     color="#ff6600" />

              <Divider />

              {/* Live fake metrics */}
              <div style={{ fontSize: '8px', color: '#1eca1eff', marginBottom: '1px', letterSpacing: '1px' }}>
                LIVE METRICS
              </div>
              <Row label="CPU"     value={`${cpu}%`}     color={parseFloat(cpu) > 80 ? '#ff0040' : '#ffff00'} />
              <Row label="RAM"     value={`${ram}%`}     color={parseFloat(ram) > 85 ? '#ff0040' : '#ff6600'} />
              <Row label="LATENCY" value={`${latency}ms`} color={latency > 600 ? '#ff0040' : '#ffff00'} />

              <Divider />

              {/* Rotating diagnostic */}
              <div style={{ fontSize: '8px', color: '#1eca1eff', marginBottom: '2px', letterSpacing: '1px' }}>
                LIVE DIAGNOSTIC
              </div>

              <div style={{ position: 'relative', height: '28px', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={statusIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ position: 'absolute', width: '100%' }}
                  >
                    <div style={{ fontSize: '8px', color: '#1a3a1a', marginBottom: '1px' }}>
                      {current.label}:
                    </div>
                    <div style={{ fontSize: '10px', color: current.color, letterSpacing: '0.5px' }}>
                      {current.value}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Blinking cursor */}
              <div style={{
                fontSize: '9px', color: '#1a3a1a', marginTop: '4px',
                animation: 'blink 0.8s step-end infinite',
              }}>
                ▮_
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '8px', color: '#1eca1eff' }}>{label}</span>
      <span style={{ fontSize: '9px', color }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid #0d260d', margin: '3px 0' }} />;
}
