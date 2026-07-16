// ALEXANDRIA front screen — boot console + terminal typewriter.

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

document.addEventListener('DOMContentLoaded', () => { runBoot(); runTerm(); });