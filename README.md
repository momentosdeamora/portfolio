# 🧙 Portfolio de uma Amora

Um portfólio pessoal construído com **arquitetura modular**, inspirado em interfaces de RPG, onde cada seção representa um elemento da jornada do personagem (desenvolvedor).
---

## ✨ Visão geral

O portfólio é estruturado como um **shell principal** (`index.html`) que carrega dinamicamente seções e componentes via JavaScript.

A interface simula um jogo com:

* HUD fixa com navegação e barras de status
* Sistema de XP baseado em scroll
* Tema dark/light com modo dia animado
* Toasts contextuais por seção
* Observers para animações, barras e contadores
* Pixel art animada (estrelas, castelo, pássaros, nuvens)

---

## 🧱 Arquitetura do projeto

```
portfolio/
├── index.html              ← shell: HUD + slots
├── main.js                 ← ponto de entrada: carrega seções e módulos
├── main.css                ← importa todos os CSS via @import
│
├── core/
│   ├── variables.css       ← tokens de design (cores, fontes)
│   ├── base.css            ← reset, globals, sections, dialog, animations
│   ├── daymode.css         ← sky, clouds, birds (modo dia)
│   ├── responsive.css      ← media queries
│   ├── theme.js            ← toggle dark/light
│   └── observers.js        ← IntersectionObserver: animações, barras, contadores
│
├── components/
│   ├── hud/
│   │   ├── hud.html        ← (referência; HUD fica inline no index)
│   │   ├── hud.css         ← nav, XP, HP bars, hamburger
│   │   ├── hud.js          ← XP/HP state, scroll XP, hamburger, active nav
│   │   └── stars.css       ← canvas de estrelas
│   ├── toast/
│   │   ├── toast.html      ← markup do toast
│   │   ├── toast.css
│   │   └── toast.js        ← showToast(), mensagens por seção
│   └── footer/
│       ├── footer.html
│       ├── footer.css
│       └── footer.js       ← ano atual
│
└── sections/
    ├── hero/
    │   ├── hero.html       ← markup da section#home
    │   ├── hero.css
    │   ├── stars.js        ← pixel stars animadas
    │   ├── castle.js       ← castelo pixel art
    │   └── daysky.js       ← nuvens e pássaros
    ├── personagem/         ← section#sobre
    ├── arsenal/            ← section#skills
    ├── missoes/            ← section#projetos
    ├── contratos/          ← section#servicos
    ├── taverna/            ← section#contato
    ├── grimorio/           ← section#conteudo
    ├── status/             ← section#status
    ├── experiencia/        ← section#experiencia (+ accordion JS)
    └── formacao/           ← section#formacao
```

---

## 🎮 Conceito das seções

| Seção       | Representação           |
| ----------- | ----------------------- |
| Hero        | Tela inicial do jogo    |
| Personagem  | Sobre o desenvolvedor   |
| Arsenal     | Skills e tecnologias    |
| Missões     | Projetos                |
| Contratos   | Serviços                |
| Taverna     | Contato                 |
| Grimório    | Conteúdo / artigos      |
| Status      | Métricas e estatísticas |
| Experiência | Timeline profissional   |
| Formação    | Educação                |

---

## ⚙️ Tecnologias

* HTML5 semântico
* CSS modular com design tokens
* JavaScript vanilla modular
* IntersectionObserver API
* Canvas para efeitos pixel
* Arquitetura baseada em slots dinâmicos

---

## 🧩 Padrões arquiteturais

### 📦 Component-first

Componentes reutilizáveis isolados (HUD, Toast, Footer)

### 🧠 Lazy loading de seções

Seções são carregadas sob demanda pelo `main.js`

### 🎨 Design System centralizado

Tokens em `variables.css`

### 👀 Observability

IntersectionObserver gerencia:

* animações
* progress bars
* counters
* reveal on scroll

### 🌗 Theme engine

`theme.js` controla:

* dark mode
* day mode
* persistência em localStorage

---

## 🚀 Features principais

* HUD com navegação ativa automática
* Barra de XP baseada em scroll
* Toast contextual por seção
* Accordion na experiência
* Pixel sky animado
* Castle pixel art
* Stars canvas
* Responsividade completa
* Hamburger menu
* Theme persistence
* Progress bars animadas
* Contadores numéricos animados

---

## 🔮 Próximos níveis

* Mini-game interativo
* Backend para mensagens da taverna
* Um blog
* Responsividade

---

## 📜 Licença

MIT

---
