// ================================================================
//  i18n.js — PT / EN Language Toggle — Bella Brasil Market Plus
//  Abordagem: selector-map + data-i18n attributes
// ================================================================

const LANG_KEY = 'bellabrasil_lang';

// ── 1. data-i18n attribute translations (legacy + new) ──────────
const translations = {
  'hero-badge':    { pt: '🚚 Delivery para todo Washington', en: '🚚 Delivery across Washington' },
  'hero-cta-shop': { pt: '🛒 Comprar Agora', en: '🛒 Shop Now' },
  'hero-cta-more': { pt: 'Saiba Mais →',     en: 'Learn More →' },
};

// ── 2. Selector map — cobre todos os textos sem data-i18n ───────
// { sel, pt, en }          → substitui textContent do elemento
// { sel, pt, en, html }    → substitui innerHTML (para spans internos)
// { sel, pt, en, attr }    → substitui um atributo (ex: placeholder)
// { sel, pt, en, lastText} → substitui somente o último nó de texto
//                            (usado quando há <span class="t-icon"> antes)
const selectorMap = [

  // ── Navbar desktop ───────────────────────────────────────────
  { sel: '.nav-links a[href="index.html"]',   pt: 'Início',   en: 'Home' },
  { sel: '.nav-links a[href="shop.html"]',    pt: 'Produtos', en: 'Products' },
  { sel: '.nav-links a[href="about.html"]',   pt: 'Sobre',    en: 'About' },
  { sel: '.nav-links a[href="contact.html"]', pt: 'Contato',  en: 'Contact' },

  // ── Navbar mobile ────────────────────────────────────────────
  { sel: '.mobile-nav a[href="index.html"]',   pt: '🏠 Início',      en: '🏠 Home' },
  { sel: '.mobile-nav a[href="shop.html"]',    pt: '🛍️ Produtos',    en: '🛍️ Products' },
  { sel: '.mobile-nav a[href="about.html"]',   pt: 'ℹ️ Sobre Nós',   en: 'ℹ️ About Us' },
  { sel: '.mobile-nav a[href="contact.html"]', pt: '📞 Contato',     en: '📞 Contact' },
  { sel: '.mobile-nav a[href="cart.html"]',    pt: '🛒 Ver Carrinho', en: '🛒 View Cart' },
  { sel: '.mobile-nav a[href="conta.html"]',   pt: '👤 Minha Conta', en: '👤 My Account' },

  // ── Search bar ───────────────────────────────────────────────
  { sel: '.search-bar input', pt: 'Buscar produtos brasileiros...', en: 'Search Brazilian products...', attr: 'placeholder' },

  // ── Trust bar (tem <span class="t-icon"> → lastText) ─────────
  { sel: '.trust-item.green', pt: 'Checkout 100% Seguro',       en: '100% Secure Checkout',     lastText: true },
  { sel: '.trust-item.navy',  pt: '4.9 no Google (90+ avaliações)', en: '4.9 on Google (90+ reviews)', lastText: true },

  // ── Hero ─────────────────────────────────────────────────────
  { sel: '.hero-badge',       pt: '🚚 Delivery para todo Washington', en: '🚚 Delivery across Washington' },
  { sel: '.hero h1', html: true,
    pt: 'O sabor do<br><span>Brasil</span> 🇧🇷<br>na sua porta!',
    en: 'The taste of<br><span>Brazil</span> 🇺🇸<br>at your door!' },
  { sel: '.hero-content > p',
    pt: 'Carnes frescas, pão de queijo, guaraná, açaí e tudo que você sente saudade. Delivery para todo o estado de Washington 🇺🇸',
    en: 'Fresh meats, pão de queijo, guaraná, açaí and everything you miss from home. Delivery across all of Washington State 🇺🇸' },
  { sel: '.hero-stat:nth-child(2) span', pt: 'Avaliações', en: 'Reviews' },
  { sel: '.hero-stat:nth-child(3) span', pt: 'Produtos',   en: 'Products' },
  { sel: '.hero-stat:nth-child(4) span', pt: 'Delivery',   en: 'Delivery' },
  { sel: '.hero-store-label',
    html: true,
    pt: 'Bella Brasil Market Plus<small>12545 116th Ave NE · Kirkland, WA 98034</small>',
    en: 'Bella Brasil Market Plus<small>12545 116th Ave NE · Kirkland, WA 98034</small>' },
  { sel: '.hero-flag-badge.badge-br',       pt: '🇧🇷 Sabor Autêntico', en: '🇧🇷 Authentic Flavor' },
  { sel: '.hero-flag-badge.badge-delivery', pt: '🚚 Frete grátis acima de $60', en: '🚚 Free shipping over $60' },

  // ── Info strip ───────────────────────────────────────────────
  { sel: '.info-item:nth-child(1)', pt: '🚚 Frete grátis acima de $60',  en: '🚚 Free shipping over $60',      html: true },
  { sel: '.info-item:nth-child(2)', pt: '🇧🇷 Produtos 100% brasileiros',  en: '🇧🇷 100% Brazilian products',     html: true },
  { sel: '.info-item:nth-child(3)', pt: '⭐ 4.9 estrelas no Google',      en: '⭐ 4.9 stars on Google',          html: true },
  { sel: '.info-item:nth-child(4)', pt: '📦 Delivery para todo WA',       en: '📦 Delivery across WA',           html: true },
  { sel: '.info-item:nth-child(5)', pt: '🔒 Pagamento seguro',            en: '🔒 Secure payment',               html: true },

  // ── Section: Categorias ──────────────────────────────────────
  { sel: '#home-category-grid + * .section-eyebrow, .section-eyebrow:first-of-type',
    pt: 'Explore por categoria', en: 'Browse by category' },
  { sel: '.cat-count', pt: 'Ver produtos', en: 'View products' },

  // ── Section: Mais Vendidos ───────────────────────────────────
  { sel: '.section-eyebrow', pt: 'Mais Vendidos', en: 'Best Sellers',   all: true },
  { sel: '.see-all',         pt: 'Ver todos →',   en: 'See all →',      all: true },

  // ── Section: Promoções ───────────────────────────────────────
  { sel: '#promo-products + * .section-eyebrow', pt: 'Promoções', en: 'Promotions' },

  // ── Footer ───────────────────────────────────────────────────
  { sel: '.footer-brand p',        pt: 'Sua loja brasileira de confiança em Kirkland, Washington. Trazemos o sabor autêntico do Brasil para a sua mesa!',
                                   en: 'Your trusted Brazilian store in Kirkland, Washington. We bring the authentic taste of Brazil to your table!' },
  { sel: '.footer-col:nth-child(2) h4', pt: 'Categorias',               en: 'Categories' },
  { sel: '.footer-col:nth-child(3) h4', pt: 'Horário de Funcionamento', en: 'Store Hours' },
  { sel: '.footer-col:nth-child(4) h4', pt: 'Contato & Localização',    en: 'Contact & Location' },
  { sel: '.footer-col .footer-delivery-note',
    pt: 'Delivery disponível para todo o estado de Washington (WA)',
    en: 'Delivery available across Washington State (WA)' },
  { sel: '.footer-bottom span:first-child',
    pt: '© 2025 Bella Brasil Market Plus. Todos os direitos reservados.',
    en: '© 2025 Bella Brasil Market Plus. All rights reserved.' },

  // ── About page ───────────────────────────────────────────────
  { sel: '.about-hero h1', html: true,
    pt: 'Levando o <span>Brasil</span> até você<br>em Kirkland, WA 🇧🇷',
    en: 'Bringing <span>Brazil</span> to you<br>in Kirkland, WA 🇧🇷' },

  // ── Cart / Checkout ──────────────────────────────────────────
  { sel: '.cart-btn',  pt: '🛒 Carrinho', en: '🛒 Cart',        html: true, keepChild: '.cart-count' },
];

// ── Core helpers ────────────────────────────────────────────────

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || 'pt';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  updateToggleBtn(lang);
}

/** Substitui apenas o último nó de texto de um elemento (preserva ícones) */
function _replaceLastTextNode(el, text) {
  const textNodes = [...el.childNodes].filter(
    n => n.nodeType === 3 && n.textContent.trim().length > 0
  );
  if (textNodes.length > 0) {
    textNodes[textNodes.length - 1].textContent = ' ' + text;
  }
}

function applyLang(lang) {
  // 1) data-i18n attributes (backward compat)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key]?.[lang]) el.textContent = translations[key][lang];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (translations[key]?.[lang]) el.innerHTML = translations[key][lang];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[key]?.[lang]) el.placeholder = translations[key][lang];
  });

  // 2) selectorMap
  selectorMap.forEach(item => {
    const text = lang === 'en' ? item.en : item.pt;
    if (text === undefined) return;

    const nodes = item.all
      ? document.querySelectorAll(item.sel)
      : [document.querySelector(item.sel)].filter(Boolean);

    nodes.forEach(el => {
      if (!el) return;
      if (item.attr) {
        el[item.attr] = text;
      } else if (item.html) {
        el.innerHTML = text;
      } else if (item.lastText) {
        _replaceLastTextNode(el, text);
      } else {
        el.textContent = text;
      }
    });
  });

  // 3) Account link: preserve dynamic name
  const user = (() => { try { return JSON.parse(localStorage.getItem('bellabrasil_user')); } catch { return null; } })();
  document.querySelectorAll('#nav-account-link').forEach(l => {
    l.textContent = user
      ? `👤 ${user.firstName || (lang === 'en' ? 'Account' : 'Conta')}`
      : (lang === 'en' ? '👤 My Account' : '👤 Minha Conta');
  });

  // 4) html lang attribute
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
}

function updateToggleBtn(lang) {
  const btn = document.getElementById('lang-toggle-btn');
  if (!btn) return;
  btn.textContent = lang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT';
  btn.title = lang === 'pt' ? 'Switch to English' : 'Mudar para Português';
}

function toggleLang() {
  const current = getCurrentLang();
  setLang(current === 'pt' ? 'en' : 'pt');
}

function initLangToggle() {
  const navbar = document.querySelector('.navbar');
  if (!navbar || document.getElementById('lang-toggle-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'lang-toggle-btn';
  btn.onclick = toggleLang;
  btn.style.cssText = `background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);
    color:#fff;padding:.35rem .8rem;border-radius:8px;font-size:.82rem;font-weight:700;
    cursor:pointer;transition:background .2s;flex-shrink:0;letter-spacing:.04em;`;
  btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,.24)');
  btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,.12)');

  const cartBtn = navbar.querySelector('.cart-btn');
  if (cartBtn) navbar.insertBefore(btn, cartBtn);
  else navbar.appendChild(btn);

  const lang = getCurrentLang();
  applyLang(lang);
  updateToggleBtn(lang);
}
