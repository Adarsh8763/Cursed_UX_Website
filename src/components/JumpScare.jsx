import { motion, AnimatePresence } from 'framer-motion';

export default function JumpScare({ jumpscare }) {
  if (!jumpscare) return null;

  const position = jumpscare.position || { top: '20%', left: '10%' };

  return (
    <AnimatePresence>
      <motion.div
        key={jumpscare.id}
        className="jumpscare-container"
        style={{ ...position }}
        initial={{ scale: 0, rotate: -30, opacity: 0, filter: 'blur(20px)' }}
        animate={[
          { scale: 3, rotate: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.2, ease: 'easeOut' } },
          { scale: 2.8, rotate: 5, transition: { duration: 0.1 } },
          { scale: 3, rotate: -5, transition: { duration: 0.1 } },
          { scale: 2.9, rotate: 0, transition: { duration: 0.1 } },
        ]}
        exit={{ scale: 0, opacity: 0, rotate: 30, filter: 'blur(20px)', transition: { duration: 0.5, ease: 'easeInOut' } }}
      >
        {/* Character */}
        <motion.div
          style={{
            fontSize: '4rem',
            textAlign: 'center',
            filter: 'drop-shadow(0 0 20px rgba(255,0,0,0.8))',
          }}
          animate={{
            filter: [
              'drop-shadow(0 0 20px rgba(255,0,0,0.8)) hue-rotate(0deg)',
              'drop-shadow(0 0 30px rgba(255,0,255,0.9)) hue-rotate(120deg)',
              'drop-shadow(0 0 25px rgba(0,255,255,0.8)) hue-rotate(240deg)',
              'drop-shadow(0 0 20px rgba(255,0,0,0.8)) hue-rotate(0deg)',
            ],
          }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          {jumpscare.character}
        </motion.div>

        {/* Message bubble */}
        <motion.div
          style={{
            background: 'rgba(0,0,0,0.95)',
            border: '3px solid #ff0040',
            padding: '8px 12px',
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ff0040',
            textAlign: 'center',
            maxWidth: '200px',
            marginTop: '8px',
            boxShadow: '0 0 20px rgba(255,0,64,0.5)',
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {jumpscare.msg}
        </motion.div>

        {/* RGB flash overlay */}
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
          animate={{
            backgroundColor: [
              'rgba(255,0,0,0.1)',
              'rgba(0,255,0,0.1)',
              'rgba(0,0,255,0.1)',
              'rgba(0,0,0,0)',
            ],
          }}
          transition={{ duration: 0.5, times: [0, 0.33, 0.66, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
