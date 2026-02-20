// ── THEME TOGGLE ─────────────────────────────────────────────

// ============================
// PROFILE TABS (sobre section)
// ============================
document.querySelectorAll('.profile-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.profile-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ============================
// INIT
// ============================
window.addEventListener('load', () => {
  const saved = localStorage.getItem('rpg-theme');
  isDark = saved !== 'light';
  applyTheme(isDark);
  setTimeout(() => { updateXP(74); updateHP(87); }, 500);
});

const dangerStyle = document.createElement('style');
dangerStyle.textContent = '@keyframes hp-danger { from { filter: brightness(1); } to { filter: brightness(1.4) drop-shadow(0 0 4px #ff4060); } }';
document.head.appendChild(dangerStyle);

// ============================
// DAY MODE SKY — CLOUDS + BIRDS
// ============================
// THEME TOGGLE — applyTheme
// ============================
let isDark = true;

function applyTheme(dark) {
  isDark = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = dark ? '☀️ DIA' : '🌙 NOITE';
  localStorage.setItem('rpg-theme', dark ? 'dark' : 'light');
  if (typeof window._starsResize === 'function') window._starsResize();
}

const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => applyTheme(!isDark));
}
