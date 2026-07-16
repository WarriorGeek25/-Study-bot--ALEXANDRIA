// ALEXANDRIA — identity subsystem (client-side demo auth).
// Register / login / logout + changeable profile picture.
// Users are stored in localStorage under 'alexandria.users'; the current
// session lives under 'alexandria.session'. Profile pictures are stored as
// data-URLs (base64) and validated for type + size to keep them reasonable.

const USERS_KEY = 'alexandria.users';
const SESSION_KEY = 'alexandria.session';

// Reasonable limits for an "appropriate" profile picture.
const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const AVATAR_MAX_DIM = 512; // px — we downscale to this on the longest edge
const AVATAR_ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">' +
      '<rect width="128" height="128" fill="#0a0e1a"/>' +
      '<text x="64" y="80" font-size="64" text-anchor="middle" fill="#28e0ff" ' +
      'font-family="Orbitron, sans-serif">&#x2316;</text></svg>'
  );

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}
function writeUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}
function setSession(s) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

function hash(str) {
  // Tiny non-cryptographic hash — demo only, no real secrets here.
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return String(h);
}

export function register(handle, email, password) {
  handle = (handle || '').trim();
  email = (email || '').trim().toLowerCase();
  if (!handle || !email || !password)
    return { ok: false, error: 'All fields are required.' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: 'Invalid uplink address.' };
  if (password.length < 6)
    return { ok: false, error: 'Passphrase must be ≥ 6 characters.' };
  const users = readUsers();
  if (users[email]) return { ok: false, error: 'Uplink already registered.' };
  users[email] = { handle, email, pass: hash(password), avatar: DEFAULT_AVATAR, createdAt: Date.now() };
  writeUsers(users);
  setSession({ email });
  return { ok: true, user: publicUser(users[email]) };
}

export function login(email, password) {
  email = (email || '').trim().toLowerCase();
  const users = readUsers();
  const u = users[email];
  if (!u || u.pass !== hash(password || ''))
    return { ok: false, error: 'Invalid credentials.' };
  setSession({ email });
  return { ok: true, user: publicUser(u) };
}

export function logout() { setSession(null); }

export function getCurrentUser() {
  const s = getSession();
  if (!s) return null;
  return publicUser(readUsers()[s.email]) || null;
}

// Change the profile picture. Accepts a File; validates type + size, then
// downscales and re-encodes to keep avatars reasonable & consistent.
export function changeAvatar(file) {
  const s = getSession();
  if (!s) return { ok: false, error: 'Not signed in.' };
  if (!file) return { ok: false, error: 'No file selected.' };
  if (!AVATAR_ALLOWED.includes(file.type))
    return { ok: false, error: 'Only JPEG, PNG, WEBP or GIF allowed.' };
  if (file.size > AVATAR_MAX_BYTES)
    return { ok: false, error: 'Image too large (max 2 MB).' };
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve({ ok: false, error: 'Could not read file.' });
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve({ ok: false, error: 'Corrupt or unreadable image.' });
      img.onload = () => {
        const scale = Math.min(1, AVATAR_MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/png');
        const users = readUsers();
        if (!users[s.email]) return resolve({ ok: false, error: 'Session expired.' });
        users[s.email].avatar = dataUrl;
        writeUsers(users);
        resolve({ ok: true, avatar: dataUrl, user: publicUser(users[s.email]) });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function updateHandle(handle) {
  const s = getSession();
  if (!s) return { ok: false, error: 'Not signed in.' };
  handle = (handle || '').trim();
  if (!handle) return { ok: false, error: 'Handle cannot be empty.' };
  const users = readUsers();
  if (!users[s.email]) return { ok: false, error: 'Session expired.' };
  users[s.email].handle = handle;
  writeUsers(users);
  return { ok: true, user: publicUser(users[s.email]) };
}

function publicUser(u) {
  if (!u) return null;
  const { handle, email, avatar, createdAt } = u;
  return { handle, email, avatar, createdAt };
}

export { DEFAULT_AVATAR };