import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Popup from '../components/Popup';
import JumpScare from '../components/JumpScare';
import FakeLoader from '../components/FakeLoader';
import useJumpScare from '../hooks/useJumpScare';
import { soundEngine } from '../components/SoundManager';
import { POPUP_MESSAGES, getRandomMessage } from '../utils/randomMessages';

const DINOSAURS = ['Raptor', 'T-Rex', 'Brachiosaurus', 'Stegosaurus', 'Pterodactyl', 'Ankylosaurus', 'Diplodocus', 'Spinosaurus'];
const PURPOSES = ['Memes only', 'Surveillance of neighbours', 'Watching government speeches (mandatory)', 'Downloading pigeon manuals', 'Emotional damage research', 'Filing complaints about this portal'];
const DAMAGE_LEVELS = ['Mild Inconvenience', 'Moderate Suffering', 'Severe Bureaucratic Trauma', 'Existential Crisis', 'Beyond Repair', 'I Have Accepted My Fate'];

export default function Form() {
  const navigate = useNavigate();
  const { jumpscare, startRandomJumpScares } = useJumpScare();

  const [formData, setFormData] = useState({
    aadhaar: '', dinosaur: '', damage: '', purpose: '',
    wifi: '', trauma: '', pigeon: '', sanity: '',
    pigeon_check: false, recovered: false, sanity_surrender: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [scrollReversed, setScrollReversed] = useState(false);
  const [showCryingRoom, setShowCryingRoom] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [termsScrolled, setTermsScrolled] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const popupTimer = useRef(null);
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    const cleanup = startRandomJumpScares(15000, 35000);
    return cleanup;
  }, [startRandomJumpScares]);

  // Periodic random popup
  useEffect(() => {
    const schedule = () => {
      popupTimer.current = setTimeout(() => {
        setPopupMsg(getRandomMessage(POPUP_MESSAGES));
        setShowPopup(true);
        soundEngine.notification();
        schedule();
      }, 18000 + Math.random() * 12000);
    };
    schedule();
    return () => clearTimeout(popupTimer.current);
  }, []);

  // Autosave faker
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = ['Autosaving...', 'Autosave failed 😭', 'Saving to /dev/null...', 'Pigeon carrier dispatched...', 'Autosaved (maybe)'];
      setAutoSaveMsg(getRandomMessage(msgs));
      soundEngine.printer();
      setTimeout(() => setAutoSaveMsg(''), 3000);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  // Random form shake
  useEffect(() => {
    let shakeTimeout;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to trigger
        setIsShaking(true);
        soundEngine.glitchStatic();
        shakeTimeout = setTimeout(() => setIsShaking(false), 400);
      }
    }, 12000);
    return () => {
      clearInterval(interval);
      clearTimeout(shakeTimeout);
    };
  }, []);

  // Scroll reversal
  useEffect(() => {
    let timeout;
    const interval = setInterval(() => {
      setScrollReversed(prev => {
        if (!prev && Math.random() > 0.5) { // 50% chance to trigger if not already reversed
          timeout = setTimeout(() => setScrollReversed(false), 4000 + Math.random() * 2000); // Lasts 4-6s
          return true;
        }
        return prev;
      });
    }, 18000); // Check every 18 seconds
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Actual scroll inversion
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollReversed) {
        e.preventDefault();
        window.scrollBy({
          top: -e.deltaY,
          behavior: 'auto'
        });
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollReversed]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    soundEngine.keyPress();
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.aadhaar || formData.aadhaar.length < 4) errors.aadhaar = 'Aadhaar insufficient. Please provide more soul.';
    if (!formData.dinosaur) errors.dinosaur = 'Favourite dinosaur is mandatory (National Reptile Registry Act 2024).';
    if (!formData.damage) errors.damage = 'Emotional damage level unspecified. Government cannot proceed without your suffering.';
    if (!formData.purpose) errors.purpose = 'Internet purpose not declared. Suspicious.';
    if (!formData.pigeon_check) errors.pigeon_check = 'Pigeon confirmation required.';
    if (!formData.sanity_surrender) errors.sanity_surrender = 'Sanity surrender is non-negotiable.';
    if (!termsAccepted) errors.terms = 'You must read all 847 pages of Terms & Conditions.';
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      soundEngine.xpError();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    setShowLoader(true);
    soundEngine.modemConnect();
    setTimeout(() => {
      setShowLoader(false);
      navigate('/verification');
    }, 4000);
  };

  const inputStyle = {
    background: '#0a0a0a',
    border: '1px solid #00ff41',
    color: '#00ff41',
    padding: '10px 14px',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    marginTop: '6px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '10px',
    color: '#00ff41',
    display: 'block',
    lineHeight: 1.6,
  };

  const errorStyle = {
    color: '#ff0040',
    fontFamily: '"VT323", monospace',
    fontSize: '15px',
    marginTop: '4px',
  };

  const fieldBox = (children, error) => (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );

  return (
    <motion.div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        padding: '0 0 60px',
        position: 'relative',
        overflowX: scrollReversed ? 'scroll' : 'hidden',
      }}
      animate={isShaking ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <FakeLoader isVisible={showLoader} duration={3000} />
      <JumpScare jumpscare={jumpscare} />

      {/* Header */}
      <div className="gov-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        📋 APPLICATION FORM — INTERNET USAGE LICENSE — REF: GOV/IUL/2024/SUFFERING/∞
        {autoSaveMsg && (
          <span style={{ marginLeft: '20px', color: '#ffff00', animation: 'blink 0.5s step-end infinite' }}>
            💾 {autoSaveMsg}
          </span>
        )}
      </div>

      <div className="warning-tape" />

      {/* Scrolling notice */}
      <AnimatePresence>
        {scrollReversed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              background: 'rgba(255,0,64,0.95)',
              color: 'white', padding: '16px 24px',
              fontFamily: '"Press Start 2P", monospace', fontSize: '10px',
              textAlign: 'center', zIndex: 9800, lineHeight: 2,
            }}
          >
            ⚠️ SCROLL DIRECTION REVERSED<br />
            <span style={{ fontSize: '8px', color: '#ffff00' }}>Government Regulation 42-B</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '30px 20px' }}>

        {/* Form header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.h1
            style={{ fontFamily: '"VT323", monospace', fontSize: '3rem', color: '#00ff41', textShadow: '0 0 15px #00ff41' }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            APPLICATION FORM 27B/6
          </motion.h1>
          <p style={{ fontFamily: '"Comic Sans MS", cursive', color: '#666', fontSize: '12px' }}>
            (Also requires Form 27B/6 Part 2, and Form 27B/6 Part 2 Revised, and the original 27B/6 notarized)
          </p>
        </div>

        {/* SECTION 1 */}
        <div style={{ border: '1px solid #1a3300', padding: '20px', marginBottom: '24px', background: 'rgba(0,255,65,0.02)' }}>
          <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#ffff00', marginBottom: '20px', letterSpacing: '2px' }}>
            SECTION 1: PERSONAL IDENTIFICATION (MANDATORY — NO EXCEPTIONS — ESPECIALLY NOT YOURS)
          </h2>

          {fieldBox(
            <>
              <label style={labelStyle}>AADHAAR NUMBER * <span style={{ color: '#ff6600' }}>(Mandatory • Non-Refundable • Soul Required)</span></label>
              <input type="text" value={formData.aadhaar} onChange={e => handleChange('aadhaar', e.target.value)} style={inputStyle} placeholder="Enter 12-digit Aadhaar (or just vibes)" maxLength={20} />
            </>,
            fieldErrors.aadhaar
          )}

          {fieldBox(
            <>
              <label style={labelStyle}>FAVOURITE DINOSAUR * <span style={{ color: '#ff6600' }}>(Official Records Only — No Imaginary Species)</span></label>
              <select value={formData.dinosaur} onChange={e => handleChange('dinosaur', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Select Government-Approved Dinosaur —</option>
                {DINOSAURS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </>,
            fieldErrors.dinosaur
          )}

          {fieldBox(
            <>
              <label style={labelStyle}>EMOTIONAL DAMAGE LEVEL * <span style={{ color: '#ff6600' }}>(Self-Reported — Underestimation Prohibited)</span></label>
              <select value={formData.damage} onChange={e => handleChange('damage', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Select Your Suffering Level —</option>
                {DAMAGE_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </>,
            fieldErrors.damage
          )}
        </div>

        {/* SECTION 2 */}
        <div style={{ border: '1px solid #1a3300', padding: '20px', marginBottom: '24px', background: 'rgba(0,255,65,0.02)' }}>
          <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#ffff00', marginBottom: '20px', letterSpacing: '2px' }}>
            SECTION 2: INTERNET USAGE DECLARATION (FORM 7-B, SUBSECTION ∞)
          </h2>

          {fieldBox(
            <>
              <label style={labelStyle}>PRIMARY INTERNET USAGE PURPOSE * <span style={{ color: '#ff6600' }}>(Surveillance Required)</span></label>
              <select value={formData.purpose} onChange={e => handleChange('purpose', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Declare Your Digital Intentions —</option>
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </>,
            fieldErrors.purpose
          )}

          {fieldBox(
            <>
              <label style={labelStyle}>MOTHER'S MAIDEN WIFI PASSWORD * <span style={{ color: '#ff6600' }}>(National Security Requirement — Circular 99/B)</span></label>
              <input type="text" value={formData.wifi} onChange={e => handleChange('wifi', e.target.value)} style={inputStyle} placeholder="e.g. JioFiber@HomeSweet2019" />
            </>,
            null
          )}

          {fieldBox(
            <>
              <label style={labelStyle}>NUMBER OF PREVIOUS GOVERNMENT TRAUMAS * <span style={{ color: '#ff6600' }}>(Underestimation Prohibited)</span></label>
              <input type="number" value={formData.trauma} onChange={e => handleChange('trauma', e.target.value)} style={inputStyle} placeholder="0" min="0" max="9999" />
            </>,
            null
          )}
        </div>

        {/* SECTION 3 */}
        <div style={{ border: '1px solid #1a3300', padding: '20px', marginBottom: '24px', background: 'rgba(0,255,65,0.02)' }}>
          <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#ffff00', marginBottom: '20px', letterSpacing: '2px' }}>
            SECTION 3: MANDATORY CERTIFICATIONS & DECLARATIONS
          </h2>

          {[
            { field: 'pigeon_check', label: 'I confirm I am not a pigeon. (Or am acting on behalf of a non-pigeon entity)' },
            { field: 'recovered', label: 'I have emotionally recovered from previous government websites. (Lie if needed)' },
            { field: 'sanity_surrender', label: 'I hereby surrender my remaining sanity to the Ministry of Digital Suffering.' },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData[field]}
                  onChange={e => handleChange(field, e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#00ff41', cursor: 'pointer' }}
                />
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#aaa', lineHeight: 1.6 }}>
                  {label}
                </span>
              </label>
              {fieldErrors[field] && <p style={errorStyle}>{fieldErrors[field]}</p>}
            </div>
          ))}
        </div>

        {/* TERMS & CONDITIONS */}
        <div style={{ border: '2px solid #ff0040', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#ff0040', marginBottom: '16px' }}>
            TERMS & CONDITIONS (847 Pages — Minimum 30 Seconds Reading Required)
          </h2>

          {!showTerms ? (
            <button
              onClick={() => { setShowTerms(true); soundEngine.printer(); }}
              style={{
                background: '#ff0040', color: 'white', border: 'none',
                padding: '10px 20px', fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px', cursor: 'pointer',
              }}
            >
              VIEW TERMS (You Must)
            </button>
          ) : (
            <div>
              <div
                onScroll={(e) => {
                  const el = e.target;
                  const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
                  setTermsScrolled(Math.round(pct * 100));
                  if (pct > 0.95 && termsScrolled < 95) soundEngine.notification();
                }}
                style={{
                  height: '150px', overflowY: 'scroll',
                  background: '#050505', border: '1px solid #333',
                  padding: '12px', fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '10px', color: '#444', lineHeight: 2,
                  marginBottom: '12px',
                }}
              >
                <p style={{ color: '#333' }}>TERMS & CONDITIONS — GOVERNMENT OF INDIA — MINISTRY OF DIGITAL SUFFERING</p>
                <br />
                <p>1. By using this portal you agree to suffer indefinitely and without compensation.</p>
                <p>2. The Government reserves the right to reject your application for any reason, including but not limited to: your face, your energy, your password, the alignment of Jupiter, and the number of pigeons in your district.</p>
                <p>3. All submitted data may be shared with the Ministry of Pigeons, the Department of Unresolved Issues, and your neighbour Sharma Ji.</p>
                <p>4. The Government accepts no responsibility for emotional, physical, spiritual, or existential damage caused by this form.</p>
                <p>5. If you read this far, you are already too invested to quit now.</p>
                <p>6. Session timeout may occur at any time, including mid-sentence, mid-thought, or mid-blink.</p>
                <p>7. This website is powered by a mix of bureaucracy, regret, and Windows 98.</p>
                <p>8. Your Internet Usage License will be valid for exactly 0.7 government years.</p>
                <p>9. Any disputes shall be resolved by a panel of government pigeons in New Delhi.</p>
                <p>10. Continued use of this portal constitutes acceptance of all current, future, and retroactively applied terms.</p>
                <br />
                <p style={{ color: '#222' }}>... [Pages 2–847 contain more of the same. You cannot read them faster. Scroll to continue.] ...</p>
                <br />
                <p>847. The Ministry thanks you for your suffering and hopes you return soon for additional suffering.</p>
              </div>
              <p style={{ fontFamily: '"VT323", monospace', fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                Scrolled: {termsScrolled}% {termsScrolled >= 95 ? '✓ (You may proceed)' : '(Keep scrolling — the government is watching)'}
              </p>
              <button
                onClick={() => {
                  if (termsScrolled < 80) {
                    soundEngine.xpError();
                    return;
                  }
                  setTermsAccepted(true);
                  soundEngine.successFanfare();
                  setFieldErrors(prev => ({ ...prev, terms: '' }));
                }}
                style={{
                  background: termsScrolled >= 80 ? '#00ff41' : '#1a1a1a',
                  color: termsScrolled >= 80 ? '#000' : '#333',
                  border: `1px solid ${termsScrolled >= 80 ? '#00ff41' : '#333'}`,
                  padding: '8px 16px', fontFamily: '"Press Start 2P", monospace',
                  fontSize: '8px', cursor: termsScrolled >= 80 ? 'pointer' : 'not-allowed',
                }}
              >
                {termsAccepted ? '✓ ACCEPTED (Regrettably)' : 'I Accept (Scroll First)'}
              </button>
              {fieldErrors.terms && <p style={errorStyle}>{fieldErrors.terms}</p>}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <motion.button
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(135deg, #00ff41, #008822)',
              color: '#000',
              border: '3px solid #00ff41',
              padding: '16px 40px',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '10px',
              cursor: 'pointer',
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(0,255,65,0.5)',
            }}
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            📤 SUBMIT APPLICATION (GOD HELP YOU)
          </motion.button>

          {/* Hidden Easter Egg */}
          <button
            onClick={() => { setShowCryingRoom(true); soundEngine.evilLaugh(); }}
            style={{
              position: 'absolute', bottom: '-30px', right: '0',
              background: 'none', border: 'none',
              color: '#333', fontSize: '9px',
              fontFamily: '"Share Tech Mono", monospace',
              cursor: 'pointer',
            }}
          >
            developer crying room
          </button>
        </div>
      </div>

      {/* Random popup */}
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title="GOVERNMENT NOTIFICATION" message={popupMsg} type="error" showFakeClose />

      {/* Developer Crying Room */}
      <AnimatePresence>
        {showCryingRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,50,0.97)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '20px', zIndex: 99999,
            }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '5rem' }}>
              😭
            </motion.div>
            <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#6699ff', textAlign: 'center', lineHeight: 2 }}>
              DEVELOPER CRYING ROOM
            </h2>
            <p style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: '#4466aa', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
              The developer who built this portal has been in this room since Sprint 1.<br />
              Please leave water outside the door.<br />
              No design feedback at this time.
            </p>
            <button className="cursed-btn" onClick={() => setShowCryingRoom(false)}>
              Return to Suffering
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
