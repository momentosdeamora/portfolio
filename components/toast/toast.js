// ── TOAST NOTIFICATIONS ──────────────────────────────────────

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
