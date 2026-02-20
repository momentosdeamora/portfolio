// ── CASTLE PIXEL ART ─────────────────────────────────────────

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
