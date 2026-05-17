import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, Shield, Download, Cookie } from 'lucide-react';
import Popup from '../components/Popup';
import JumpScare from '../components/JumpScare';
import FakeLoader from '../components/FakeLoader';
import useJumpScare from '../hooks/useJumpScare';
import useCursorChaos from '../hooks/useCursorChaos';
import { soundEngine } from '../components/SoundManager';
import { POPUP_MESSAGES, TICKER_MESSAGES, getRandomMessage } from '../utils/randomMessages';

const FLOATING_ADS = [
  { text: '🏆 YOU ARE VISITOR #1,00,00,001! CLAIM PRIZE NOW!', pos: { top: '20%', right: '2%' } },
  { text: '🦠 3 VIRUSES DETECTED ON YOUR SOUL. SCAN NOW FREE!', pos: { bottom: '30%', left: '2%' } },
  { text: '💊 GOVT APPROVED BRAIN UPGRADE ₹99 ONLY!', pos: { top: '60%', right: '2%' } },
];

export default function Home() {
  const navigate = useNavigate();
  const { jumpscare, startRandomJumpScares } = useJumpScare();
  const { triggerCursorChaos } = useCursorChaos();

  const [showCookiePopup, setShowCookiePopup] = useState(true);
  const [showVirusPopup, setShowVirusPopup] = useState(false);
  const [showRandomPopup, setShowRandomPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [randomPopupMsg, setRandomPopupMsg] = useState('');
  const [isInverted, setIsInverted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const [typedKeys, setTypedKeys] = useState('');
  const [showAds, setShowAds] = useState(true);
  const [cursorTrail, setCursorTrail] = useState([]);
  const trailRef = useRef([]);
  const popupTimerRef = useRef(null);
  const invertTimerRef = useRef(null);
  const adTimerRef = useRef(null);

  // Initial loader
  useEffect(() => {
    soundEngine.modemConnect();
    const t = setTimeout(() => {
      setShowLoader(false);
      soundEngine.successFanfare();
      // Show virus popup after a delay
      setTimeout(() => setShowVirusPopup(true), 2000);
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  // Start jumpscares
  useEffect(() => {
    if (!showLoader) {
      const cleanup = startRandomJumpScares(12000, 35000);
      return cleanup;
    }
  }, [showLoader, startRandomJumpScares]);

  // Random popups
  useEffect(() => {
    if (showLoader) return;
    const schedulePopup = () => {
      popupTimerRef.current = setTimeout(() => {
        setRandomPopupMsg(getRandomMessage(POPUP_MESSAGES));
        setShowRandomPopup(true);
        schedulePopup();
      }, 8000 + Math.random() * 12000);
    };
    schedulePopup();
    return () => clearTimeout(popupTimerRef.current);
  }, [showLoader]);

  // Screen inversion flashes
  useEffect(() => {
    if (showLoader) return;
    const scheduleInvert = () => {
      invertTimerRef.current = setTimeout(() => {
        setIsInverted(true);
        soundEngine.glitchStatic();
        setTimeout(() => setIsInverted(false), 300);
        scheduleInvert();
      }, 15000 + Math.random() * 30000);
    };
    scheduleInvert();
    return () => clearTimeout(invertTimerRef.current);
  }, [showLoader]);

  // Download popup
  useEffect(() => {
    if (showLoader) return;
    const t = setTimeout(() => setShowDownloadPopup(true), 12000);
    return () => clearTimeout(t);
  }, [showLoader]);

  // Secret admin mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      setTypedKeys(prev => {
        const newVal = (prev + e.key).slice(-5);
        if (newVal === 'admin') {
          setSecretMode(true);
          soundEngine.evilLaugh();
        }
        return newVal;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor trail
  useEffect(() => {
    const handleMouseMove = (e) => {
      trailRef.current = [
        ...trailRef.current.slice(-8),
        { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() }
      ];
      setCursorTrail([...trailRef.current]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleProceed = () => {
    setIsShaking(true);
    soundEngine.siren();
    triggerCursorChaos(3000);
    setTimeout(() => {
      setIsShaking(false);
      setShowLoader(true);
    }, 500);
    setTimeout(() => navigate('/login'), 4000);
  };

  if (secretMode) {
    return (
      <motion.div
        className="secret-mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '5rem' }}
        >
          👁️
        </motion.div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '14px',
          color: '#aa00ff',
          textShadow: '0 0 20px #aa00ff',
          textAlign: 'center',
          maxWidth: '500px',
          lineHeight: 2,
        }}>
          🔓 SECRET MINISTRY MODE<br />
          <span style={{ color: '#00ff41', fontSize: '10px' }}>Welcome, Digital Overlord</span>
        </div>
        <p style={{ color: '#ffff00', fontFamily: '"VT323", monospace', fontSize: '20px', textAlign: 'center' }}>
          Your suffering ends here.<br />(Just kidding. It doesn't.)
        </p>
        <button
          className="cursed-btn"
          onClick={() => { setSecretMode(false); soundEngine.xpError(); }}
        >
          Return to Suffering
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ filter: isInverted ? 'invert(1)' : 'invert(0)' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}
    >
      <FakeLoader
        isVisible={showLoader}
        onComplete={() => setShowLoader(false)}
        duration={3500}
      />

      {/* Cursor trail */}
      {cursorTrail.map((point, i) => (
        <div
          key={point.id}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: `${(i + 1) * 3}px`,
            height: `${(i + 1) * 3}px`,
            borderRadius: '50%',
            background: `hsl(${i * 30}, 100%, 60%)`,
            opacity: i / cursorTrail.length * 0.6,
            pointerEvents: 'none',
            zIndex: 9990,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s',
          }}
        />
      ))}

      {/* Jumpscares */}
      <JumpScare jumpscare={jumpscare} />

      {/* Warning tape top */}
      <div className="warning-tape" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 8999 }} />

      {/* Government header */}
      <div className="gov-header" style={{ marginTop: '30px' }}>
        🇮🇳 GOVERNMENT OF INDIA — MINISTRY OF DIGITAL SUFFERING — DEPT. OF INTERNET REGULATION 🇮🇳
      </div>

      {/* News ticker */}
      <div className="ticker-wrap">
        <div className="ticker-text">
          {TICKER_MESSAGES.join('  ●  ')}  ●  {TICKER_MESSAGES.join('  ●  ')}
        </div>
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        gap: '30px',
        position: 'relative',
      }}>

        {/* Government seal */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            fontSize: '5rem',
            filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.7))',
          }}
        >
          🏛️
        </motion.div>

        {/* UNAUTHORIZED HAPPINESS banner */}
        <motion.div
          animate={{
            backgroundColor: ['#ff0000', '#ff6600', '#ff0000'],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            padding: '20px 40px',
            border: '4px solid #ffff00',
            textAlign: 'center',
            maxWidth: '700px',
            width: '100%',
          }}
        >
          <motion.h1
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 'clamp(12px, 3vw, 20px)',
              color: '#ffff00',
              lineHeight: 1.8,
              textShadow: '3px 3px #000',
            }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            ⚠️ UNAUTHORIZED HAPPINESS DETECTED ⚠️
          </motion.h1>
        </motion.div>

        {/* Site title */}
        <div style={{ textAlign: 'center' }}>
          <motion.h2
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: '#00ff41',
              textShadow: '0 0 20px #00ff41, 3px 3px 0 #ff0040',
              lineHeight: 1,
            }}
            animate={{
              textShadow: [
                '0 0 20px #00ff41, 3px 3px 0 #ff0040',
                '0 0 20px #00ff41, -3px -3px 0 #0000ff',
                '0 0 20px #00ff41, 3px 3px 0 #ff00ff',
                '0 0 20px #00ff41, 3px 3px 0 #ff0040',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ApplyKaro.gov
          </motion.h2>
          <p style={{
            fontFamily: '"Comic Sans MS", cursive',
            color: '#ffff00',
            fontSize: '16px',
            marginTop: '8px',
          }}>
            India's Most Emotionally Damaging Government Portal™
          </p>
          <p style={{
            fontFamily: '"Share Tech Mono", monospace',
            color: '#666',
            fontSize: '11px',
            marginTop: '4px',
          }}>
            (Est. 1947 | Last Updated: Never | Supports: Only Your Suffering)
          </p>
        </div>

        {/* Alert boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '700px',
          width: '100%',
        }}>
          {[
            { icon: '⚠️', text: 'Apply for Internet Usage License before 2029 or face pigeon-based enforcement.', color: '#ff6600' },
            { icon: '🔒', text: 'This portal uses 0-bit encryption to protect your data from yourself.', color: '#ff0040' },
            { icon: '📋', text: 'Form 27B/6 is required alongside Form 27B/6 (part 2) and Form 27B/6 (part 2, revised).', color: '#ffff00' },
          ].map((alert, i) => (
            <motion.div
              key={i}
              style={{
                background: 'rgba(0,0,0,0.8)',
                border: `2px solid ${alert.color}`,
                padding: '14px',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '11px',
                color: alert.color,
                lineHeight: 1.6,
              }}
              animate={{ borderColor: [alert.color, '#fff', alert.color] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{alert.icon}</span>
              <p style={{ marginTop: '8px' }}>{alert.text}</p>
            </motion.div>
          ))}
        </div>

        {/* PROCEED button */}
        <motion.div
          style={{ marginTop: '20px', textAlign: 'center' }}
          animate={isShaking ? {
            x: [-5, 5, -5, 5, -3, 3, 0],
            y: [-3, 3, -3, 3, -2, 2, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={handleProceed}
            style={{
              background: 'linear-gradient(135deg, #00ff41, #00aa2a)',
              color: '#000',
              border: '3px solid #00ff41',
              padding: '20px 50px',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '2px',
              boxShadow: '0 0 30px rgba(0,255,65,0.7)',
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(0,255,65,0.7)',
                '0 0 50px rgba(0,255,65,1)',
                '0 0 30px rgba(0,255,65,0.7)',
              ],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
          >
            😭 PROCEED TO SUFFER
          </motion.button>
          <p style={{
            fontFamily: '"Comic Sans MS", cursive',
            color: '#666',
            fontSize: '10px',
            marginTop: '8px',
          }}>
            By proceeding, you agree to surrender your sanity, dignity, and lunch breaks.
          </p>
        </motion.div>

        {/* Fake download progress */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          background: '#111',
          border: '1px solid #333',
          padding: '12px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#444',
        }}>
          <p style={{ color: '#666', marginBottom: '8px' }}>Government Update v98.0 downloading...</p>
          <div style={{ background: '#0a0a0a', border: '1px solid #333', height: '12px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: '#003300' }}
              animate={{ width: ['0%', '73%', '45%', '85%', '62%', '91%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <p style={{ marginTop: '4px', color: '#333' }}>ETA: 3 government years</p>
        </div>

        {/* Easter egg hint */}
        <p style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#333',
          userSelect: 'none',
        }}>
          [HINT: Type "admin" to unlock secret mode]
        </p>
      </div>

      {/* Warning tape bottom */}
      <div className="warning-tape" />

      {/* Cookie popup */}
      <Popup
        isOpen={showCookiePopup}
        onClose={() => { setShowCookiePopup(false); soundEngine.notification(); }}
        title="MANDATORY COOKIE ACCEPTANCE"
        type="error"
        showFakeClose
      >
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: '#00ff41', lineHeight: 1.6 }}>
          <Cookie size={40} color="#ff6600" style={{ marginBottom: '12px' }} />
          <p>This portal uses <strong style={{ color: '#ff0040' }}>7,429 tracking cookies</strong> to monitor your emotional state, lunch habits, and deepest regrets.</p>
          <br />
          <p style={{ color: '#ffff00' }}>Your pigeon data may be shared with the Ministry of Feathers.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button className="cursed-btn" onClick={() => { setShowCookiePopup(false); soundEngine.notification(); }}>
            Accept All (Mandatory)
          </button>
          <button
            className="cursed-btn cursed-btn-danger"
            style={{ fontSize: '8px' }}
            onClick={() => { setShowCookiePopup(false); soundEngine.cartoonScream(); }}
          >
            Reject (Will Not Work)
          </button>
        </div>
      </Popup>

      {/* Virus popup */}
      <Popup
        isOpen={showVirusPopup}
        onClose={() => { setShowVirusPopup(false); soundEngine.evilLaugh(); }}
        title="⚠️ CRITICAL SECURITY ALERT — MINISTRY OF CYBER SAFETY"
        type="virus"
        showFakeClose
      >
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: '#ff0040', lineHeight: 1.5 }}>
          <Shield size={48} color="#ff0040" style={{ marginBottom: '12px' }} />
          <p>YOUR PC IS INFECTED WITH:</p>
          <ul style={{ color: '#ffff00', marginLeft: '20px', fontSize: '16px', marginTop: '8px' }}>
            <li>3 Government Forms (Incurable)</li>
            <li>1 Unresolved Aadhaar Issue</li>
            <li>∞ Bureaucratic Loops</li>
            <li>Emotional.exe (Trojan)</li>
          </ul>
          <p style={{ color: '#00ff41', marginTop: '12px', fontSize: '16px' }}>
            Scan Now for only ₹99,999/month.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button className="cursed-btn" onClick={() => setShowVirusPopup(false)}>
            Scan Now (₹99,999)
          </button>
          <button
            className="cursed-btn"
            style={{ background: '#333', color: '#666', fontSize: '8px' }}
            onClick={() => { setShowVirusPopup(false); soundEngine.xpError(); }}
          >
            Ignore (Not Recommended)
          </button>
        </div>
      </Popup>

      {/* Random popup */}
      <Popup
        isOpen={showRandomPopup}
        onClose={() => { setShowRandomPopup(false); }}
        title="GOVERNMENT NOTIFICATION"
        type="default"
        message={randomPopupMsg}
      />

      {/* Fake download popup */}
      <Popup
        isOpen={showDownloadPopup}
        onClose={() => { setShowDownloadPopup(false); soundEngine.printer(); }}
        title="DOWNLOAD COMPLETE"
        type="default"
      >
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: '#00ff41', lineHeight: 1.6 }}>
          <Download size={36} color="#00ff41" style={{ marginBottom: '8px' }} />
          <p>Successfully downloaded:</p>
          <p style={{ color: '#ffff00' }}>• suffering_2024_final_v3_FINAL.pdf (2.4 TB)</p>
          <p style={{ color: '#ff0040' }}>• your_dreams_crushed.exe (running in background)</p>
          <p style={{ color: '#00ff41', marginTop: '8px', fontSize: '14px' }}>Destination: The Void</p>
        </div>
      </Popup>

      {/* Floating ads */}
      {showAds && FLOATING_ADS.map((ad, i) => (
        <motion.div
          key={i}
          className="floating-ad"
          style={{ ...ad.pos }}
          animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => { soundEngine.xpError(); }}
        >
          {ad.text}
          <button
            onClick={(e) => { e.stopPropagation(); soundEngine.cartoonScream(); }}
            style={{
              display: 'block',
              marginTop: '6px',
              background: '#ffff00',
              border: 'none',
              color: '#000',
              padding: '2px 6px',
              fontSize: '9px',
              cursor: 'pointer',
              fontFamily: '"Comic Sans MS", cursive',
              width: '100%',
            }}
          >
            ✕ Close (Won't Work)
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
