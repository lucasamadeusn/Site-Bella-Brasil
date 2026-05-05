// ============================================================
//  BELLA BRASIL MARKET PLUS — Main UI Controller
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHamburger();
  initSearch();
  initScrollHeader();
  highlightActiveNav();
  initLangToggle();
  initInstallPrompt();
  registerServiceWorker();
});

// ── Service Worker ──────────────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

// ── PWA install prompt ──────────────────────────────────────
let _deferredInstall = null;
function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstall = e;
    // Show a subtle install banner after 30s on the home page
    const page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'index.html' || page === '') {
      setTimeout(showInstallBanner, 30000);
    }
  });
}
function showInstallBanner() {
  if (!_deferredInstall || document.getElementById('pwa-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  banner.style.cssText = `position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);
    z-index:9999;background:var(--navy);color:#fff;padding:.8rem 1.2rem;
    border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.25);display:flex;
    align-items:center;gap:.8rem;font-size:.88rem;max-width:360px;width:90%;`;
  banner.innerHTML = `
    <span style="font-size:1.4rem">📱</span>
    <span style="flex:1">Instale o app da <strong>Bella Brasil</strong> no seu celular!</span>
    <button onclick="installApp()" style="background:var(--green);border:none;color:#fff;
      padding:.4rem .9rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:.82rem;">
      Instalar
    </button>
    <button onclick="document.getElementById('pwa-banner').remove()"
      style="background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:1.1rem;padding:0">×</button>`;
  document.body.appendChild(banner);
}
function installApp() {
  if (!_deferredInstall) return;
  _deferredInstall.prompt();
  _deferredInstall.userChoice.then(() => {
    _deferredInstall = null;
    document.getElementById('pwa-banner')?.remove();
  });
}

// ── Hamburger menu ──────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    btn.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
  });
}

// ── Search (redirects to shop page with query) ─────────────
function initSearch() {
  const form = document.getElementById('search-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
  });

  // Also handle Enter in all search inputs
  document.querySelectorAll('.search-bar input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
      }
    });
  });
}

// ── Shrink header on scroll ─────────────────────────────────
function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 50
      ? '0 4px 20px rgba(0,0,0,.2)'
      : '';
  }, { passive: true });
}

// ── Highlight active nav link ───────────────────────────────
function highlightActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === 'index.html' && href === './'))) {
      a.style.color = 'var(--yellow)';
      a.style.fontWeight = '700';
    }
  });
}

// ── Shop Page: render products & filters ────────────────────
function initShopPage() {
  const grid        = document.getElementById('product-grid');
  const catButtons  = document.querySelectorAll('[data-cat]');
  const sortSelect  = document.getElementById('sort-select');
  const resultsEl   = document.getElementById('results-count');
  const searchInput = document.getElementById('shop-search');

  if (!grid) return;

  let currentCat   = 'todos';
  let currentSort  = 'default';
  let currentQuery = '';

  // Read URL params
  const params = new URLSearchParams(location.search);
  if (params.get('q')) {
    currentQuery = params.get('q');
    if (searchInput) searchInput.value = currentQuery;
  }
  if (params.get('cat')) {
    currentCat = params.get('cat');
  }

  // Activate cat button
  setActiveCategory(currentCat);

  // Expose render so square-integration.js can re-trigger it after loading
  window._shopRender = render;

  function getFiltered() {
    // If Square products are loaded, use them; otherwise fall back to static
    if (window._squareProductsData && window._squareProductsData.length) {
      let list = window._squareProductsData;
      if (currentQuery) {
        const q = currentQuery.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      if (currentSort === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
      if (currentSort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
      if (currentSort === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name));
      return list;
    }
    // Static products (fallback)
    let list = currentQuery ? searchProducts(currentQuery) : getProductsByCategory(currentCat);
    if (currentSort === 'price-asc')   list = [...list].sort((a,b) => a.price - b.price);
    if (currentSort === 'price-desc')  list = [...list].sort((a,b) => b.price - a.price);
    if (currentSort === 'name')        list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    if (currentSort === 'sale')        list = list.filter(p => p.oldPrice);
    return list;
  }

  function render() {
    const list    = getFiltered();
    const isSquare = !!(window._squareProductsData && window._squareProductsData.length);
    if (resultsEl) resultsEl.textContent = `${list.length} produto${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)">
          <div style="font-size:3rem;margin-bottom:.8rem">🔍</div>
          <h3 style="color:var(--gray-600)">Nenhum produto encontrado</h3>
          <p>Tente outro termo ou categoria.</p>
        </div>`;
      return;
    }
    // Use the correct card builder based on product source
    if (isSquare && typeof buildSquareProductCard === 'function') {
      grid.innerHTML = list.map(buildSquareProductCard).join('');
    } else {
      grid.innerHTML = list.map(buildProductCard).join('');
    }
  }

  function setActiveCategory(catId) {
    catButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === catId);
    });
  }

  // Category click
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCat   = btn.dataset.cat;
      currentQuery = '';
      if (searchInput) searchInput.value = '';
      setActiveCategory(currentCat);
      render();
    });
  });

  // Sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      render();
    });
  }

  // Shop search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentQuery = searchInput.value.trim();
      render();
    });
  }

  render();
}

// ── Home Page: render featured products ─────────────────────
function initHomePage() {
  const featuredGrid  = document.getElementById('featured-products');
  const promoGrid     = document.getElementById('promo-products');

  if (featuredGrid) {
    const featured = PRODUCTS.filter(p => p.badge === 'Mais Vendido').slice(0, 8);
    featuredGrid.innerHTML = featured.map(buildProductCard).join('');
  }

  if (promoGrid) {
    const promo = PRODUCTS.filter(p => p.oldPrice).slice(0, 4);
    promoGrid.innerHTML = promo.map(buildProductCard).join('');
  }
}

// ── Contact form ────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Mensagem enviada! Entraremos em contato em breve.', 'success');
    form.reset();
  });
}

// ── Newsletter form ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const nlForms = document.querySelectorAll('.newsletter-form');
  nlForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('🎉 Obrigado! Você receberá nossas novidades em breve.', 'success');
      form.reset();
    });
  });
});

// ── Checkout form ────────────────────────────────────────────
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Delivery option selection
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input[type=radio]').checked = true;

      const fee = parseFloat(opt.dataset.fee || 0);
      // Update summary delivery fee display
      const delEl = document.getElementById('summary-delivery');
      if (delEl) delEl.textContent = fee === 0 ? 'GRÁTIS 🎉' : `$${fee.toFixed(2)}`;
      const totEl = document.getElementById('summary-total');
      if (totEl) {
        const sub = Cart.subtotal();
        totEl.textContent = `$${(sub + fee).toFixed(2)}`;
      }
    });
  });

  // Payment option selection
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (Cart.count() === 0) {
      showToast('⚠️ Seu carrinho está vazio!', 'error');
      return;
    }
    // Simulate order
    const items = Cart.getItems();
    const total = Cart.total();
    Cart.clear();
    showOrderSuccess(total, items.length);
  });
}

function showOrderSuccess(total, itemCount) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
                background:var(--green-light);font-family:'Segoe UI',sans-serif;">
      <div style="background:#fff;border-radius:18px;padding:3rem 2.5rem;text-align:center;
                  box-shadow:0 8px 32px rgba(0,0,0,.12);max-width:480px;width:90%;">
        <div style="font-size:5rem;margin-bottom:1rem">🎉</div>
        <h2 style="color:var(--green-dark,#065A2C);margin-bottom:.5rem">Pedido Confirmado!</h2>
        <p style="color:#4B5563;margin-bottom:1.5rem">
          Obrigado por comprar na <strong>Bella Brasil Market Plus</strong>!<br>
          Seu pedido de <strong>${itemCount} item(s)</strong> no valor de
          <strong>$${total.toFixed(2)}</strong> foi recebido.
        </p>
        <p style="font-size:.85rem;color:#9CA3AF;margin-bottom:2rem">
          Você receberá uma confirmação por e-mail em breve.<br>
          Preparamos seu pedido com muito carinho! 🇧🇷
        </p>
        <a href="index.html" style="background:#0A7B3E;color:#fff;padding:.9rem 2rem;
           border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">
          Continuar Comprando
        </a>
      </div>
    </div>`;
}

// ── Auto-init based on page ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop();
  if (!page || page === 'index.html') initHomePage();
  if (page === 'shop.html')           initShopPage();
  if (page === 'contact.html')        initContactForm();
  if (page === 'checkout.html')       initCheckoutForm();
  if (page === 'cart.html') {
    Cart.renderCartPage();
    window.addEventListener('cartUpdated', () => Cart.renderCartPage());
  }
  if (page === 'checkout.html') {
    Cart.renderCheckoutSummary();
    initCheckoutForm();
  }
});
