// ── PIXEL STARS ──────────────────────────────────────────────

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
  const colorsDark  = [[155,109,255],[192,57,110],[200,191,232],[212,168,67]];
  const colorsLight = [[26,115,232],[66,165,245],[100,181,246],[160,104,0]];
  function getColors() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? colorsLight : colorsDark;
  }
  window._starsResize = resize;

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
        color:  getColors()[colorIdx],
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