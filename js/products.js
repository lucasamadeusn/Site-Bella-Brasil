// ============================================================
//  BELLA BRASIL MARKET PLUS — Product Catalog
// ============================================================

const PRODUCTS = [
  // ── CARNES ──────────────────────────────────────────────
  {
    id: 1,
    name: "Picanha Brasileira",
    category: "carnes",
    desc: "Corte premium, ideal para churrasco. Aprox. 1.5 kg.",
    price: 34.99,
    oldPrice: 39.99,
    emoji: "🥩",
    badge: "Mais Vendido",
    badgeType: "hot",
    unit: "por kg",
    inStock: true
  },
  {
    id: 2,
    name: "Fraldinha",
    category: "carnes",
    desc: "Corte macio e suculento. Perfeito para grelha.",
    price: 18.99,
    emoji: "🥩",
    inStock: true
  },
  {
    id: 3,
    name: "Costela Bovina",
    category: "carnes",
    desc: "Costela para churrasco ou cozida. Aprox. 2 kg.",
    price: 22.99,
    emoji: "🥩",
    badge: "Promoção",
    badgeType: "sale",
    oldPrice: 26.99,
    inStock: true
  },
  {
    id: 4,
    name: "Linguiça Toscana",
    category: "carnes",
    desc: "Linguiça artesanal temperada. Pacote 500g.",
    price: 9.99,
    emoji: "🌭",
    inStock: true
  },
  {
    id: 5,
    name: "Linguiça Calabresa",
    category: "carnes",
    desc: "Linguiça apimentada, 500g. Ótima para feijoada.",
    price: 8.99,
    emoji: "🌭",
    inStock: true
  },
  {
    id: 6,
    name: "Alcatra",
    category: "carnes",
    desc: "Corte versátil, macio e saboroso. Por kg.",
    price: 19.99,
    emoji: "🥩",
    inStock: true
  },

  // ── FRIOS & LATICÍNIOS ──────────────────────────────────
  {
    id: 7,
    name: "Pão de Queijo Congelado",
    category: "frios",
    desc: "Pão de queijo mineiro congelado. 1 kg (aprox. 30 unidades).",
    price: 12.99,
    emoji: "🧀",
    badge: "Mais Vendido",
    badgeType: "hot",
    inStock: true
  },
  {
    id: 8,
    name: "Queijo Minas Frescal",
    category: "frios",
    desc: "Queijo fresco artesanal. 400g.",
    price: 7.99,
    emoji: "🧀",
    inStock: true
  },
  {
    id: 9,
    name: "Requeijão Catupiry",
    category: "frios",
    desc: "O requeijão cremoso original do Brasil. 250g.",
    price: 5.49,
    emoji: "🧀",
    badge: "Novo",
    badgeType: "new",
    inStock: true
  },
  {
    id: 10,
    name: "Mortadela Seara",
    category: "frios",
    desc: "Mortadela fatiada. Embalagem 200g.",
    price: 4.99,
    emoji: "🥪",
    inStock: true
  },
  {
    id: 11,
    name: "Presunto Cozido",
    category: "frios",
    desc: "Presunto fatiado, 200g. Ótimo para sanduíches.",
    price: 5.49,
    emoji: "🥩",
    inStock: true
  },
  {
    id: 12,
    name: "Coxinha Congelada",
    category: "frios",
    desc: "Coxinha de frango congelada, pacote com 12 unidades.",
    price: 13.99,
    emoji: "🍗",
    badge: "Promoção",
    badgeType: "sale",
    oldPrice: 15.99,
    inStock: true
  },

  // ── BEBIDAS ─────────────────────────────────────────────
  {
    id: 13,
    name: "Guaraná Antárctica",
    category: "bebidas",
    desc: "O refrigerante mais brasileiro! Lata 350ml. Pack com 6.",
    price: 8.99,
    emoji: "🥤",
    badge: "Mais Vendido",
    badgeType: "hot",
    inStock: true
  },
  {
    id: 14,
    name: "Guaraná Kuat",
    category: "bebidas",
    desc: "Refrigerante de guaraná lata 350ml. Pack 6 unidades.",
    price: 8.49,
    emoji: "🥤",
    inStock: true
  },
  {
    id: 15,
    name: "Açaí Congelado 1kg",
    category: "bebidas",
    desc: "Polpa de açaí pura da Amazônia. 1kg.",
    price: 14.99,
    oldPrice: 17.99,
    emoji: "🫐",
    badge: "Promoção",
    badgeType: "sale",
    inStock: true
  },
  {
    id: 16,
    name: "Suco Del Valle Uva",
    category: "bebidas",
    desc: "Suco de uva integral Del Valle. 1 litro.",
    price: 4.99,
    emoji: "🍇",
    inStock: true
  },
  {
    id: 17,
    name: "Água de Coco Kero Coco",
    category: "bebidas",
    desc: "Água de coco natural 1 litro. Refrescante!",
    price: 3.99,
    emoji: "🥥",
    badge: "Novo",
    badgeType: "new",
    inStock: true
  },
  {
    id: 18,
    name: "Cachaça 51",
    category: "bebidas",
    desc: "A cachaça mais famosa do Brasil. Garrafa 700ml.",
    price: 16.99,
    emoji: "🍶",
    inStock: true
  },

  // ── SALGADINHOS & SNACKS ────────────────────────────────
  {
    id: 19,
    name: "Ruffles Churrasco",
    category: "snacks",
    desc: "Batata frita ondulada sabor churrasco. 137g.",
    price: 3.49,
    emoji: "🥔",
    badge: "Mais Vendido",
    badgeType: "hot",
    inStock: true
  },
  {
    id: 20,
    name: "Fandangos",
    category: "snacks",
    desc: "Salgadinho de milho sabor queijo. 230g.",
    price: 3.99,
    emoji: "🌽",
    inStock: true
  },
  {
    id: 21,
    name: "Biscoito Globo",
    category: "snacks",
    desc: "O biscoito de vento carioca original. 100g.",
    price: 2.99,
    emoji: "🍪",
    inStock: true
  },
  {
    id: 22,
    name: "Doritos Churrasco",
    category: "snacks",
    desc: "Nachos sabor churrasco brasileiro. 96g.",
    price: 2.99,
    emoji: "🌮",
    inStock: true
  },
  {
    id: 23,
    name: "Cheetos Requeijão",
    category: "snacks",
    desc: "Palito de queijo sabor requeijão. 110g.",
    price: 2.49,
    emoji: "🧀",
    inStock: true
  },

  // ── DOCES & SOBREMESAS ──────────────────────────────────
  {
    id: 24,
    name: "Brigadeiro Artesanal (6un)",
    category: "doces",
    desc: "Brigadeiro de chocolate feito artesanalmente. Caixa com 6.",
    price: 9.99,
    emoji: "🍫",
    badge: "Novo",
    badgeType: "new",
    inStock: true
  },
  {
    id: 25,
    name: "Paçoca Santa Helena",
    category: "doces",
    desc: "Paçoca de amendoim original. Caixa 200g.",
    price: 4.49,
    emoji: "🥜",
    inStock: true
  },
  {
    id: 26,
    name: "Bis ao Leite Lacta",
    category: "doces",
    desc: "Biscoito coberto de chocolate ao leite. Caixa 100g.",
    price: 3.99,
    emoji: "🍫",
    inStock: true
  },
  {
    id: 27,
    name: "Bombom Sonho de Valsa",
    category: "doces",
    desc: "Bombom com castanha de caju. 200g.",
    price: 7.99,
    emoji: "🍬",
    inStock: true
  },
  {
    id: 28,
    name: "Pudim de Leite Moça",
    category: "doces",
    desc: "Pudim cremoso de leite condensado pronto. 340g.",
    price: 5.99,
    emoji: "🍮",
    badge: "Mais Vendido",
    badgeType: "hot",
    inStock: true
  },

  // ── MERCEARIA ───────────────────────────────────────────
  {
    id: 29,
    name: "Arroz Tio João 5 lbs",
    category: "mercearia",
    desc: "Arroz branco tipo 1 beneficiado. 5 libras.",
    price: 6.99,
    emoji: "🍚",
    inStock: true
  },
  {
    id: 30,
    name: "Feijão Preto Camil",
    category: "mercearia",
    desc: "Feijão preto tipo 1. 2 lbs.",
    price: 4.49,
    emoji: "🫘",
    inStock: true
  },
  {
    id: 31,
    name: "Farinha de Mandioca",
    category: "mercearia",
    desc: "Farinha de mandioca torrada grossa. 1 kg.",
    price: 5.99,
    emoji: "🌾",
    inStock: true
  },
  {
    id: 32,
    name: "Café Pilão 500g",
    category: "mercearia",
    desc: "Café torrado e moído extra forte. 500g.",
    price: 8.99,
    emoji: "☕",
    badge: "Mais Vendido",
    badgeType: "hot",
    inStock: true
  },
  {
    id: 33,
    name: "Achocolatado Nescau",
    category: "mercearia",
    desc: "Achocolatado em pó Nescau. 400g.",
    price: 5.49,
    emoji: "🍫",
    inStock: true
  },
  {
    id: 34,
    name: "Maizena",
    category: "mercearia",
    desc: "Amido de milho Maizena. 400g.",
    price: 3.49,
    emoji: "🌽",
    inStock: true
  },

  // ── TEMPEROS ────────────────────────────────────────────
  {
    id: 35,
    name: "Tempero Completo Kitano",
    category: "temperos",
    desc: "Tempero completo com ervas e especiarias. 300g.",
    price: 4.99,
    emoji: "🧂",
    inStock: true
  },
  {
    id: 36,
    name: "Colorau Urucum",
    category: "temperos",
    desc: "Colorífico/colorau para temperar carnes. 100g.",
    price: 2.49,
    emoji: "🌶️",
    inStock: true
  },
  {
    id: 37,
    name: "Pimenta Malagueta",
    category: "temperos",
    desc: "Pimenta malagueta em conserva. 100ml.",
    price: 3.99,
    emoji: "🌶️",
    badge: "Novo",
    badgeType: "new",
    inStock: true
  },
  {
    id: 38,
    name: "Caldo Knorr Costela",
    category: "temperos",
    desc: "Caldo de costela Knorr. Caixa com 6 tabletes.",
    price: 2.99,
    emoji: "🧄",
    inStock: true
  },

  // ── LIMPEZA & HIGIENE ───────────────────────────────────
  {
    id: 39,
    name: "Creme Dental Colgate Tripla",
    category: "higiene",
    desc: "Pasta de dentes Colgate Tripla Ação. 90ml.",
    price: 3.49,
    emoji: "🪥",
    inStock: true
  },
  {
    id: 40,
    name: "Desodorante Rexona",
    category: "higiene",
    desc: "Desodorante aerossol Rexona men/women. 150ml.",
    price: 6.49,
    emoji: "🧴",
    inStock: true
  }
];

const CATEGORIES = [
  { id: "todos",     name: "Todos",              emoji: "🛒", count: PRODUCTS.length },
  { id: "carnes",    name: "Carnes",              emoji: "🥩", count: PRODUCTS.filter(p => p.category === "carnes").length },
  { id: "frios",     name: "Frios & Laticínios",  emoji: "🧀", count: PRODUCTS.filter(p => p.category === "frios").length },
  { id: "bebidas",   name: "Bebidas",             emoji: "🥤", count: PRODUCTS.filter(p => p.category === "bebidas").length },
  { id: "snacks",    name: "Salgadinhos",         emoji: "🥔", count: PRODUCTS.filter(p => p.category === "snacks").length },
  { id: "doces",     name: "Doces & Sobremesas",  emoji: "🍫", count: PRODUCTS.filter(p => p.category === "doces").length },
  { id: "mercearia", name: "Mercearia",           emoji: "🛍️", count: PRODUCTS.filter(p => p.category === "mercearia").length },
  { id: "temperos",  name: "Temperos",            emoji: "🧂", count: PRODUCTS.filter(p => p.category === "temperos").length },
  { id: "higiene",   name: "Higiene & Limpeza",   emoji: "🪥", count: PRODUCTS.filter(p => p.category === "higiene").length }
];

// Build product card HTML
function buildProductCard(product) {
  const badgeHTML = product.badge
    ? `<div class="product-badge ${product.badgeType || ''}">${product.badge}</div>` : '';
  const oldPriceHTML = product.oldPrice
    ? `<span class="product-price-old">$${product.oldPrice.toFixed(2)}</span>` : '';
  const unitHTML = product.unit ? ` <small>${product.unit}</small>` : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-img">
        <span>${product.emoji}</span>
        ${badgeHTML}
      </div>
      <div class="product-info">
        <div class="product-cat">${getCategoryName(product.category)}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-price-row">
          <div>
            ${oldPriceHTML}
            <div class="product-price">$${product.price.toFixed(2)}${unitHTML}</div>
          </div>
          <button class="add-btn" onclick="Cart.add(${product.id})" title="Adicionar ao carrinho">+</button>
        </div>
      </div>
    </div>`;
}

function getCategoryName(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat.name : catId;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function getProductsByCategory(catId) {
  if (catId === 'todos') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === catId);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}
