// ================================================================
//  square-integration.js — Integração frontend com o backend Square
// ================================================================

const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3333'
  : 'https://SEU-APP.up.railway.app';

// ================================================================
//  1. CARREGAR PRODUTOS DO SQUARE
// ================================================================

async function loadSquareProducts(gridElementId) {
  const grid = document.getElementById(gridElementId);
  if (!grid) return;

  grid.innerHTML = `
    <div class="square-loading" style="grid-column:1/-1;text-align:center;padding:3rem">
      <div class="spinner" style="margin:0 auto 1rem"></div>
      <span>Buscando produtos...</span>
    </div>`;

  try {
    const response = await fetch(`${BACKEND_URL}/products`);
    const data     = await response.json();

    if (!data.success || !data.products.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)">
          Nenhum produto encontrado no catálogo.
        </div>`;
      return;
    }

    grid.innerHTML = data.products.map(buildSquareProductCard).join('');
  } catch (err) {
    console.warn('Backend indisponível, usando produtos locais.', err.message);
    if (typeof PRODUCTS !== 'undefined' && typeof buildProductCard !== 'undefined') {
      grid.innerHTML = PRODUCTS.slice(0, 8).map(buildProductCard).join('');
    }
  }
}

// ================================================================
//  2. FAVORITOS
// ================================================================

const _FAV_KEY = 'bellabrasil_favorites';
function _getFavIds()  { try { return JSON.parse(localStorage.getItem(_FAV_KEY)) || []; } catch { return []; } }

function sqToggleFavorite(productId, btn) {
  let favs = _getFavIds();
  const idx = favs.indexOf(productId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.textContent = '🤍';
    btn.title = 'Salvar nos favoritos';
    btn.classList.remove('fav-active');
  } else {
    favs.push(productId);
    btn.textContent = '❤️';
    btn.title = 'Remover dos favoritos';
    btn.classList.add('fav-active');
    // Mini pulse animation
    btn.style.transform = 'scale(1.35)';
    setTimeout(() => btn.style.transform = '', 250);
  }
  localStorage.setItem(_FAV_KEY, JSON.stringify(favs));
}

// ================================================================
//  3. CARD DE PRODUTO SQUARE
// ================================================================

// Mapa global id → produto (evita JSON em atributos onclick)
window._sqProductMap = window._sqProductMap || {};
// Mapa de variação selecionada por produto: productId → { id, name, price, priceRaw }
window._sqSelectedVariation = window._sqSelectedVariation || {};

/** Atualiza variação selecionada e o preço exibido no card */
function sqSelectVariation(productId, variationId) {
  const product = window._sqProductMap[productId];
  if (!product) return;
  const variation = (product.variations || []).find(v => v.id === variationId);
  if (!variation) return;
  window._sqSelectedVariation[productId] = variation;
  // Atualiza preço no card
  const priceEl = document.querySelector(`[data-id="${productId}"] .product-price`);
  if (priceEl) {
    priceEl.textContent = variation.price !== null ? `$${variation.price.toFixed(2)}` : 'Sob consulta';
  }
}

/** Chamado pelo onclick do botão "+" — busca produto no mapa e adiciona ao carrinho */
function sqAddToCart(productId) {
  const product = window._sqProductMap[productId];
  if (!product) { console.warn('Produto não encontrado no cache:', productId); return; }

  // Produto com múltiplas variações → usa a variação selecionada
  if (product.variations && product.variations.length > 1) {
    const selected = window._sqSelectedVariation[productId] || product.variations[0];
    const variantProduct = {
      ...product,
      id:          selected.id,
      variationId: selected.id,
      name:        `${product.name} — ${selected.name}`,
      price:       selected.price,
      priceRaw:    selected.priceRaw,
      variations:  [],  // evita recursão
    };
    window._sqProductMap[selected.id] = variantProduct;
    Cart.addSquare(variantProduct);
  } else {
    Cart.addSquare(product);
  }
}

function buildSquareProductCard(product) {
  // Registra produto no mapa antes de gerar o HTML
  window._sqProductMap[product.id] = product;

  const imgHtml = product.image
    ? `<img src="${product.image}" alt="${product.name}"
            style="width:100%;height:100%;object-fit:cover" loading="lazy"/>`
    : `<span style="font-size:3.5rem">🛍️</span>`;

  // Favorito
  const isFav   = _getFavIds().includes(product.id);
  const favHtml = `
    <button class="fav-btn${isFav ? ' fav-active' : ''}"
            onclick="sqToggleFavorite('${product.id}', this)"
            title="${isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}"
            style="position:absolute;top:.6rem;right:.6rem;background:rgba(255,255,255,.88);
                   border:none;border-radius:50%;width:34px;height:34px;font-size:1.1rem;
                   cursor:pointer;display:flex;align-items:center;justify-content:center;
                   box-shadow:0 2px 8px rgba(0,0,0,.14);transition:transform .2s;z-index:2;">
      ${isFav ? '❤️' : '🤍'}
    </button>`;

  // Variações: se há mais de 1, usa a primeira como preço inicial e mostra selector
  const hasVariations = product.variations && product.variations.length > 1;
  const firstVariation = hasVariations ? product.variations[0] : null;
  const displayPrice = hasVariations && firstVariation
    ? firstVariation.price
    : product.price;

  const priceHtml = displayPrice !== null
    ? `$${displayPrice.toFixed(2)}`
    : 'Sob consulta';

  const variationsHtml = hasVariations ? `
    <select class="variation-select"
            onchange="sqSelectVariation('${product.id}', this.value)"
            style="width:100%;margin:.45rem 0 .15rem;padding:.35rem .55rem;
                   border:1.5px solid var(--gray-200);border-radius:8px;
                   font-size:.82rem;color:var(--gray-800);background:#fff;cursor:pointer">
      ${product.variations.map(v => `
        <option value="${v.id}">
          ${v.name}${v.price !== null ? ' — $' + v.price.toFixed(2) : ''}
        </option>`).join('')}
    </select>` : '';

  return `
    <div class="product-card" data-id="${product.id}" style="position:relative;">
      ${favHtml}
      <div class="product-img">${imgHtml}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.description || ''}</div>
        ${variationsHtml}
        <div class="product-price-row">
          <div class="product-price">${priceHtml}</div>
          ${product.inStock
            ? `<button class="add-btn"
                 onclick="sqAddToCart('${product.id}')"
                 title="Adicionar ao carrinho">+</button>`
            : `<button class="add-btn" disabled style="opacity:.4;cursor:not-allowed">✕</button>`}
        </div>
      </div>
    </div>`;
}

// ================================================================
//  4. CATEGORIAS DINÂMICAS (baseadas nos produtos do Square)
// ================================================================

function updateCategoryBar(products) {
  // Encontra o container de pills
  const firstPill = document.querySelector('[data-cat]');
  if (!firstPill) return;
  const container = firstPill.parentElement;
  if (!container) return;

  // Extrai categorias únicas dos produtos Square
  // (quando o dono adicionar categorias no Square, aparecem aqui automaticamente)
  const squareCats = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Estilo padrão de pill
  const pillBase = `padding:.5rem 1rem;white-space:nowrap;border-radius:20px;
    font-weight:600;font-size:.85rem;cursor:pointer;`;
  const pillActive   = `${pillBase}border:2px solid var(--green);background:var(--green);color:#fff;`;
  const pillInactive = `${pillBase}border:2px solid var(--gray-200);background:#fff;color:var(--gray-800);`;

  if (squareCats.length === 0) {
    // Nenhuma categoria no Square → mostra só "Todos" + info
    container.innerHTML = `
      <button class="category-card" data-cat="todos" style="${pillActive}">
        🛒 Todos os Produtos
      </button>
      <span style="font-size:.78rem;color:var(--gray-400);align-self:center;margin-left:.5rem">
        ${products.length} item${products.length !== 1 ? 's' : ''} disponíve${products.length !== 1 ? 'is' : 'l'}
      </span>`;
  } else {
    // Monta pills com as categorias do Square
    const allBtn = `<button class="category-card" data-cat="todos" style="${pillActive}">🛒 Todos</button>`;
    const catBtns = squareCats.map(cat =>
      `<button class="category-card" data-cat="${cat}" style="${pillInactive}">${cat}</button>`
    ).join('');
    container.innerHTML = allBtn + catBtns;
  }

  // Re-aplica listeners de click para as novas pills
  container.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-cat]').forEach(b => {
        b.style.cssText = pillInactive;
      });
      btn.style.cssText = pillActive;
      // Filtra produtos
      const cat = btn.dataset.cat;
      if (window._squareProductsData) {
        const filtered = cat === 'todos'
          ? window._squareProductsData
          : window._squareProductsData.filter(p => p.category === cat);
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = filtered.map(buildSquareProductCard).join('');
        const countEl = document.getElementById('results-count');
        if (countEl) countEl.textContent =
          `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
      }
    });
  });
}

// ================================================================
//  5. AUTO-INIT
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';

  // Garante que Cart.addSquare exista
  if (typeof Cart !== 'undefined' && !Cart.addSquare) {
    Cart.addSquare = (product) => {
      _saveSquareProductToCache(product);
      Cart.add(product.id);
    };
  }

  // Na shop.html → grade principal
  if (page === 'shop.html') {
    checkBackendAndLoad('product-grid');
  }

  // Na index.html → destaques e promoções
  if (page === 'index.html' || page === '') {
    checkBackendAndLoad('featured-products', 'promo-products');
  }
});

async function checkBackendAndLoad(...gridIds) {
  try {
    const r = await fetch(`${BACKEND_URL}/`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) throw new Error('backend offline');

    const resp = await fetch(`${BACKEND_URL}/products`);
    const data = await resp.json();

    if (!data.success || !data.products.length) {
      console.warn('⚠️ Nenhum produto no Square — usando catálogo local.');
      return;
    }

    console.log(`✅ ${data.products.length} produtos Square: ${data.products.map(p => p.name).join(', ')}`);

    // Salva globalmente para filtros
    window._squareProductsData = data.products;

    // Renderiza nos grids
    for (const gridId of gridIds) {
      const grid = document.getElementById(gridId);
      if (!grid) continue;
      grid.innerHTML = data.products.map(buildSquareProductCard).join('');
    }

    // Atualiza categorias (só na shop.html)
    const page = location.pathname.split('/').pop();
    if (page === 'shop.html') {
      updateCategoryBar(data.products);

      // Lê o parâmetro ?cat= da URL e filtra automaticamente
      const urlCat = new URLSearchParams(location.search).get('cat');
      let displayProducts = data.products;
      if (urlCat && urlCat !== 'todos') {
        const filtered = data.products.filter(
          p => p.category && p.category.toLowerCase() === decodeURIComponent(urlCat).toLowerCase()
        );
        if (filtered.length > 0) {
          displayProducts = filtered;
          // Renderiza somente a categoria solicitada
          for (const gridId of gridIds) {
            const grid = document.getElementById(gridId);
            if (grid) grid.innerHTML = filtered.map(buildSquareProductCard).join('');
          }
          // Ativa o pill correto visualmente
          document.querySelectorAll('[data-cat]').forEach(b => {
            const match = b.dataset.cat.toLowerCase() === decodeURIComponent(urlCat).toLowerCase();
            b.style.background    = match ? 'var(--green)' : '#fff';
            b.style.color         = match ? '#fff' : 'var(--gray-800)';
            b.style.borderColor   = match ? 'var(--green)' : 'var(--gray-200)';
          });
        }
      }

      const countEl = document.getElementById('results-count');
      if (countEl) countEl.textContent =
        `${displayProducts.length} produto${displayProducts.length !== 1 ? 's' : ''} encontrado${displayProducts.length !== 1 ? 's' : ''}`;
    }

    // Re-render do shop se filtros já estiverem inicializados
    if (typeof window._shopRender === 'function') window._shopRender();

  } catch {
    console.log('ℹ️ Backend offline — usando catálogo local (products.js)');
  }
}

// ================================================================
//  6. CHECKOUT SQUARE (usado pelo squareCheckout() global)
// ================================================================

async function squareCheckout() {
  const btn = document.getElementById('square-checkout-btn');
  if (btn) {
    btn.disabled    = true;
    btn.textContent = '⏳ Processando...';
  }

  try {
    const allItems = Cart.getItems().map(i => ({
      name:     i.product.name,
      quantity: i.qty,
      priceRaw: i.product.priceRaw || Math.round(i.product.price * 100),
    }));

    if (allItems.length === 0) {
      showToast('⚠️ Seu carrinho está vazio!', 'error');
      if (btn) { btn.disabled = false; btn.textContent = '🔒 Pagar com Square'; }
      return;
    }

    const response = await fetch(`${BACKEND_URL}/create-checkout`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items: allItems }),
    });

    const data = await response.json();

    if (data.success && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error(data.error || 'Erro ao criar checkout');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    showToast('❌ Erro ao processar pagamento. Tente novamente.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = '🔒 Pagar com Square'; }
  }
}
