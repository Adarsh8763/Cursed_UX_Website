// Random cursed messages throughout the application
export const POPUP_MESSAGES = [
  "Government servers are emotionally unavailable.",
  "Please rotate your monitor vertically.",
  "Suspicious happiness detected. Please suffer.",
  "Your application has been forwarded to the Ministry of Suffering.",
  "Error 404: Your sanity not found.",
  "Please wait while we process your emotional damage.",
  "WARNING: Unauthorized optimism detected.",
  "Your cookies have been confiscated by the Digital Bureaucracy.",
  "This portal runs on Windows 98. Please adjust expectations.",
  "Your IP address has been reported to the Feelings Department.",
  "The server is currently napping. Please try again in 3-5 business decades.",
  "ALERT: Your face has been recognized as 'too happy'. Access denied.",
  "Please provide proof that you have suffered before.",
  "This website is best viewed on Internet Explorer 6.",
  "Your browser is not government-approved. Proceeding anyway with emotional consequences.",
  "The Ministry of Digital Suffering thanks you for your patience.",
  "Aadhaar verification requires your aura to be scanned.",
  "Please stand by while we emotionally profile you.",
  "Connection timeout: The server is filing its own application.",
  "CAPTCHA FAILED: You have been identified as 'too human'.",
  "Your data is being uploaded to a pigeon carrier network.",
  "Session will expire in 0.3 seconds. Please hurry.",
  "The Submit button has filed for emotional leave.",
  "Please reboot your brain and try again.",
  "ERROR: Too much confidence detected in Form Field 7B.",
];

export const WRONG_PASSWORD_MESSAGES = [
  "Password lacks emotional maturity.",
  "Government rejected your vibe.",
  "Too much confidence detected. Password denied.",
  "This password has been blacklisted by the Ministry of Sadness.",
  "Password strength: Emotionally Weak.",
  "Your password smells of unauthorized happiness.",
  "Password rejected. Please add more suffering.",
  "The CAPTCHA pigeon did not approve this password.",
  "Password too short. Life is also too short. Coincidence? No.",
  "Password contains insufficient trauma.",
];

export const LOADING_MESSAGES = [
  "Consulting government pigeons...",
  "Connecting to Windows 98 servers...",
  "Emotionally profiling applicant...",
  "Checking horoscope compatibility...",
  "Verifying Aadhaar with NASA...",
  "Downloading more RAM...",
  "Initializing suffering protocol...",
  "Contacting the Ministry of Pain...",
  "Asking a real pigeon for approval...",
  "Loading bureaucracy... please suffer...",
  "Rebooting the 1997 server...",
  "Please hold while we generate your trauma report...",
  "Syncing with the National Register of Sadness...",
  "Verifying your emotional damage level...",
  "Consulting an astrologer for form validation...",
  "Running virus scan on your hopes and dreams...",
  "Calculating suffering coefficient...",
  "Forwarding application to the Department of Delays...",
  "Processing... (estimated time: 3 government years)...",
  "Identifying emotional weaknesses...",
];

export const VERIFICATION_MESSAGES = [
  "Application Rejected Successfully.",
  "You have been rejected with honors.",
  "Your application has been filed under 'Not Our Problem'.",
  "Rejection delivered. Have a bureaucratic day.",
  "After careful consideration, we have chosen to not care.",
];

export const TICKER_MESSAGES = [
  "⚠️ BREAKING: Government portal upgraded to Windows 98 SE ⚠️",
  "🚨 Your happiness has been flagged for investigation 🚨",
  "📢 Apply for Internet License before the government runs out of sadness 📢",
  "⚡ Server status: Emotionally unavailable ⚡",
  "🦕 The CAPTCHA dinosaur has escaped again 🦕",
  "💀 Previous applicant has not been seen since 2019 💀",
  "🔴 ALERT: Unauthorized optimism detected in sector 7 🔴",
  "📋 Form 27B/6 now required in addition to Form 27B/6 📋",
  "🏛️ Ministry of Digital Suffering wishes you a painful experience 🏛️",
];

export const JUMPSCARE_MESSAGES = [
  { character: "💀", msg: "Your application has awakened the dead." },
  { character: "🦕", msg: "CAPTCHA FAILURE DETECTED. ROARRRR." },
  { character: "👮", msg: "Additional suffering required. Report to counter 7B." },
  { character: "🦖", msg: "Password strength emotionally weak. RAWR." },
  { character: "👹", msg: "THE GOVERNMENT IS WATCHING YOUR FORM." },
  { character: "🤖", msg: "ERROR: Human emotions not supported." },
  { character: "👻", msg: "Your previous application haunts us." },
];

export const EASTER_EGG_MESSAGES = {
  admin: "🔓 SECRET MINISTRY MODE UNLOCKED 🔓\nWelcome, Digital Overlord. Your suffering ends here.\n(Just kidding. It doesn't.)",
  employee: "🎉 CONGRATULATIONS!\nYou are now a government employee.\nPlease report to Counter 7 and wait for the next 40 years.",
};

export const FORM_LABELS = {
  aadhaar: "Aadhaar Number (Mandatory • Non-Refundable • Soul Required)",
  dinosaur: "Favourite Dinosaur (Official Records Only)",
  damage: "Emotional Damage Level (Self-Reported, We Won't Believe You)",
  purpose: "Internet Usage Purpose (Surveillance Required)",
  captcha: "CAPTCHA Clearance Certificate (Original + Notarized Photocopy)",
  wifi: "Mother's Maiden WiFi Password (National Security Requirement)",
  trauma: "Number of Previous Government Traumas (Underestimation Prohibited)",
  pigeon: "Government Pigeon Identification Number (If Applicable)",
  sanity: "Remaining Sanity % (Please Be Honest)",
};

export const getRandomMessage = (arr) => arr[Math.floor(Math.random() * arr.length)];
