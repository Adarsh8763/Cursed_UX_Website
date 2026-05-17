// Fake CAPTCHA utilities

export const CAPTCHA_OPTIONS = [
  { id: 'c1', emoji: '😭', label: 'Crying after form submission', isCorrect: true },
  { id: 'c2', emoji: '😤', label: 'Frustrated by server timeout', isCorrect: true },
  { id: 'c3', emoji: '🤩', label: 'Happy about government service', isCorrect: false },
  { id: 'c4', emoji: '💀', label: 'Emotionally deceased', isCorrect: true },
  { id: 'c5', emoji: '🥺', label: 'Pleading for form reset', isCorrect: true },
  { id: 'c6', emoji: '😁', label: 'Suspiciously cheerful', isCorrect: false },
  { id: 'c7', emoji: '🤯', label: 'Mind blown by bureaucracy', isCorrect: true },
  { id: 'c8', emoji: '😎', label: 'Confidently wrong', isCorrect: false },
  { id: 'c9', emoji: '🫠', label: 'Melting from helpdesk hold music', isCorrect: true },
];

export const CAPTCHA_WRONG_MESSAGES = [
  "WRONG! You selected happiness. Unacceptable.",
  "Incorrect. Emotional damage not validated.",
  "CAPTCHA FAILED. Are you even suffering?",
  "The pigeon has rejected your selection.",
  "Your emotional intelligence is below government threshold.",
  "Please select only certified suffering. Try again.",
];

export const generateCaptchaChallenge = () => {
  const shuffled = [...CAPTCHA_OPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
};

export const validatePassword = (password) => {
  const errors = [];
  const hasEmoji = /\p{Emoji}/u.test(password);
  const hasDinosaur = /(raptor|trex|t-rex|stegosaurus|brachiosaurus|velociraptor|pterodactyl|ankylosaurus|diplodocus|iguanodon|spinosaurus|allosaurus|triceratops|dilophosaurus)/i.test(password);
  // Sanskrit words list
  const hasSanskrit = /(dharma|moksha|karma|atman|brahman|shakti|om|ahimsa|satya|yoga|prana|mantra|tantra|vedanta|nirvana|samsara|maya|arjuna)/i.test(password);

  if (!hasEmoji) errors.push("Missing 1 emoji (government regulation)");
  if (!hasDinosaur) errors.push("Missing dinosaur name (mandatory per Form 7-D)");
  if (!hasSanskrit) errors.push("Missing Sanskrit word (cultural compliance)");

  return { isValid: errors.length === 0, errors };
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No Hope', color: '#333' };
  if (password.length < 4) return { strength: 10, label: 'Dangerously Weak', color: '#ff0000' };
  if (password.length < 8) return { strength: 30, label: 'Emotionally Frail', color: '#ff4400' };
  if (password.length < 12) return { strength: 50, label: 'Suffering Detected', color: '#ff8800' };
  const { isValid } = validatePassword(password);
  if (isValid) return { strength: 100, label: 'Government Approved 🎉', color: '#00ff41' };
  return { strength: 70, label: 'Almost Acceptable', color: '#ffff00' };
};
