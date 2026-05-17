import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Shield, Skull, Wifi } from 'lucide-react';
import { soundEngine } from './SoundManager';

const POPUP_ICONS = {
  error: <AlertTriangle size={20} color="#ff0040" />,
  virus: <Shield size={20} color="#ff0040" />,
  skull: <Skull size={20} color="#ff0040" />,
  wifi: <Wifi size={20} color="#ffff00" />,
  default: <AlertTriangle size={20} color="#ff0040" />,
};

export default function Popup({
  isOpen,
  onClose,
  title = "SYSTEM ALERT",
  message,
  type = 'default',
  buttons,
  children,
  style = {},
  showFakeClose = false,
}) {
  const handleClose = () => {
    soundEngine.xpError();
    onClose && onClose();
  };

  // Fake close button just re-opens the popup
  const handleFakeClose = () => {
    soundEngine.cartoonScream();
    // Does nothing intentionally 😭
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 9000 + Math.floor(Math.random() * 100) }}
        >
          <motion.div
            className="popup-box"
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ ...style }}
          >
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(90deg, #003a7a, #0055b3)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              marginLeft: '-20px',
              marginRight: '-20px',
              marginTop: '-20px',
              paddingLeft: '20px',
              paddingRight: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {POPUP_ICONS[type]}
                <span style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '11px',
                  color: 'white',
                  letterSpacing: '1px',
                }}>
                  {title}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {showFakeClose && (
                  <button
                    onClick={handleFakeClose}
                    style={{
                      background: '#cc0000',
                      border: 'none',
                      color: 'white',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={handleClose}
                  style={{
                    background: showFakeClose ? '#333' : '#cc0000',
                    border: 'none',
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title={showFakeClose ? "This is the real close button (maybe)" : "Close"}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            {message && (
              <p style={{
                fontFamily: '"VT323", monospace',
                fontSize: '18px',
                color: '#00ff41',
                lineHeight: 1.5,
                marginBottom: '16px',
                textShadow: '0 0 5px rgba(0,255,65,0.5)',
              }}>
                {message}
              </p>
            )}
            {children}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              {buttons ? buttons : (
                <button
                  onClick={handleClose}
                  className="cursed-btn"
                  style={{ fontSize: '9px' }}
                >
                  OK (Unfortunately)
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
