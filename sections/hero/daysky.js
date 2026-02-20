// ── DAY SKY: CLOUDS & BIRDS ──────────────────────────────────

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
