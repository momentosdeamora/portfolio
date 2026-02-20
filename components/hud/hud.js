// ── HUD: XP, HP, Scroll, Hamburger, Active Nav ──────────────

// ============================
// XP / HP BARS
// ============================
let currentXP = 74, currentHP = 87;

function updateXP(val) {
  currentXP = Math.min(100, Math.max(0, val));
  document.getElementById('xpBar').style.width = currentXP + '%';
  document.getElementById('xpVal').textContent = Math.round(currentXP * 100) + ' / 10000';
}

function updateHP(val) {
  currentHP = Math.min(100, Math.max(0, val));
  document.getElementById('hpBar').style.width = currentHP + '%';
  document.getElementById('hpVal').textContent = Math.round(currentHP * 10) + ' / 1000';
  const bar = document.getElementById('hpBar');
  if (currentHP < 25) {
    bar.style.background = 'linear-gradient(90deg, #400010, #cc0040, #ff4060)';
    bar.style.animation = 'hp-danger 0.5s ease-in-out infinite alternate';
  } else {
    bar.style.background = '';
    bar.style.animation = '';
  }
}

document.getElementById('xpTrack').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickPct = ((e.clientX - rect.left) / rect.width) * 100;
  const oldXP = currentXP;
  updateXP(clickPct);
  const gain = Math.round((clickPct - oldXP) * 100);
  if (gain > 0) {
    const burst = document.createElement('div');
    burst.className = 'xp-burst';
    burst.textContent = '+' + gain + ' XP!';
    e.currentTarget.style.position = 'relative';
    e.currentTarget.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
    if (currentXP >= 99) showToast('LEVEL UP!', 'XP máximo atingido! Novo nível!');
  }
});

document.getElementById('hpTrack').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickPct = ((e.clientX - rect.left) / rect.width) * 100;
  updateHP(clickPct);
  if (currentHP < 25) showToast('HP CRÍTICO!', 'Precisa de uma poção de cura!');
  else if (currentHP >= 95) showToast('HP RESTAURADO!', 'Vida máxima recuperada!');
});

// ============================
// XP AUMENTA COM SCROLL
// ============================
function updateXPFromScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;
  const scrollPct = Math.min(100, (scrollTop / maxScroll) * 100);
  const xpVal = 74 + (scrollPct / 100) * 26;
  updateXP(xpVal);
}

window.addEventListener('scroll', updateXPFromScroll, { passive: true });

// ============================
// HP PISCANDO
// ============================
const hpBlinkStyle = document.createElement('style');
hpBlinkStyle.textContent = `
  @keyframes hp-blink {
    0%, 100% { opacity: 1; filter: brightness(1); }
    50%       { opacity: 0.55; filter: brightness(1.35) drop-shadow(0 0 6px #cc2060); }
  }
  #hpBar { animation: hp-blink 1.1s ease-in-out infinite !important; }
  @keyframes hp-danger {
    from { filter: brightness(1); }
    to   { filter: brightness(1.4) drop-shadow(0 0 4px #ff4060); }
  }
`;
document.head.appendChild(hpBlinkStyle);


// ── HAMBURGER ────────────────────────────────────────────────
// ============================
// HAMBURGER
// ============================
const hamburgerBtn = document.getElementById('hamburger');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    document.getElementById('hudNav').classList.toggle('open');
  });
}


// ── ACTIVE NAV ───────────────────────────────────────────────
// ============================
// ACTIVE NAV
// ============================
const allNavSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.hud-nav a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35 });
allNavSections.forEach(s => navObs.observe(s));

// ============================
