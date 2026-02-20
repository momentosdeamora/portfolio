// ── SECTION OBSERVER: animações + progress bars + counters ───

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
      entry.target.querySelectorAll('.blessing-meter-fill').forEach(bar => {
        requestAnimationFrame(() => {
          bar.style.background = 'linear-gradient(90deg, #9b6dff, #c0396e)';
          bar.style.width = (bar.dataset.width || '0') + '%';
        });
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
})