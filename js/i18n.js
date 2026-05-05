// ================================================================
//  i18n.js — PT / EN Language Toggle — Bella Brasil Market Plus
// ================================================================

const LANG_KEY = 'bellabrasil_lang';

// ── Translation dictionary ──────────────────────────────────────
const translations = {
  // Nav
  'nav-inicio':   { pt: 'Início',       en: 'Home' },
  'nav-produtos': { pt: 'Produtos',     en: 'Products' },
  'nav-sobre':    { pt: 'Sobre',        en: 'About' },
  'nav-contato':  { pt: 'Contato',      en: 'Contact' },
  'nav-conta':    { pt: '👤 Minha Conta', en: '👤 My Account' },
  'nav-carrinho': { pt: '🛒 Carrinho',    en: '🛒 Cart' },
  'nav-inicio-m': { pt: '🏠 Início',      en: '🏠 Home' },
  'nav-produtos-m':{ pt: '🛍️ Produtos',   en: '🛍️ Products' },
  'nav-sobre-m':  { pt: 'ℹ️ Sobre Nós',   en: 'ℹ️ About Us' },
  'nav-contato-m':{ pt: '📞 Contato',     en: '📞 Contact' },
  'nav-conta-m':  { pt: '👤 Minha Conta', en: '👤 My Account' },
  'nav-cart-m':   { pt: '🛒 Ver Carrinho',en: '🛒 View Cart' },

  // Trust bar
  'trust-secure': { pt: 'Checkout 100% Seguro',         en: '100% Secure Checkout' },
  'trust-square': { pt: 'Powered by Square Checkout',   en: 'Powered by Square Checkout' },
  'trust-free':   { pt: 'Frete Grátis acima de $60',    en: 'Free Shipping over $60' },
  'trust-google': { pt: '4.9 no Google (90+ avaliações)',en: '4.9 on Google (90+ reviews)' },
  'trust-return': { pt: 'Devolução Garantida',           en: 'Guaranteed Returns' },

  // Hero
  'hero-badge':    { pt: '🚚 Delivery para todo Washington', en: '🚚 Delivery across Washington' },
  'hero-cta-shop': { pt: '🛒 Comprar Agora', en: '🛒 Shop Now' },
  'hero-cta-more': { pt: 'Saiba Mais →',     en: 'Learn More →' },
  'hero-stat-reviews': { pt: 'Avaliações', en: 'Reviews' },
  'hero-stat-products':{ pt: 'Produtos',   en: 'Products' },
  'hero-stat-delivery':{ pt: 'Delivery',   en: 'Delivery' },
  'hero-store-delivery':{ pt: '🚚 Frete grátis acima de $60', en: '🚚 Free shipping over $60' },
  'hero-badge-br': { pt: '🇧🇷 Sabor Autêntico', en: '🇧🇷 Authentic Flavor' },

  // Info strip
  'strip-1': { pt: '🚚 Frete grátis acima de $60', en: '🚚 Free shipping over $60' },
  'strip-2': { pt: '🇧🇷 Produtos 100% brasileiros', en: '🇧🇷 100% Brazilian products' },
  'strip-3': { pt: '⭐ 4.9 estrelas no Google',    en: '⭐ 4.9 stars on Google' },
  'strip-4': { pt: '📦 Delivery para todo WA',     en: '📦 Delivery across WA' },
  'strip-5': { pt: '🔒 Pagamento seguro',          en: '🔒 Secure payment' },

  // Categories section
  'cat-eyebrow': { pt: 'Explore por categoria',  en: 'Browse by category' },
  'cat-h2-a':    { pt: 'O que você está',        en: "What are you" },
  'cat-h2-b':    { pt: 'procurando?',            en: 'looking for?' },
  'cat-ver-prod':{ pt: 'Ver produtos',           en: 'View products' },
  'cat-all-name':{ pt: 'Ver Todos',              en: 'See All' },
  'cat-all-sub': { pt: 'Todos os produtos',      en: 'All products' },

  // Featured / promo sections
  'feat-eyebrow': { pt: 'Mais Vendidos',              en: 'Best Sellers' },
  'feat-h2-a':    { pt: 'Os',                         en: 'Community' },
  'feat-h2-b':    { pt: 'favoritos',                  en: 'favorites' },
  'feat-h2-c':    { pt: 'da comunidade',              en: '' },
  'feat-see-all': { pt: 'Ver todos →',               en: 'See all →' },
  'promo-eyebrow':{ pt: 'Promoções',                  en: 'Promotions' },
  'promo-h2-a':   { pt: 'Ofertas',                   en: 'Unmissable' },
  'promo-h2-b':   { pt: 'imperdíveis',               en: 'offers' },
  'promo-see-all':{ pt: 'Ver todas →',               en: 'See all →' },

  // Promo banners
  'promo1-h3':    { pt: 'Churrasco Perfeito',         en: 'Perfect BBQ' },
  'promo1-p':     { pt: 'Picanha, linguiça e costela fresquinha direto pra sua grelha!', en: 'Picanha, sausage and ribs fresh to your grill!' },
  'promo1-btn':   { pt: 'Ver Carnes →',               en: 'Shop Meats →' },
  'promo2-h3':    { pt: 'Café da Manhã Brasileiro',   en: 'Brazilian Breakfast' },
  'promo2-p':     { pt: 'Pão de queijo, requeijão, café Pilão e achocolatado Nescau!', en: 'Cheese bread, cream cheese, Pilão coffee and Nescau!' },
  'promo2-btn':   { pt: 'Ver Frios →',                en: 'Shop Dairy →' },

  // Why Bella Brasil section
  'why-eyebrow':  { pt: 'Por que escolher a Bella Brasil?', en: 'Why choose Bella Brasil?' },
  'why-h2-a':     { pt: 'A melhor',                   en: 'The best' },
  'why-h2-b':     { pt: 'experiência',                en: 'Brazilian' },
  'why-h2-c':     { pt: 'brasileira em WA',           en: 'experience in WA' },
  'why-feat1-h4': { pt: 'Produtos Autênticos',        en: 'Authentic Products' },
  'why-feat1-p':  { pt: 'Importados diretamente do Brasil com sabor e qualidade garantidos.', en: 'Directly imported from Brazil with guaranteed flavor and quality.' },
  'why-feat2-h4': { pt: 'Delivery em todo WA',        en: 'Delivery across WA' },
  'why-feat2-p':  { pt: 'Entregamos em todo o estado de Washington via UPS.', en: 'We deliver across all of Washington State via UPS.' },
  'why-feat3-h4': { pt: 'Pagamento Seguro',           en: 'Secure Payment' },
  'why-feat3-p':  { pt: 'Checkout 100% seguro via Square. Aceitamos cartões e digital wallets.', en: '100% secure checkout via Square. We accept cards and digital wallets.' },
  'why-feat4-h4': { pt: 'Atendimento em Português',  en: 'Portuguese Support' },
  'why-feat4-p':  { pt: 'Nossa equipe fala português e está pronta para te ajudar!', en: 'Our team speaks Portuguese and is ready to help!' },

  // Reviews section
  'rev-eyebrow':  { pt: 'Avaliações',                 en: 'Reviews' },
  'rev-h2-a':     { pt: 'O que nossos',               en: 'What our' },
  'rev-h2-b':     { pt: 'clientes',                   en: 'customers' },
  'rev-h2-c':     { pt: 'dizem',                      en: 'say' },
  'rev-btn':      { pt: '⭐ Ver todas as avaliações no Google', en: '⭐ See all reviews on Google' },

  // Footer
  'footer-desc':  { pt: 'Sua loja brasileira de confiança em Kirkland, Washington. Trazemos o sabor autêntico do Brasil para a sua mesa!',
                    en: 'Your trusted Brazilian store in Kirkland, Washington. We bring the authentic taste of Brazil to your table!' },
  'footer-cat-h4':{ pt: 'Categorias',                 en: 'Categories' },
  'footer-hours-h4':{ pt: 'Horário de Funcionamento', en: 'Store Hours' },
  'footer-contact-h4':{ pt: 'Contato & Localização',  en: 'Contact & Location' },
  'footer-track': { pt: '📦 Rastrear Pedido',         en: '📦 Track Order' },
  'footer-delivery-note': { pt: 'Delivery disponível para todo o estado de Washington (WA)',
                             en: 'Delivery available across Washington State (WA)' },
  'footer-copy':  { pt: '© 2025 Bella Brasil Market Plus. Todos os direitos reservados.',
                    en: '© 2025 Bella Brasil Market Plus. All rights reserved.' },

  // Buttons generic
  'btn-shop-now': { pt: '🛍️ Explorar Produtos',      en: '🛍️ Shop Products' },
};

// ── Core functions ──────────────────────────────────────────────

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || 'pt';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  updateToggleBtn(lang);
}

function applyLang(lang) {
  // 1) data-i18n → textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = translations[key]?.[lang];
    if (val !== undefined) el.textContent = val;
  });

  // 2) data-i18n-html → innerHTML (allows <span> inside)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const val = translations[key]?.[lang];
    if (val !== undefined) el.innerHTML = val;
  });

  // 3) data-i18n-placeholder → placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = translations[key]?.[lang];
    if (val !== undefined) el.placeholder = val;
  });

  // 4) Hero h1 special (has HTML structure)
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    heroH1.innerHTML = lang === 'en'
      ? 'The taste of<br><span>Brazil</span> 🇺🇸<br>at your door!'
      : 'O sabor do<br><span>Brasil</span> 🇧🇷<br>na sua porta!';
  }

  // 5) Account link (preserves dynamic first name)
  const user = (() => { try { return JSON.parse(localStorage.getItem('bellabrasil_user')); } catch { return null; } })();
  document.querySelectorAll('#nav-account-link').forEach(l => {
    l.textContent = user
      ? `👤 ${user.firstName || (lang === 'en' ? 'Account' : 'Conta')}`
      : (lang === 'en' ? '👤 My Account' : '👤 Minha Conta');
  });

  // 6) html lang attribute
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
}

// Botão mostra o idioma ATUAL (clique para trocar)
// ex: quando em PT → mostra "🇧🇷 PT" → clicar muda para EN
function updateToggleBtn(lang) {
  const btn = document.getElementById('lang-toggle-btn');
  if (!btn) return;
  if (lang === 'pt') {
    btn.innerHTML = '🇧🇷 PT <span style="opacity:.5;margin:0 2px">|</span> EN';
    btn.title = 'Switch to English';
  } else {
    btn.innerHTML = 'PT <span style="opacity:.5;margin:0 2px">|</span> 🇺🇸 EN';
    btn.title = 'Mudar para Português';
  }
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
  btn.style.cssText = `background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);
    color:#fff;padding:.35rem .85rem;border-radius:8px;font-size:.8rem;font-weight:700;
    cursor:pointer;transition:background .2s;flex-shrink:0;letter-spacing:.03em;
    display:flex;align-items:center;gap:.15rem;`;
  btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,.24)');
  btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,.12)');

  const cartBtn = navbar.querySelector('.cart-btn');
  if (cartBtn) navbar.insertBefore(btn, cartBtn);
  else navbar.appendChild(btn);

  // Reseta para PT se não houver preferência salva
  if (!localStorage.getItem(LANG_KEY)) {
    localStorage.setItem(LANG_KEY, 'pt');
  }

  const lang = getCurrentLang();
  applyLang(lang);
  updateToggleBtn(lang);
}
