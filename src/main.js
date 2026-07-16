// ALEXANDRIA front screen — boot console + terminal typewriter +
// CONFIGURE cascade (region/country/exam board) + IDENTITY (auth/profile).

import { examRegions, regionList } from './examData.js';
import * as auth from './auth.js';

const bootSequence = [
  'mounting /archive ........ OK',
  'sync neural-graph ........ OK',
  'recall-engine online ..... OK',
  'establishing uplink ..... OK',
];

const termLines = [
  { t: 'cmd', s: '$ alexandria boot --frontend' },
  { t: 'out', s: '▶ initializing front screen' },
  { t: 'ok', s: '✓ cyberpunk theme loaded' },
  { t: 'ok', s: '✓ neon grid stabilized' },
  { t: 'out', s: '▶ recall-engine handshake ...' },
  { t: 'warn', s: '! closed-alpha: token required' },
  { t: 'ok', s: '✓ uplink ready · www.alexandria.com' },
  { t: 'cmd', s: '$ _' },
];

function type(el, text, speed = 18) {
  return new Promise((resolve) => {
    let i = 0;
    const id = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(id); resolve(); }
    }, speed);
  });
}

async function runBoot() {
  const bootText = document.getElementById('boot-text');
  for (const line of bootSequence) {
    await type(bootText, line, 12);
    await new Promise((r) => setTimeout(r, 220));
    bootText.textContent = '';
  }
  bootText.textContent = 'ready.';
}

async function runTerm() {
  const body = document.getElementById('term-body');
  if (!body) return;
  for (const line of termLines) {
    const span = document.createElement('div');
    span.className = line.t;
    body.appendChild(span);
    await type(span, line.s, line.t === 'cmd' ? 24 : 14);
    await new Promise((r) => setTimeout(r, 180));
  }
}

/* ---------- CONFIGURE: cascading region / country / exam board ---------- */
const CFG_KEY = 'alexandria.config';

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(CFG_KEY)) || null; }
  catch { return null; }
}
function saveConfig(cfg) { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); }

function fillSelect(sel, items, placeholder) {
  sel.innerHTML = `<option value="">— ${placeholder} —</option>`;
  for (const it of items) {
    const o = document.createElement('option');
    o.value = it; o.textContent = it;
    sel.appendChild(o);
  }
}

function initCascade() {
  const selRegion = document.getElementById('sel-region');
  const selCountry = document.getElementById('sel-country');
  const selBoard = document.getElementById('sel-board');
  const result = document.getElementById('cascade-result');
  const saveBtn = document.getElementById('cascade-save');
  if (!selRegion) return;

  fillSelect(selRegion, regionList, 'select region');

  function setResult(msg, kind = '') {
    result.innerHTML = msg ? `<span class="${kind}">${msg}</span>` : '';
  }

  selRegion.addEventListener('change', () => {
    const r = selRegion.value;
    selBoard.disabled = true;
    selBoard.innerHTML = '<option value="">— select exam board —</option>';
    if (!r) { selCountry.disabled = true; selCountry.innerHTML = '<option value="">— select country —</option>'; setResult(''); return; }
    fillSelect(selCountry, Object.keys(examRegions[r]), 'select country');
    selCountry.disabled = false;
    setResult(`region locked: ${r}`, 'ok');
  });

  selCountry.addEventListener('change', () => {
    const r = selRegion.value, c = selCountry.value;
    if (!c) { selBoard.disabled = true; selBoard.innerHTML = '<option value="">— select exam board —</option>'; setResult(''); return; }
    fillSelect(selBoard, examRegions[r][c], 'select exam board');
    selBoard.disabled = false;
    setResult(`country locked: ${c}`, 'ok');
  });

  selBoard.addEventListener('change', () => {
    if (!selBoard.value) { setResult(''); return; }
    setResult(`exam board locked: ${selBoard.value}`, 'ok');
  });

  saveBtn.addEventListener('click', () => {
    const r = selRegion.value, c = selCountry.value, b = selBoard.value;
    if (!r || !c || !b) { setResult('complete all three tiers first', 'warn'); return; }
    saveConfig({ region: r, country: c, board: b });
    setResult(`config locked → ${r} / ${c} / ${b}`, 'ok');
    renderProfileConfig();
  });

  // restore saved config
  const saved = loadConfig();
  if (saved && examRegions[saved.region]) {
    selRegion.value = saved.region;
    fillSelect(selCountry, Object.keys(examRegions[saved.region]), 'select country');
    selCountry.disabled = false;
    if (examRegions[saved.region][saved.country]) {
      selCountry.value = saved.country;
      fillSelect(selBoard, examRegions[saved.region][saved.country], 'select exam board');
      selBoard.disabled = false;
      if (examRegions[saved.region][saved.country].includes(saved.board)) {
        selBoard.value = saved.board;
        setResult(`config restored → ${saved.region} / ${saved.country} / ${saved.board}`, 'ok');
      }
    }
  }
}

/* ---------- IDENTITY: register / login / profile / avatar ---------- */
function msg(el, text, ok = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('ok', ok);
}

function renderAuthState() {
  const user = auth.getCurrentUser();
  const authView = document.getElementById('auth-view');
  const profileView = document.getElementById('profile-view');
  const navAuth = document.getElementById('nav-auth');
  if (user) {
    authView.classList.add('hidden');
    profileView.classList.remove('hidden');
    document.getElementById('profile-avatar').src = user.avatar;
    document.getElementById('profile-handle').textContent = user.handle;
    document.getElementById('profile-email').textContent = user.email;
    navAuth.textContent = user.handle.toUpperCase();
    navAuth.classList.add('signed');
    renderProfileConfig();
  } else {
    authView.classList.remove('hidden');
    profileView.classList.add('hidden');
    navAuth.textContent = 'JACK IN';
    navAuth.classList.remove('signed');
  }
}

function renderProfileConfig() {
  const el = document.getElementById('profile-config');
  if (!el) return;
  const cfg = loadConfig();
  el.textContent = cfg ? `▸ uplink config: ${cfg.region} / ${cfg.country} / ${cfg.board}` : '▸ uplink config: none — configure below';
}

function initAuth() {
  const tabReg = document.getElementById('tab-register');
  const tabLog = document.getElementById('tab-login');
  const formReg = document.getElementById('form-register');
  const formLog = document.getElementById('form-login');
  const authMsg = document.getElementById('auth-msg');
  const profileMsg = document.getElementById('profile-msg');

  function showRegister() {
    tabReg.classList.add('active'); tabReg.setAttribute('aria-selected', 'true');
    tabLog.classList.remove('active'); tabLog.setAttribute('aria-selected', 'false');
    formReg.classList.remove('hidden'); formLog.classList.add('hidden');
    msg(authMsg, '');
  }
  function showLogin() {
    tabLog.classList.add('active'); tabLog.setAttribute('aria-selected', 'true');
    tabReg.classList.remove('active'); tabReg.setAttribute('aria-selected', 'false');
    formLog.classList.remove('hidden'); formReg.classList.add('hidden');
    msg(authMsg, '');
  }
  tabReg.addEventListener('click', showRegister);
  tabLog.addEventListener('click', showLogin);

  formReg.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(formReg);
    const res = auth.register(f.get('handle'), f.get('email'), f.get('password'));
    if (res.ok) { formReg.reset(); renderAuthState(); }
    else msg(authMsg, res.error);
  });

  formLog.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(formLog);
    const res = auth.login(f.get('email'), f.get('password'));
    if (res.ok) { formLog.reset(); renderAuthState(); }
    else msg(authMsg, res.error);
  });

  // profile: change avatar
  const avatarFile = document.getElementById('avatar-file');
  avatarFile.addEventListener('change', async () => {
    const file = avatarFile.files[0];
    if (!file) return;
    msg(profileMsg, 'processing image…');
    const res = await auth.changeAvatar(file);
    if (res.ok) {
      document.getElementById('profile-avatar').src = res.avatar;
      msg(profileMsg, 'profile picture updated', true);
    } else {
      msg(profileMsg, res.error);
    }
    avatarFile.value = '';
  });

  // profile: change handle
  document.getElementById('btn-rename').addEventListener('click', () => {
    const handle = prompt('New handle / username:');
    if (handle == null) return;
    const res = auth.updateHandle(handle);
    if (res.ok) { renderAuthState(); msg(profileMsg, 'handle updated', true); }
    else msg(profileMsg, res.error);
  });

  // profile: logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    auth.logout();
    renderAuthState();
  });

  // nav auth button → scroll to identity
  document.getElementById('nav-auth').addEventListener('click', () => {
    document.getElementById('identity').scrollIntoView({ behavior: 'smooth' });
  });

  renderAuthState();
}

document.addEventListener('DOMContentLoaded', () => {
  runBoot(); runTerm();
  initCascade();
  initAuth();
});