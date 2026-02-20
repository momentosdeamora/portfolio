// ============================================================
// MAIN.JS — Ponto de entrada
// Injeta seções HTML e inicializa todos os módulos
// ============================================================

const SECTIONS = [
  { slot: 'slot-hero',        src: 'sections/hero/hero.html'              },
  { slot: 'slot-personagem',  src: 'sections/personagem/personagem.html'  },
  { slot: 'slot-arsenal',     src: 'sections/arsenal/arsenal.html'        },
  { slot: 'slot-missoes',     src: 'sections/missoes/missoes.html'        },
  { slot: 'slot-contratos',   src: 'sections/contratos/contratos.html'    },
  { slot: 'slot-taverna',     src: 'sections/taverna/taverna.html'        },
  { slot: 'slot-grimorio',    src: 'sections/grimorio/grimorio.html'      },
  { slot: 'slot-status',      src: 'sections/status/status.html'          },
  { slot: 'slot-cicatrizes',  src: 'sections/cicatrizes/cicatrizes.html'  },
  { slot: 'slot-publicacao',  src: 'sections/publicacao/publicacao.html'  },
  { slot: 'slot-experiencia', src: 'sections/experiencia/experiencia.html'},
  { slot: 'slot-formacao',    src: 'sections/formacao/formacao.html'      },
  { slot: 'slot-footer',      src: 'components/footer/footer.html'        },
];

async function loadSections() {
  await Promise.all(SECTIONS.map(async ({ slot, src }) => {
    try {
      const res  = await fetch(src);
      const html = await res.text();
      const el   = document.getElementById(slot);
      if (el) el.outerHTML = html;
    } catch (e) {
      console.error(`[main] Falha: ${src}`, e);
    }
  }));
}

async function initModules() {
  // Ordem importa: hero primeiro (stars precisam do DOM)
  await import('./sections/hero/stars.js');
  await import('./sections/hero/castle.js');
  await import('./sections/hero/daysky.js');

  // Core
  await import('./core/theme.js');
  await import('./core/observers.js');

  // Components
  await import('./components/hud/hud.js');
  await import('./components/toast/toast.js');
  await import('./components/footer/footer.js');

  // Sections com JS próprio
  await import('./sections/experiencia/experiencia.js');
  await import('./sections/contratos/contratos.js');

  console.log('[portfolio] ✅ Todos os módulos carregados');
}

(async () => {
  await loadSections();
  await initModules();
})();