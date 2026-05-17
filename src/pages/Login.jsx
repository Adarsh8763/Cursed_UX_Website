import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Popup from '../components/Popup';
import JumpScare from '../components/JumpScare';
import MovingButton from '../components/MovingButton';
import FakeLoader from '../components/FakeLoader';
import useJumpScare from '../hooks/useJumpScare';
import useCursorChaos from '../hooks/useCursorChaos';
import { soundEngine } from '../components/SoundManager';
import { validatePassword, getPasswordStrength } from '../utils/fakeCaptcha';
import { WRONG_PASSWORD_MESSAGES, getRandomMessage } from '../utils/randomMessages';

const CAPTCHA_ITEMS = [
  { id: 1, emoji: '😭', label: 'Crying due to form validation', isCorrect: true },
  { id: 2, emoji: '🦕', label: 'Government-approved dinosaur', isCorrect: true },
  { id: 3, emoji: '😁', label: 'Suspicious optimism', isCorrect: false },
  { id: 4, emoji: '📋', label: 'Infinite form loop', isCorrect: true },
  { id: 5, emoji: '🌈', label: 'Unauthorized happiness', isCorrect: false },
  { id: 6, emoji: '💀', label: 'Previous applicant', isCorrect: true },
];

export default function Login() {
  const navigate = useNavigate();
  const { jumpscare, startRandomJumpScares } = useJumpScare();
  const { triggerCursorChaos } = useCursorChaos();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSessionTimeout, setShowSessionTimeout] = useState(false);
  const [showCapsLock, setShowCapsLock] = useState(false);
  const [passwordShaking, setPasswordShaking] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaSelected, setCaptchaSelected] = useState([]);
  const [captchaError, setCaptchaError] = useState('');
  const [showEmployeeEgg, setShowEmployeeEgg] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: 'No Hope', color: '#333' });
  const [loginPopupMsg, setLoginPopupMsg] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const passwordToggleCount = useRef(0);
  const sessionTimerRef = useRef(null);

  // Start jumpscares
  useEffect(() => {
    const cleanup = startRandomJumpScares(12000, 35000);
    return cleanup;
  }, [startRandomJumpScares]);

  // Random password visibility toggle
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setShowPassword(prev => !prev);
        soundEngine.glitchStatic();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Random caps lock warning
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setShowCapsLock(true);
        soundEngine.notification();
        setTimeout(() => setShowCapsLock(false), 3000);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Session timeout popup
  useEffect(() => {
    const schedule = () => {
      sessionTimerRef.current = setTimeout(() => {
        setShowSessionTimeout(true);
        soundEngine.siren();
        schedule();
      }, 25000 + Math.random() * 20000);
    };
    schedule();
    return () => clearTimeout(sessionTimerRef.current);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    soundEngine.keyPress();
    // Easter egg: typing 123456
    if (e.target.value === '123456') {
      setShowEmployeeEgg(true);
      soundEngine.successFanfare();
    }
    setInputShake(true);
    setTimeout(() => setInputShake(false), 300);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    soundEngine.keyPress();
    setPasswordStrength(getPasswordStrength(val));
    setPasswordShaking(true);
    setTimeout(() => setPasswordShaking(false), 200);
  };

  const handleTogglePassword = () => {
    passwordToggleCount.current += 1;
    setShowPassword(prev => !prev);
    triggerCursorChaos(2000);
  };

  const handleCaptchaToggle = (id) => {
    soundEngine.keyPress();
    setCaptchaSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const validateCaptcha = () => {
    const correctIds = CAPTCHA_ITEMS.filter(c => c.isCorrect).map(c => c.id);
    const allCorrect = correctIds.every(id => captchaSelected.includes(id));
    const noWrong = captchaSelected.every(id => correctIds.includes(id));
    return allCorrect && noWrong;
  };

  const handleLogin = () => {
    if (!username || !password) {
      setErrorMsg('Username and password are mandatory by law (Form 7-A, Section 3).');
      soundEngine.xpError();
      return;
    }

    // Show captcha on first try
    if (!showCaptcha) {
      setShowCaptcha(true);
      soundEngine.modemConnect();
      return;
    }

    if (!validateCaptcha()) {
      setCaptchaError(getRandomMessage([
        "WRONG! You selected happiness. Unacceptable.",
        "Incorrect. Emotional damage not validated.",
        "CAPTCHA FAILED. Are you even suffering?",
        "The pigeon rejected your selection.",
      ]));
      soundEngine.cartoonScream();
      return;
    }

    const { isValid, errors } = validatePassword(password);

    if (!isValid) {
      const errMsg = getRandomMessage(WRONG_PASSWORD_MESSAGES) + '\n\nViolations:\n' + errors.join('\n');
      setErrorMsg(errMsg);
      setAttempts(prev => prev + 1);
      soundEngine.dinosaurRoar();
      triggerCursorChaos(3000);
      return;
    }

    // Start loading
    setIsLoading(true);
    setErrorMsg('');
    soundEngine.modemConnect();

    // Show a popup during loading
    setTimeout(() => {
      setLoginPopupMsg('Verifying your emotional damage level...');
      setShowLoginPopup(true);
    }, 1500);

    setTimeout(() => {
      setShowLoginPopup(false);
      setIsLoading(false);
      navigate('/form');
    }, 4500);
  };

  return (
    <motion.div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0020 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FakeLoader isVisible={isLoading} duration={4000} />
      <JumpScare jumpscare={jumpscare} />

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="gov-header" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        🇮🇳 ApplyKaro.gov — LOGIN PORTAL — SECURE (HAHA) 🇮🇳
      </div>

      <div style={{ marginTop: '40px', width: '100%', maxWidth: '480px' }}>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '30px' }}
          animate={inputShake ? { x: [-3, 3, -3, 3, 0] } : {}}
        >
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#ffff00',
            letterSpacing: '3px',
            marginBottom: '12px',
          }}>
            MINISTRY OF INTERNET LICENSING
          </div>
          <h1 style={{
            fontFamily: '"VT323", monospace',
            fontSize: '3.5rem',
            color: '#00ff41',
            textShadow: '0 0 20px #00ff41',
            margin: 0,
          }}>
            SECURE LOGIN
          </h1>
          <p style={{
            fontFamily: '"Comic Sans MS", cursive',
            fontSize: '11px',
            color: '#666',
            marginTop: '8px',
          }}>
            (Nothing about this is secure. You have been warned.)
          </p>
        </motion.div>

        {/* Login form */}
        <motion.div
          style={{
            background: 'rgba(0,0,0,0.9)',
            border: '2px solid #00ff41',
            padding: '30px',
            position: 'relative',
          }}
          animate={{
            borderColor: ['#00ff41', '#ff0040', '#ffff00', '#00ff41'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Scanline */}
          <div className="scanline-overlay" />

          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#00ff41',
              display: 'block',
              marginBottom: '6px',
            }}>
              CITIZEN ID / AADHAAR / PIGEON NUMBER *
            </label>
            <motion.input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="cursed-input"
              placeholder="Enter your government-issued identity..."
              animate={inputShake ? { x: [-3, 3, -3, 3, 0] } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'block' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#00ff41',
              display: 'block',
              marginBottom: '4px',
            }}>
              PASSWORD * <span style={{ color: '#666', fontSize: '9px' }}>(must include emoji + Sanskrit word + dinosaur name)</span>
            </label>

            {/* Password rules tooltip */}
            <div style={{
              fontFamily: '"VT323", monospace',
              fontSize: '14px',
              color: '#ff6600',
              marginBottom: '8px',
              lineHeight: 1.5,
            }}>
              Example: 🦖धर्मRaptor | 😎mokshaTRex | 🤯karmaBrachiosaurus
            </div>

            <div style={{ position: 'relative' }}>
              <motion.input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className="cursed-input"
                placeholder="🦕dharmaRaptor123..."
                animate={passwordShaking ? { x: [-4, 4, -4, 4, 0], rotate: [-1, 1, -1, 1, 0] } : {}}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'block', paddingRight: '40px' }}
              />
              <button
                onClick={handleTogglePassword}
                style={{
                  position: 'absolute', right: '8px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: '#00ff41', cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ background: '#111', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: passwordStrength.color,
                      borderRadius: '3px',
                    }}
                    animate={{ width: `${passwordStrength.strength}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
                <div style={{
                  fontFamily: '"VT323", monospace',
                  fontSize: '14px',
                  color: passwordStrength.color,
                  marginTop: '4px',
                }}>
                  Strength: {passwordStrength.label}
                </div>
              </div>
            )}

            {/* Random caps lock warning */}
            <AnimatePresence>
              {showCapsLock && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    background: '#ff0040',
                    color: 'white',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '10px',
                    padding: '4px 8px',
                    marginTop: '4px',
                  }}
                >
                  ⚠️ CAPS LOCK IS ON (maybe) — Your confidence is too loud
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, x: [-3, 3, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(255,0,64,0.1)',
                  border: '1px solid #ff0040',
                  padding: '12px',
                  marginBottom: '16px',
                  fontFamily: '"VT323", monospace',
                  fontSize: '16px',
                  color: '#ff0040',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={16} style={{ marginRight: '8px' }} />
                {errorMsg}
                {attempts >= 2 && (
                  <p style={{ color: '#ffff00', fontSize: '14px', marginTop: '8px' }}>
                    Attempt #{attempts}: Each failure makes the government stronger.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CAPTCHA */}
          <AnimatePresence>
            {showCaptcha && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginBottom: '20px',
                  border: '2px solid #ffff00',
                  padding: '16px',
                  background: 'rgba(255,255,0,0.03)',
                }}
              >
                <p style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '8px',
                  color: '#ffff00',
                  marginBottom: '12px',
                  lineHeight: 1.8,
                }}>
                  CAPTCHA: Select all images with emotional damage.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {CAPTCHA_ITEMS.map(item => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleCaptchaToggle(item.id)}
                      style={{
                        background: captchaSelected.includes(item.id) ? 'rgba(0,255,65,0.2)' : '#111',
                        border: captchaSelected.includes(item.id) ? '2px solid #00ff41' : '1px solid #333',
                        padding: '10px 6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#fff',
                        fontSize: '9px',
                        fontFamily: '"Share Tech Mono", monospace',
                        textAlign: 'center',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                {captchaError && (
                  <p style={{
                    color: '#ff0040',
                    fontFamily: '"VT323", monospace',
                    fontSize: '16px',
                    marginTop: '8px',
                  }}>
                    {captchaError}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Moving Login button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', minHeight: '80px', alignItems: 'center' }}>
            <MovingButton onClick={handleLogin} escapeTimes={3} style={{ minWidth: '200px' }}>
              🔐 SUBMIT (IF YOU DARE)
            </MovingButton>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none',
                color: '#444',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '10px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              ← Back (to more suffering)
            </button>
          </div>
        </motion.div>

        {/* Password help */}
        <div style={{
          marginTop: '16px',
          border: '1px solid #333',
          padding: '12px',
          background: 'rgba(0,0,0,0.6)',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#555',
          lineHeight: 1.8,
        }}>
          <p style={{ color: '#333', marginBottom: '8px' }}>📋 PASSWORD REQUIREMENTS (Circular No. 7B/2024)</p>
          <p>• Must contain 1 emoji (government-approved list only)</p>
          <p>• Must contain 1 Sanskrit word (see Appendix Z of Form 99)</p>
          <p>• Must contain 1 dinosaur name (extinct species only)</p>
          <p>• Must not express joy</p>
          <p>• Must be simultaneously too long and too short</p>
          <p style={{ color: '#ff0040', marginTop: '8px' }}>*Non-compliance will result in emotional counselling.</p>
        </div>
      </div>

      {/* Session Timeout Popup */}
      <Popup
        isOpen={showSessionTimeout}
        onClose={() => {
          setShowSessionTimeout(false);
          setUsername('');
          setPassword('');
          soundEngine.xpError();
        }}
        title="SESSION EXPIRED — YOU ARE TOO SLOW"
        type="error"
      >
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: '#ff0040', lineHeight: 1.6 }}>
          <p>Your session has expired due to:</p>
          <ul style={{ color: '#ffff00', marginLeft: '20px', fontSize: '16px' }}>
            <li>Excessive thinking</li>
            <li>Reading instructions (not allowed)</li>
            <li>Blinking more than twice</li>
          </ul>
          <p style={{ color: '#00ff41', marginTop: '8px' }}>All your progress has been lost. Thank you for your sacrifice.</p>
        </div>
      </Popup>

      {/* Employee Easter Egg */}
      <Popup
        isOpen={showEmployeeEgg}
        onClose={() => { setShowEmployeeEgg(false); setUsername(''); }}
        title="🎉 CONGRATULATIONS — DEPT. OF HUMAN RESOURCES"
        type="skull"
      >
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '22px', color: '#ffff00', lineHeight: 1.6, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏛️</div>
          <p>CONGRATULATIONS!</p>
          <p style={{ color: '#00ff41', fontSize: '18px' }}>You are now a Government Employee.</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            Please report to Counter 7 and wait for the next 40 years.<br />
            Salary: ₹7 per government decade.<br />
            Benefits: Existential dread (unlimited).
          </p>
        </div>
      </Popup>

      {/* Login loading popup */}
      <Popup
        isOpen={showLoginPopup}
        onClose={() => {}}
        title="VERIFICATION IN PROGRESS — DO NOT CLOSE"
        type="wifi"
        message={loginPopupMsg}
      />
    </motion.div>
  );
}
