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

// ============================
// PIXEL-DOT TWINKLING STARS
// ============================
(function initPixelStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const STAR_COUNT = 200;
  const stars = [];
  const colors = [
    [155, 109, 255],
    [192,  57, 110],
    [200, 191, 232],
    [212, 168,  67],
  ];

  function resize() {
    canvas.width  = container.offsetWidth  || window.innerWidth;
    canvas.height = container.offsetHeight || window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const colorIdx = Math.random() < 0.05 ? 3
                     : Math.random() < 0.4  ? 1
                     : Math.random() < 0.5  ? 2 : 0;
      const size = Math.random() < 0.2 ? 4 : 2;
      stars.push({
        x:      Math.floor(Math.random() * (canvas.width  / size)) * size,
        y:      Math.floor(Math.random() * (canvas.height / size)) * size,
        size,
        color:  colors[colorIdx],
        period: 1500 + Math.random() * 4000,
        phase:  Math.random() * Math.PI * 2,
        drift:  Math.random() < 0.03 ? (Math.random() * 0.3 + 0.1) : 0,
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  let lastTime = 0;
  function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      const t = ((timestamp % star.period) / star.period) * Math.PI * 2 + star.phase;
      const opacity = 0.08 + 0.72 * ((Math.sin(t) + 1) / 2);

      if (star.drift > 0) {
        star.x += star.drift * (dt / 16);
        if (star.x > canvas.width + star.size) star.x = -star.size;
      }

      const [r, g, b] = star.color;
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
      const px = Math.round(star.x / star.size) * star.size;
      const py = Math.round(star.y / star.size) * star.size;
      ctx.fillRect(px, py, star.size, star.size);

      if (star.size === 4 && opacity > 0.65) {
        const g2 = (opacity - 0.65) * 2.86;
        ctx.fillStyle = `rgba(${r},${g},${b},${(g2 * 0.5).toFixed(3)})`;
        ctx.fillRect(px - 2, py + 1, 2, 2);
        ctx.fillRect(px + 4, py + 1, 2, 2);
        ctx.fillRect(px + 1, py - 2, 2, 2);
        ctx.fillRect(px + 1, py + 4, 2, 2);
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ============================
// CASTELO
// ============================
(function initCastle() {
  const canvas = document.getElementById('castleCanvas');
  if (!canvas) return;

  const S = 4;
  const COLS = 200;
  const ROWS = 40;
  canvas.width  = COLS * S;
  canvas.height = ROWS * S;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const C = {
    abyss:    '#120f1e',
    crypt:    '#1a1628',
    stone1:   '#2a2240',
    stone2:   '#221a38',
    stone3:   '#352b52',
    stone4:   '#1a1228',
    blood:    '#8b2252',
    bloodLt:  '#c0396e',
    rune:     '#9b6dff',
    runeDim:  '#4a2d99',
    bone:     '#c8bfe8',
    gold:     '#d4a843',
    goldDim:  '#7a5a10',
    sky1:     '#0d0b14',
    sky2:     '#120e20',
    moon:     '#ddd8f8',
    bat:      '#1a1030',
    windowLit:'#8b2252',
    windowDrk:'#1a0a1e',
    chainCol: '#4a3d6b',
    mtCol:    '#1a1228',
  };

  function rect(c, r, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(c * S, r * S, w * S, h * S);
  }
  function pixel(c, r, color) { rect(c, r, 1, 1, color); }

  function stoneBrick(col, row, w, h, c1, c2, mortar) {
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        const isMortarRow = (r - row) % 4 === 3;
        const brickOffset = Math.floor((r - row) / 4) % 2 === 0 ? 0 : 4;
        const isMortarCol = ((c - col + brickOffset) % 8) === 7;
        if (isMortarRow || isMortarCol) {
          pixel(c, r, mortar);
        } else {
          const shade = ((Math.floor((c - col + brickOffset) / 8) + Math.floor((r - row) / 4)) % 2);
          pixel(c, r, shade ? c1 : c2);
        }
      }
    }
  }

  function tower(col, topRow, w, h, bW, bH, bGap) {
    bW = bW || 2; bH = bH || 3; bGap = bGap || 2;
    const numMerlons = Math.floor(w / (bW + bGap));
    const battStart  = col + Math.floor((w - numMerlons * (bW + bGap) + bGap) / 2);
    for (let i = 0; i < numMerlons; i++) {
      const mc = battStart + i * (bW + bGap);
      stoneBrick(mc, topRow - bH, bW, bH, C.stone1, C.stone2, C.stone4);
      pixel(mc, topRow - bH, C.stone3);
      pixel(mc + bW - 1, topRow - bH, C.stone3);
    }
    stoneBrick(col, topRow, w, h, C.stone1, C.stone2, C.stone4);
    for (let r = topRow; r < topRow + h; r++) pixel(col, r, C.stone3);
    for (let r = topRow; r < topRow + h; r++) pixel(col + w - 1, r, C.stone4);
  }

  function archWindow(col, row, lit) {
    const bg = lit ? C.windowLit : C.windowDrk;
    rect(col, row, 5, 5, bg);
    rect(col + 1, row - 1, 3, 1, bg);
    pixel(col, row - 1, C.stone1);
    pixel(col + 4, row - 1, C.stone1);
    pixel(col - 1, row, C.stone3);
    pixel(col + 5, row, C.stone3);
    if (lit) {
      ctx.fillStyle = 'rgba(139,34,82,0.18)';
      ctx.fillRect((col - 1) * S, (row - 2) * S, 7 * S, 9 * S);
    }
    pixel(col + 2, row,     C.stone2);
    pixel(col + 2, row + 1, C.stone2);
    pixel(col + 2, row + 2, C.stone2);
    pixel(col,     row + 2, C.stone2);
    pixel(col + 1, row + 2, C.stone2);
    pixel(col + 3, row + 2, C.stone2);
    pixel(col + 4, row + 2, C.stone2);
  }

  function spire(col, topRow, w) {
    const half = Math.floor(w / 2);
    for (let i = 0; i < half + 2; i++) {
      const rw = Math.min(i * 2 + 1, w);
      const lc = col + half - Math.floor(rw / 2);
      stoneBrick(lc, topRow + i, rw, 1, C.stone3, C.stone1, C.stone4);
    }
    pixel(col + half, topRow,     C.bone);
    pixel(col + half, topRow + 1, C.stone3);
  }

  // SKY — Adaptive: dark moon in dark mode, clear in light mode
  function drawSkyBg() {
    const isDay = document.documentElement.getAttribute('data-theme') === 'light';
    if (isDay) {
      // Transparent in day mode — show animated sky/clouds behind
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      // Night sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, ROWS * S);
      skyGrad.addColorStop(0,   C.sky1);
      skyGrad.addColorStop(0.7, C.sky2);
      skyGrad.addColorStop(1,   C.abyss);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // MOON (only in night mode)
      ctx.fillStyle = C.moon;
      ctx.fillRect(18 * S, 2 * S, 6 * S, 6 * S);
      ctx.fillStyle = C.sky1;
      ctx.fillRect(19 * S, 3 * S, 2 * S, S);
      ctx.fillRect(22 * S, 5 * S, S, 2 * S);
      ctx.fillStyle = 'rgba(138,117,204,0.07)';
      ctx.fillRect(15 * S, 0, 12 * S, 12 * S);
    }
  }

  // MOUNTAINS (drawn dynamically per frame, stored for reference)
  const mtns = [
    [0,32,18],[15,28,22],[33,30,16],[46,26,20],
    [130,30,16],[143,26,22],[162,28,18],[177,31,20]
  ];
  for (const [x, top, w] of mtns) {
    const half = Math.floor(w / 2);
    for (let i = 0; i <= half; i++) {
      const rw = i * 2 + 1;
      const lc = x + half - Math.floor(rw / 2);
      rect(Math.max(0, lc), top + i, Math.min(rw, COLS - lc), 1, C.mtCol);
    }
    rect(x, top + half + 1, w, ROWS - (top + half + 1), C.mtCol);
  }

  // GROUND BASE WALL
  stoneBrick(55, 30, 90, 10, C.stone1, C.stone2, C.stone4);
  for (let c = 55; c < 145; c++) pixel(c, 30, C.stone3);

  // FAR-LEFT TOWER
  tower(48, 22, 14, 18, 2, 3, 2);
  archWindow(52, 25, false);
  archWindow(52, 32, true);
  spire(49, 14, 12);
  pixel(55, 14, C.gold);

  // LEFT MAIN TOWER
  tower(62, 18, 22, 22, 3, 4, 3);
  archWindow(65, 21, true);
  archWindow(73, 21, false);
  archWindow(68, 28, true);
  spire(64, 8, 18);
  pixel(73, 8, C.gold);
  pixel(73, 9, C.bloodLt);

  // CENTER KEEP
  tower(82, 14, 36, 26, 4, 5, 4);
  archWindow(90, 17, true);
  archWindow(100, 17, true);
  archWindow(90, 26, false);
  archWindow(100, 26, true);
  ctx.fillStyle = C.runeDim;
  ctx.fillRect(82 * S, 22 * S, 36 * S, S);
  for (let c = 82; c < 118; c += 3) pixel(c, 14, C.gold);
  spire(88, 1, 24);
  pixel(100, 1, C.gold);
  pixel(100, 2, C.goldDim);
  pixel(100, 3, C.bloodLt);
  for (let r = 8; r < 14; r++) {
    pixel(88, r, C.chainCol);
    pixel(111, r, C.chainCol);
  }

  // RIGHT MAIN TOWER
  tower(116, 18, 22, 22, 3, 4, 3);
  archWindow(119, 21, false);
  archWindow(127, 21, true);
  archWindow(122, 28, true);
  spire(118, 8, 18);
  pixel(127, 8, C.gold);
  pixel(127, 9, C.bloodLt);

  // FAR-RIGHT TOWER
  tower(138, 22, 14, 18, 2, 3, 2);
  archWindow(142, 25, true);
  archWindow(142, 32, false);
  spire(139, 14, 12);
  pixel(145, 14, C.gold);

  // CURTAIN WALLS
  stoneBrick(38, 26, 12, 14, C.stone2, C.stone4, C.abyss);
  tower(36, 23, 6, 17, 1, 2, 2);
  stoneBrick(150, 26, 12, 14, C.stone2, C.stone4, C.abyss);
  tower(158, 23, 6, 17, 1, 2, 2);

  // GATEHOUSE / PORTCULLIS
  const gc = 96, gr = 36, gW = 8, gH = 4;
  rect(gc, gr, gW, gH, C.abyss);
  rect(gc + 1, gr - 1, gW - 2, 1, C.abyss);
  ctx.fillStyle = C.chainCol;
  for (let c = gc; c < gc + gW; c += 2) ctx.fillRect(c * S, gr * S, S, gH * S);
  for (let r = gr; r < gr + gH; r += 2) ctx.fillRect(gc * S, r * S, gW * S, S);
  pixel(gc - 1, gr - 1, C.stone3);
  pixel(gc + gW, gr - 1, C.stone3);
  ctx.fillStyle = C.stone2;
  ctx.fillRect(gc * S, (gr + gH) * S, gW * S, 2 * S);
  pixel(gc,          gr + gH, C.chainCol);
  pixel(gc,          gr + gH + 1, C.chainCol);
  pixel(gc + gW - 1, gr + gH, C.chainCol);
  pixel(gc + gW - 1, gr + gH + 1, C.chainCol);

  // Draw pixel clouds for day mode inside castle canvas
  function drawCastleDayClouds(ctx2, t) {
    const cloudDefs = [
      { x: ((t * 0.08) % (COLS + 40)) - 20, y: 3, scale: 2, alpha: 0.85 },
      { x: ((t * 0.05 + 80) % (COLS + 40)) - 20, y: 7, scale: 3, alpha: 0.7 },
      { x: ((t * 0.03 + 150) % (COLS + 40)) - 20, y: 2, scale: 2, alpha: 0.9 },
      { x: ((t * 0.07 + 30) % (COLS + 40)) - 20, y: 5, scale: 2, alpha: 0.6 },
    ];
    const shapes = [
      [[0,1,2,1],[1,0,3,1],[0,0,5,1],[0,1,5,1],[1,2,3,1]],
      [[1,0,2,1],[0,1,4,1],[0,1,4,2],[1,3,2,1]],
    ];
    for (let i = 0; i < cloudDefs.length; i++) {
      const { x, y, scale, alpha } = cloudDefs[i];
      const shape = shapes[i % shapes.length];
      ctx2.fillStyle = 'rgba(255,255,255,' + alpha + ')';
      for (const [cx, cy, cw, ch] of shape) {
        ctx2.fillRect(
          Math.round((x + cx * scale) * S),
          Math.round((y + cy * scale) * S),
          cw * scale * S, ch * scale * S
        );
      }
    }
    // Pixel birds
    const birdDefs = [
      { x: ((t * 0.12 + 20) % (COLS + 10)) - 5, y: 4 },
      { x: ((t * 0.09 + 90) % (COLS + 10)) - 5, y: 9 },
      { x: ((t * 0.15 + 50) % (COLS + 10)) - 5, y: 6 },
    ];
    for (let i = 0; i < birdDefs.length; i++) {
      const { x, y } = birdDefs[i];
      const flap = Math.sin(t / 200 + i * 1.5) > 0;
      ctx2.fillStyle = 'rgba(30,20,50,0.55)';
      const bx = Math.round(x), by = Math.round(y);
      if (flap) {
        ctx2.fillRect(bx * S, by * S, 2 * S, S);
        ctx2.fillRect((bx + 3) * S, by * S, 2 * S, S);
      } else {
        ctx2.fillRect(bx * S, (by + 1) * S, 2 * S, S);
        ctx2.fillRect((bx + 3) * S, (by + 1) * S, 2 * S, S);
      }
      ctx2.fillRect((bx + 1) * S, (flap ? by + 1 : by) * S, 3 * S, S);
    }
  }

  // Draw castle structure into a separate canvas
  function buildCastleStructure() {
    const sc = document.createElement('canvas');
    sc.width  = canvas.width;
    sc.height = canvas.height;
    const sCtx = sc.getContext('2d');
    sCtx.drawImage(canvas, 0, 0);
    return sc;
  }
  const castleStructureCanvas = buildCastleStructure();

  // Bats
  const BATS = [
    { x: 30, y: 8,  dx: 0.6,  dy: 0.15, flapT: 0,   flapPeriod: 300 },
    { x: 165, y:12, dx: -0.4, dy: 0.10, flapT: 150,  flapPeriod: 250 },
    { x: 10,  y:20, dx: 0.35, dy: 0.12, flapT: 75,   flapPeriod: 280 },
  ];

  const flickWindows = [
    { col: 65, row: 21, phase: 0,    period: 3000 },
    { col: 73, row: 21, phase: 1000, period: 2400 },
    { col: 122,row: 28, phase: 500,  period: 2800 },
  ];

  function drawBat(ctx2, bx, by, flapped) {
    ctx2.fillStyle = C.bat;
    if (flapped) {
      ctx2.fillRect(bx * S,       by * S,       2 * S, S);
      ctx2.fillRect((bx + 3) * S, by * S,       2 * S, S);
      ctx2.fillRect((bx + 1) * S, (by + 1) * S, 3 * S, 2 * S);
    } else {
      ctx2.fillRect(bx * S,       (by + 1) * S, 2 * S, S);
      ctx2.fillRect((bx + 3) * S, (by + 1) * S, 2 * S, S);
      ctx2.fillRect((bx + 1) * S, by * S,       3 * S, 2 * S);
    }
    ctx2.fillStyle = C.bloodLt;
    ctx2.fillRect((bx + 1) * S + 1, (by + 1) * S + 1, 2, 2);
    ctx2.fillRect((bx + 3) * S - 1, (by + 1) * S + 1, 2, 2);
  }

  let animStart = null;
  function animate(timestamp) {
    if (!animStart) animStart = timestamp;
    const t = timestamp - animStart;
    const isDay = document.documentElement.getAttribute('data-theme') === 'light';

    // Redraw sky each frame (adapts to theme)
    drawSkyBg();
    if (!isDay) {
      // Night: draw mountains
      for (const [x, top, w] of mtns) {
        const half = Math.floor(w / 2);
        for (let i = 0; i <= half; i++) {
          const rw = i * 2 + 1;
          const lc = x + half - Math.floor(rw / 2);
          ctx.fillStyle = C.mtCol;
          ctx.fillRect(Math.max(0, lc) * S, (top + i) * S, Math.min(rw, COLS - lc) * S, S);
        }
        ctx.fillStyle = C.mtCol;
        ctx.fillRect(x * S, (top + half + 1) * S, w * S, (ROWS - (top + half + 1)) * S);
      }
    }
    // Draw castle structure on top
    ctx.drawImage(castleStructureCanvas, 0, 0);
    if (isDay) {
      drawCastleDayClouds(ctx, t);
    }

    for (const fw of flickWindows) {
      const flicker = Math.sin((t + fw.phase) / fw.period * Math.PI * 2);
      const lit     = flicker > -0.3;
      const opacity = lit ? (0.3 + 0.7 * ((flicker + 1) / 2)) : 0.05;
      ctx.fillStyle = `rgba(139,34,82,${(opacity * 0.4).toFixed(3)})`;
      ctx.fillRect((fw.col - 1) * S, (fw.row - 2) * S, 7 * S, 9 * S);
      ctx.fillStyle = lit ? `rgba(192,57,110,${opacity.toFixed(3)})` : C.windowDrk;
      ctx.fillRect(fw.col * S, fw.row * S, 5 * S, 5 * S);
      ctx.fillRect((fw.col + 1) * S, (fw.row - 1) * S, 3 * S, S);
    }

    if (!isDay) {
      for (const bat of BATS) {
        bat.x += bat.dx;
        bat.y += Math.sin(t / 800 + bat.flapT) * bat.dy;
        if (bat.x > COLS + 6) bat.x = -6;
        if (bat.x < -6)       bat.x = COLS + 6;
        bat.y = Math.max(2, Math.min(18, bat.y));
        const flapped = ((t + bat.flapT) % bat.flapPeriod) < bat.flapPeriod / 2;
        drawBat(ctx, Math.floor(bat.x), Math.floor(bat.y), flapped);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();


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
(function initDaySky() {
  const canvas = document.getElementById('daySkyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const S = 4; // pixel block size

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Pixel clouds — each cloud is an array of (col, row, w, h) blocks
  const cloudShapes = [
    // Shape 1 — wide fluffy
    [[0,1,2,1],[1,0,3,1],[0,0,5,1],[0,1,5,1],[1,2,3,1]],
    // Shape 2 — tall round
    [[1,0,2,1],[0,1,3,1],[0,1,3,2],[1,3,2,1]],
    // Shape 3 — long wispy
    [[0,0,4,1],[1,1,5,1],[0,1,6,1],[1,2,4,1]],
  ];

  const clouds = [];
  function spawnCloud(x) {
    const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    const scale = 2 + Math.floor(Math.random() * 4);
    const y = 20 + Math.random() * (window.innerHeight * 0.5);
    const speed = 0.1 + Math.random() * 0.3;
    const alpha = 0.6 + Math.random() * 0.4;
    clouds.push({ x: x || canvas.width + 50, y, shape, scale, speed, alpha });
  }

  // Initial clouds scattered across sky
  for (let i = 0; i < 8; i++) {
    const cloud = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    const scale = 2 + Math.floor(Math.random() * 4);
    const x = Math.random() * window.innerWidth;
    const y = 20 + Math.random() * (window.innerHeight * 0.5);
    const speed = 0.1 + Math.random() * 0.3;
    const alpha = 0.6 + Math.random() * 0.4;
    clouds.push({ x, y, shape: cloud, scale, speed, alpha });
  }

  // Birds (pixel silhouettes — like seagulls in the sky)
  const birds = [];
  for (let i = 0; i < 5; i++) {
    birds.push({
      x: Math.random() * window.innerWidth,
      y: 40 + Math.random() * (window.innerHeight * 0.35),
      speed: 0.4 + Math.random() * 0.6,
      wingT: Math.random() * Math.PI * 2,
      wingPeriod: 400 + Math.random() * 300,
      size: 1 + Math.floor(Math.random() * 2),
    });
  }

  function drawCloud(ctx2, cloud) {
    const { x, y, shape, scale, alpha } = cloud;
    ctx2.fillStyle = `rgba(255,255,255,${alpha})`;
    for (const [cx, cy, cw, ch] of shape) {
      ctx2.fillRect(
        Math.round(x + cx * scale * S),
        Math.round(y + cy * scale * S),
        cw * scale * S,
        ch * scale * S
      );
    }
    // Subtle shadow bottom edge
    ctx2.fillStyle = `rgba(180,210,240,${alpha * 0.4})`;
    for (const [cx, cy, cw, ch] of shape) {
      ctx2.fillRect(
        Math.round(x + cx * scale * S),
        Math.round(y + (cy + ch - 0.5) * scale * S),
        cw * scale * S,
        Math.round(0.5 * scale * S)
      );
    }
  }

  function drawBird(ctx2, bird, timestamp) {
    const flap = Math.sin((timestamp + bird.wingT) / bird.wingPeriod * Math.PI * 2);
    const bx = Math.round(bird.x);
    const by = Math.round(bird.y + flap * 3);
    const sz = bird.size;
    // Simple pixel bird: two wing arcs (2 rects) with body dot
    ctx2.fillStyle = 'rgba(30,20,50,0.65)';
    if (flap > 0) {
      // Wings up
      ctx2.fillRect(bx - 4*sz, by - sz, 3*sz, sz);
      ctx2.fillRect(bx + sz, by - sz, 3*sz, sz);
    } else {
      // Wings down
      ctx2.fillRect(bx - 4*sz, by + sz, 3*sz, sz);
      ctx2.fillRect(bx + sz, by + sz, 3*sz, sz);
    }
    // Body
    ctx2.fillRect(bx - sz, by - sz, 2*sz, 2*sz);
  }

  let lastTs = 0;
  let spawnTimer = 0;

  function drawDaySky(timestamp) {
    if (!document.documentElement.dataset.theme === 'light' &&
        document.documentElement.getAttribute('data-theme') !== 'light') {
      requestAnimationFrame(drawDaySky);
      return;
    }
    if (document.documentElement.getAttribute('data-theme') !== 'light') {
      requestAnimationFrame(drawDaySky);
      return;
    }

    const dt = timestamp - lastTs;
    lastTs = timestamp;
    spawnTimer += dt;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    for (const cloud of clouds) {
      cloud.x -= cloud.speed;
      drawCloud(ctx, cloud);
    }

    // Remove off-screen clouds and maybe spawn new
    const activeCount = clouds.filter(c => c.x > -300).length;
    clouds.splice(0, clouds.findIndex(c => c.x > -300));
    if (spawnTimer > 8000) {
      spawnTimer = 0;
      if (activeCount < 10) spawnCloud(canvas.width + 60);
    }

    // Draw birds
    for (const bird of birds) {
      bird.x -= bird.speed;
      bird.y += Math.sin(timestamp / 1200 + bird.wingT) * 0.2;
      if (bird.x < -30) bird.x = canvas.width + 30;
      drawBird(ctx, bird, timestamp);
    }

    requestAnimationFrame(drawDaySky);
  }

  requestAnimationFrame(drawDaySky);
})();

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
}

const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => applyTheme(!isDark));
}

// ============================
// HAMBURGER
// ============================
const hamburgerBtn = document.getElementById('hamburger');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    document.getElementById('hudNav').classList.toggle('open');
  });
}

// ============================
// LEVEL UP TOAST
// ============================
const toast = document.getElementById('levelupToast');
const toastMessages = [
  ['ARSENAL REVELADO!',   'Stack técnica desbloqueada'],
  ['CRÔNICAS ABERTAS!',   'Experiências de batalha disponíveis'],
  ['MISSÕES COMPLETAS!',  'Log de projetos carregado'],
  ['CONTRATOS ABERTOS!',  'Serviços disponíveis para contratação'],
];
let toastIdx = 0;

function showToast(title, msg) {
  if (!toast) return;
  toast.querySelector('.levelup-toast-title').textContent = '✦ ' + title + ' ✦';
  toast.querySelector('.levelup-toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================
// INTERSECTION OBSERVER
// ============================
const observedSections = document.querySelectorAll('section[id]:not(#home)');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      if (toastIdx < toastMessages.length) {
        setTimeout(() => showToast(...toastMessages[toastIdx++]), 400);
      }
      entry.target.querySelectorAll('.mastery-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 50);
      });
      entry.target.querySelectorAll('.status-progress-fill').forEach(bar => {
        bar.style.width = (bar.dataset.width || '0') + '%';
      });
      sectionObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

observedSections.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(24px)';
  s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  sectionObs.observe(s);
});

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
// FLASH EFFECT ON CLICK
// ============================
document.querySelectorAll('.quest-link, .contact-btn, .press-start, .manuscript-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:var(--rune);opacity:0.06;pointer-events:none;z-index:9998;';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 120);
  });
});

// ============================
// YEAR IN FOOTER
// ============================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================
// EXPERIÊNCIA ACCORDION
// ============================
document.querySelectorAll('.exp-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.exp-card');
    const details = card.querySelector('.exp-details');
    if (!details) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      details.setAttribute('hidden', '');
    } else {
      details.removeAttribute('hidden');
    }
  });
});