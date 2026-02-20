// ── CONTRATOS: flash click nas CTAs ──────────────────────────

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
