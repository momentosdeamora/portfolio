// ── ACCORDION: expand/collapse detalhes ──────────────────────

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