// ============================================================
//  BELLA BRASIL MARKET PLUS — Cart Logic (localStorage)
//  Suporta produtos estáticos (products.js) E produtos do Square
// ============================================================

// ── Square product cache (fora do IIFE para ser acessível) ───────
const SQ_CACHE_KEY = 'bellabrasil_sq_products';

function _saveSquareProductToCache(product) {
  try {
    const cache = JSON.parse(localStorage.getItem(SQ_CACHE_KEY) || '{}');
    cache[product.id] = product;
    localStorage.setItem(SQ_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function _getSquareProductFromCache(id) {
  try {
    const cache = JSON.parse(localStorage.getItem(SQ_CACHE_KEY) || '{}');
    return cache[id] || null;
  } catch { return null; }
}

// Retorna produto apenas do Square (mapa em memória ou cache localStorage)
// Produtos estáticos (products.js) foram removidos — usamos somente o Square.
function _resolveProduct(id) {
  // 1. Mapa em memória do square-integration.js (mais rápido, sem parse JSON)
  if (window._sqProductMap && window._sqProductMap[id]) {
    return window._sqProductMap[id];
  }
  // 2. Cache em localStorage (persiste entre páginas)
  return _getSquareProductFromCache(id);
}

const Cart = (() => {
  const STORAGE_KEY     = 'bellabrasil_cart';
  const FREE_DELIVERY_MIN = 60;

  let items = [];

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      items = stored ? JSON.parse(stored) : [];
    } catch {
      items = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
    dispatchEvent();
  }

  function dispatchEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { items, count: count(), subtotal: subtotal() }
    }));
  }

  // ── Public API ─────────────────────────────────────────

  /** Adiciona produto estático (por ID numérico) */
  function add(productId, qty = 1) {
    const product = _resolveProduct(productId);
    if (!product) return;

    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    save();
    showToast(`✅ ${product.name} adicionado ao carrinho!`, 'success');
    animateCartBtn();
  }

  /** Adiciona produto Square (objeto completo com id, name, price, priceRaw, image) */
  function addSquare(product) {
    // Salva dados do produto no cache para lookup posterior
    _saveSquareProductToCache(product);

    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id: product.id, qty: 1 });
    }
    save();
    showToast(`✅ ${product.name} adicionado ao carrinho!`, 'success');
    animateCartBtn();
  }

  function remove(productId) {
    items = items.filter(i => i.id !== productId);
    save();
    showToast('🗑️ Produto removido.', 'info');
  }

  function updateQty(productId, qty) {
    if (qty <= 0) { remove(productId); return; }
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = qty; save(); }
  }

  function clear() {
    items = [];
    save();
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function subtotal() {
    return items.reduce((sum, i) => {
      const p = _resolveProduct(i.id);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
  }

  function deliveryFee() {
    return subtotal() >= FREE_DELIVERY_MIN ? 0 : 5.99;
  }

  function total() {
    return subtotal() + deliveryFee();
  }

  function getItems() {
    return items.map(i => {
      const product = _resolveProduct(i.id);
      if (!product) return null;
      return {
        ...i,
        product,
        lineTotal: product.price * i.qty,
        isSquare:  !!(product.variationId || product.priceRaw), // Square products têm essas props
      };
    }).filter(Boolean);
  }

  // ── UI Helpers ─────────────────────────────────────────
  function updateBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const c = count();
    badges.forEach(b => {
      b.textContent = c;
      b.style.display = c > 0 ? 'flex' : 'none';
    });
  }

  function animateCartBtn() {
    const btn = document.querySelector('.cart-btn');
    if (!btn) return;
    btn.style.transform = 'scale(1.15)';
    setTimeout(() => btn.style.transform = '', 200);
  }

  // ── Cart Page Rendering ─────────────────────────────────
  function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg  = document.getElementById('cart-empty');
    const summary   = document.getElementById('cart-summary');
    if (!container) return;

    const cartItems = getItems();

    if (cartItems.length === 0) {
      container.innerHTML = '';
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (summary)  summary.style.display  = 'none';
      return;
    }

    if (emptyMsg) emptyMsg.style.display  = 'none';
    if (summary)  summary.style.display   = 'block';

    container.innerHTML = cartItems.map(item => {
      // Imagem: Square usa .image (URL), estático usa .emoji
      const imgHtml = item.product.image
        ? `<img src="${item.product.image}"
               alt="${item.product.name}"
               style="width:100%;height:100%;object-fit:cover;border-radius:8px" />`
        : `<span style="font-size:2rem">${item.product.emoji || '🛍️'}</span>`;

      const catLabel = item.isSquare
        ? 'Produto da loja'
        : (typeof getCategoryName === 'function' ? getCategoryName(item.product.category) : '');

      return `
        <div class="cart-item" id="cart-item-${item.id}">
          <div class="cart-item-img">${imgHtml}</div>
          <div>
            <div class="cart-item-cat">${catLabel}</div>
            <div class="cart-item-name">${item.product.name}</div>
            <div class="cart-item-price">$${item.product.price.toFixed(2)} / unidade</div>
            <div class="qty-control">
              <button class="qty-btn"
                onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn"
                onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:var(--green-dark);font-size:1rem">
              $${item.lineTotal.toFixed(2)}
            </div>
            <button class="remove-btn"
              onclick="Cart.remove('${item.id}')" title="Remover">🗑️</button>
          </div>
        </div>`;
    }).join('');

    updateSummary();
  }

  function updateSummary() {
    const sub  = document.getElementById('summary-subtotal');
    const del  = document.getElementById('summary-delivery');
    const tot  = document.getElementById('summary-total');
    const prog = document.getElementById('free-delivery-progress');
    const progressMsg = document.getElementById('free-delivery-msg');

    const sub_ = subtotal();
    const del_ = deliveryFee();
    const tot_ = total();

    if (sub) sub.textContent = `$${sub_.toFixed(2)}`;
    if (del) del.textContent = del_ === 0 ? 'GRÁTIS 🎉' : `$${del_.toFixed(2)}`;
    if (tot) tot.textContent = `$${tot_.toFixed(2)}`;

    if (prog && progressMsg) {
      const remaining = Math.max(0, FREE_DELIVERY_MIN - sub_);
      const pct = Math.min(100, (sub_ / FREE_DELIVERY_MIN) * 100);
      prog.style.width = `${pct}%`;
      progressMsg.textContent = remaining > 0
        ? `Faltam $${remaining.toFixed(2)} para frete grátis!`
        : '🎉 Você ganhou frete grátis!';
    }
  }

  // ── Checkout Page Summary ───────────────────────────────
  function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    const cartItems = getItems();
    container.innerHTML = cartItems.map(item => {
      const imgHtml = item.product.image
        ? `<img src="${item.product.image}"
               style="width:28px;height:28px;object-fit:cover;border-radius:4px;flex-shrink:0" />`
        : `<span>${item.product.emoji || '🛍️'}</span>`;
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:.5rem 0;border-bottom:1px solid var(--gray-100);">
          <div style="display:flex;align-items:center;gap:.5rem">
            ${imgHtml}
            <span style="font-size:.85rem">${item.product.name} × ${item.qty}</span>
          </div>
          <span style="font-size:.85rem;font-weight:600">$${item.lineTotal.toFixed(2)}</span>
        </div>`;
    }).join('');
    updateSummary();
  }

  // ── Init ────────────────────────────────────────────────
  function init() {
    load();
    updateBadge();
    window.addEventListener('cartUpdated', () => {
      if (document.getElementById('cart-items-container')) renderCartPage();
      if (document.getElementById('checkout-items'))       renderCheckoutSummary();
    });
  }

  return {
    add, addSquare, remove, updateQty, clear,
    count, subtotal, deliveryFee, total, getItems,
    init, renderCartPage, renderCheckoutSummary, updateSummary
  };
})();

// ── Toast Notification ─────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
