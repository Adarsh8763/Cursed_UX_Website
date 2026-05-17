import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import JumpScare from '../components/JumpScare';
import useJumpScare from '../hooks/useJumpScare';
import { soundEngine } from '../components/SoundManager';
import { LOADING_MESSAGES, getRandomMessage } from '../utils/randomMessages';

const STEPS = [
  "Initializing suffering protocol...",
  "Consulting government pigeons...",
  "Connecting to Windows 98 servers...",
  "Emotionally profiling applicant...",
  "Checking horoscope compatibility...",
  "Verifying Aadhaar with NASA...",
  "Downloading your dreams to shred them...",
  "Running virus scan on your hopes...",
  "Calculating suffering coefficient...",
  "Forwarding to Dept. of Delays...",
  "Checking pigeon carrier availability...",
  "Processing... ETA: 3 government years...",
  "Almost there (lie)...",
];

export default function Verification() {
  const navigate = useNavigate();
  const { jumpscare, startRandomJumpScares } = useJumpScare();

  const [phase, setPhase] = useState('loading'); // loading | rejected | bsod
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [showSufferMore, setShowSufferMore] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);
  const [showBSOD, setShowBSOD] = useState(false);
  const [bsodTimer, setBsodTimer] = useState(10);
  const intervalRef = useRef(null);
  const stepTimerRef = useRef(null);

  useEffect(() => {
    const cleanup = startRandomJumpScares(25000, 50000);
    return cleanup;
  }, [startRandomJumpScares]);

  // PROGRESS BAR: chaotic, resets at 99%
  useEffect(() => {
    if (phase !== 'loading') return;
    soundEngine.modemConnect();

    let cur = 0;
    let resetsLeft = 1;

    intervalRef.current = setInterval(() => {
      const delta = Math.random() > 0.15 ? Math.random() * 5 + 1 : -(Math.random() * 8 + 2);
      cur = Math.max(0, Math.min(98, cur + delta));

      if (cur >= 97 && resetsLeft > 0) {
        soundEngine.xpError();
        setShowSufferMore(true);
        setTimeout(() => setShowSufferMore(false), 4000);
        cur = 12;
        resetsLeft--;
      }

      setProgress(Math.round(cur));
    }, 300);

    // Step messages
    const scheduleStep = (i) => {
      if (i >= STEPS.length) return;
      stepTimerRef.current = setTimeout(() => {
        setStepIndex(i);
        soundEngine.printer();
        scheduleStep(i + 1);
      }, 2000 + Math.random() * 1500);
    };
    scheduleStep(0);

    // After ~30s: show BSOD flash, then rejection
    const bsodTimeout = setTimeout(() => {
      clearInterval(intervalRef.current);
      setShowBSOD(true);
      soundEngine.reboot();
      setTimeout(() => {
        setShowBSOD(false);
        setProgress(100);
        setPhase('rejected');
        soundEngine.cartoonScream();
      }, 4000);
    }, 30000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(stepTimerRef.current);
      clearTimeout(bsodTimeout);
    };
  }, [phase]);

  // BSOD countdown
  useEffect(() => {
    if (!showBSOD) return;
    const t = setInterval(() => setBsodTimer(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, [showBSOD]);

  const handleCry = () => {
    soundEngine.cartoonScream();
    for (let i = 0; i < 5; i++) setTimeout(() => soundEngine.xpError(), i * 300);
  };

  const handleAcceptFate = () => {
    soundEngine.evilLaugh();
    setShowConfirmDialog(true);
    setConfirmCount(0);
  };

  const handleConfirm = () => {
    setConfirmCount(prev => prev + 1);
    soundEngine.notification();
    if (confirmCount >= 3) {
      setShowConfirmDialog(false);
      navigate('/');
    }
  };

  const handleAppealAgain = () => {
    soundEngine.siren();
    navigate('/');
  };

  // BSOD Screen
  if (showBSOD) {
    return (
      <div className="bsod">
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
          :( Your application ran into a problem.
        </div>
        <p style={{ color: '#ffffff', fontSize: '13px', maxWidth: '500px', lineHeight: 1.8 }}>
          GOVERNMENT_EMOTIONAL_DAMAGE_EXCEPTION<br /><br />
          We've collected some error info, and we're restarting your suffering for you.<br /><br />
          {bsodTimer}% complete<br /><br />
          If you'd like to know more, you can search online later for this error:<br />
          <strong>AADHAAR_PIGEON_MISMATCH_FATAL_ERROR_0x00000000SUFFERING</strong>
        </p>
        <motion.div
          style={{ fontSize: '4rem', marginTop: '30px' }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          😢
        </motion.div>
      </div>
    );
  }

  // REJECTION SCREEN
  if (phase === 'rejected') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at center, #1a0000 0%, #0a0a0a 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          gap: '24px',
          position: 'relative',
        }}
      >
        <JumpScare jumpscare={jumpscare} />

        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '5rem' }}
        >
          💀
        </motion.div>

        <motion.h1
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 'clamp(14px, 4vw, 28px)',
            color: '#ff0040',
            textShadow: '0 0 30px #ff0040, 4px 4px 0 #000',
            textAlign: 'center',
            lineHeight: 1.8,
          }}
          animate={{
            textShadow: [
              '0 0 30px #ff0040, 4px 4px 0 #000',
              '0 0 50px #ff0040, -4px -4px 0 #000',
              '0 0 30px #ff0040, 4px 4px 0 #000',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          APPLICATION<br />REJECTED<br />SUCCESSFULLY.
        </motion.h1>

        <div style={{
          border: '2px solid #ff0040',
          padding: '20px 32px',
          maxWidth: '500px',
          fontFamily: '"VT323", monospace',
          fontSize: '20px',
          color: '#ff6666',
          lineHeight: 1.7,
          textAlign: 'center',
          background: 'rgba(255,0,64,0.05)',
        }}>
          <p>After careful deliberation (3.7 seconds), your application has been rejected for the following reasons:</p>
          <ul style={{ textAlign: 'left', marginTop: '12px', color: '#ffff00' }}>
            <li>Insufficient emotional damage documentation</li>
            <li>Dinosaur preference unverified by ISRO</li>
            <li>Password smelled of optimism</li>
            <li>Pigeon carrier was unavailable</li>
            <li>The government simply didn't feel like it</li>
          </ul>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '12px' }}>
            Reference No: GOV/IUL/2024/REJ/∞<br />
            Please keep this number for your records (it is meaningless).
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
          <motion.button
            onClick={handleAppealAgain}
            style={{
              background: '#ff6600', color: '#000', border: '3px solid #ffff00',
              padding: '14px 28px', fontFamily: '"Press Start 2P", monospace',
              fontSize: '9px', cursor: 'pointer', letterSpacing: '1px',
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 APPEAL AGAIN (LOOPS BACK)
          </motion.button>

          <motion.button
            onClick={handleCry}
            style={{
              background: '#003366', color: '#6699ff', border: '2px solid #6699ff',
              padding: '14px 28px', fontFamily: '"Press Start 2P", monospace',
              fontSize: '9px', cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            😭 CRY
          </motion.button>

          <motion.button
            onClick={handleAcceptFate}
            style={{
              background: '#1a1a1a', color: '#444', border: '2px solid #333',
              padding: '14px 28px', fontFamily: '"Press Start 2P", monospace',
              fontSize: '9px', cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
          >
            ☠️ ACCEPT FATE
          </motion.button>
        </div>

        <p style={{
          fontFamily: '"Comic Sans MS", cursive',
          color: '#333',
          fontSize: '11px',
          marginTop: '8px',
          textAlign: 'center',
        }}>
          The Ministry of Digital Suffering thanks you for your contribution to national bureaucracy.
        </p>

        {/* Multi-confirm dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={{
                  background: '#1a1a1a', border: '3px solid #666',
                  padding: '30px', maxWidth: '360px', textAlign: 'center',
                  fontFamily: '"VT323", monospace',
                }}
              >
                <p style={{ fontSize: '22px', color: '#ccc', marginBottom: '16px', lineHeight: 1.6 }}>
                  {confirmCount === 0 && 'Are you sure you want to accept your fate?'}
                  {confirmCount === 1 && 'Are you REALLY sure? (This is irreversible, probably.)'}
                  {confirmCount === 2 && 'FINAL WARNING: Accepting fate is a one-way door. Click to confirm you have no remaining hope.'}
                  {confirmCount >= 3 && 'Transferring you back to the homepage... (to suffer again)'}
                </p>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>
                  Confirmation {confirmCount + 1} of {confirmCount >= 3 ? confirmCount + 1 : '4 required'}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={handleConfirm} className="cursed-btn" style={{ fontSize: '9px' }}>
                    Yes, I Accept
                  </button>
                  <button
                    onClick={() => { setShowConfirmDialog(false); soundEngine.xpError(); }}
                    className="cursed-btn cursed-btn-danger"
                    style={{ fontSize: '9px' }}
                  >
                    Cancel (Coward)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // LOADING PHASE
  return (
    <motion.div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050510 0%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <JumpScare jumpscare={jumpscare} />

      {/* Background matrix rain effect */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,65,0.01) 20px, rgba(0,255,65,0.01) 21px)',
        pointerEvents: 'none',
        animation: 'noiseShift 0.3s steps(2) infinite',
      }} />

      <div className="gov-header" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        🏛️ FINAL VERIFICATION — MINISTRY OF INTERNET LICENSING — PLEASE WAIT (∞)
      </div>

      {/* Spinning emoji */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } }}
        style={{ fontSize: '4rem', marginTop: '40px', filter: 'drop-shadow(0 0 20px rgba(0,255,65,0.6))' }}
      >
        🏛️
      </motion.div>

      <h1 style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 'clamp(10px, 3vw, 16px)',
        color: '#00ff41',
        textAlign: 'center',
        textShadow: '0 0 20px #00ff41',
        lineHeight: 2,
      }}>
        FINAL VERIFICATION<br />IN PROGRESS
      </h1>

      {/* Suffer more alert */}
      <AnimatePresence>
        {showSufferMore && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            style={{
              background: '#ff0040', color: 'white',
              padding: '16px 24px', textAlign: 'center',
              fontFamily: '"Press Start 2P", monospace', fontSize: '9px', lineHeight: 2,
              border: '3px solid #ffff00',
            }}
          >
            😈 WOULD YOU LIKE TO SUFFER MORE?<br />
            <span style={{ color: '#ffff00', fontSize: '8px' }}>
              Progress reset to 12%. This is intentional. You're welcome.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#00ff41' }}>
            Application Processing
          </span>
          <motion.span
            style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#ffff00' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {progress}%
          </motion.span>
        </div>
        <div style={{
          background: '#111', border: '2px solid #00ff41',
          height: '28px', overflow: 'hidden', position: 'relative',
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00ff41, #ffff00, #ff0040)',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }}
          />
          {/* Animated shine */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'marqueeScroll 2s linear infinite',
          }} />
        </div>
      </div>

      {/* Step message */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: '"VT323", monospace',
          fontSize: '22px',
          color: '#ffff00',
          textAlign: 'center',
          maxWidth: '440px',
          lineHeight: 1.5,
        }}
      >
        ▶ {STEPS[stepIndex % STEPS.length]}
      </motion.div>

      {/* Server list */}
      <div style={{
        border: '1px solid #1a3300',
        padding: '16px',
        width: '100%',
        maxWidth: '500px',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '10px',
        color: '#335533',
        lineHeight: 1.9,
        background: 'rgba(0,0,0,0.7)',
      }}>
        {[
          { server: 'GOV-SERVER-01 (Delhi)', status: '❌ OFFLINE', color: '#440000' },
          { server: 'GOV-SERVER-02 (Mumbai)', status: '⚠️ SUFFERING', color: '#443300' },
          { server: 'WINDOWS-98-MAIN', status: '🔄 REBOOTING (since 2003)', color: '#113300' },
          { server: 'PIGEON-CARRIER-NET', status: '✓ ONLINE (sort of)', color: '#003300' },
          { server: 'NASA-AADHAAR-LINK', status: '🔄 HANDSHAKE IN PROGRESS', color: '#113300' },
        ].map(({ server, status, color }) => (
          <div key={server} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '4px' }}>
            <span style={{ color: '#335533' }}>{server}</span>
            <span style={{ color }}>{status}</span>
          </div>
        ))}
      </div>

      {/* Blinking cursor */}
      <div style={{
        fontFamily: '"Share Tech Mono", monospace', fontSize: '16px',
        color: '#00ff41', animation: 'blink 0.8s step-end infinite',
      }}>
        ▮ Awaiting government approval (estimated: never)
      </div>
    </motion.div>
  );
}
