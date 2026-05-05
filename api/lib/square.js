// ================================================================
//  square.js — Square SDK v44
//
//  Estrutura real do SDK v44:
//    response = await client.catalog.list(...)
//    response.data        → array de objetos (não .objects!)
//    item.itemData        → camelCase
//    priceMoney.amount    → BigInt (ex: 800n = $8.00)
// ================================================================

const { SquareClient, SquareEnvironment } = require('square');
const { randomUUID } = require('crypto');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

// ================================================================
//  PRODUTOS — busca do catálogo do Square
// ================================================================

async function getProducts() {
  try {
    console.log('\n📦 Buscando produtos da Square Catalog API...');

    // Busca ITEMs, IMAGEs e CATEGORies numa única chamada
    const response = await client.catalog.list({ types: 'ITEM,IMAGE,CATEGORY' });

    const allObjects = response.data || [];
    console.log(`   → Total de objetos retornados: ${allObjects.length}`);

    // Mapa imageId → url
    const imageMap = {};
    allObjects.forEach(obj => {
      if (obj.type === 'IMAGE' && obj.imageData?.url) {
        imageMap[obj.id] = obj.imageData.url;
      }
    });

    // Mapa categoryId → name
    const categoryMap = {};
    allObjects.forEach(obj => {
      if (obj.type === 'CATEGORY' && obj.categoryData?.name) {
        categoryMap[obj.id] = obj.categoryData.name;
      }
    });
    console.log(`   → ${Object.keys(imageMap).length} imagem(ns) | ${Object.keys(categoryMap).length} categoria(s)`);

    const products = allObjects
      .filter(obj => {
        const d = obj.itemData;
        if (obj.type !== 'ITEM' || !d) return false;
        if (d.isArchived === true) {
          console.log(`   ⚠️  Ignorando produto arquivado: ${d.name}`);
          return false;
        }
        return true;
      })
      .map(obj => mapItem(obj, imageMap, categoryMap))
      .filter(p => {
        if (p.price === null) {
          console.log(`   ⚠️  Produto sem preço ignorado: ${p.name}`);
          return false;
        }
        if (!p.inStock) {
          console.log(`   ⚠️  Produto não vendável ignorado: ${p.name}`);
          return false;
        }
        return true;
      });

    console.log(`   ✅ ${products.length} produto(s) prontos para exibição:`);
    products.forEach(p => console.log(`      - ${p.name}  $${p.price.toFixed(2)}  img:${p.image ? '✓' : '✗'}`));
    console.log('');

    return products;
  } catch (err) {
    console.error('\n❌ Erro ao buscar produtos da Square:', err?.message || err);
    if (err?.errors) console.error('   Detalhes:', err.errors);
    throw new Error('Não foi possível buscar produtos do Square.');
  }
}

/**
 * Converte item do SDK v44 para formato do frontend.
 * BigInt (800n) → Number (800) → divide por 100 → $8.00
 * @param {object} obj       — catalog object (type=ITEM)
 * @param {object} imageMap  — { imageId: imageUrl }
 */
function mapItem(obj, imageMap = {}, categoryMap = {}) {
  const data      = obj.itemData;
  const variation = data.variations?.[0];
  const vData     = variation?.itemVariationData;
  const money     = vData?.priceMoney;

  // BigInt → Number seguro para JSON
  const priceRaw   = money?.amount != null ? Number(money.amount) : null;
  const priceInUSD = priceRaw !== null ? priceRaw / 100 : null;

  // Verifica se é vendável
  const sellable = vData?.sellable !== false;

  // Resolve imagem: tenta imageIds do item, depois da variação
  let imageUrl = null;
  const imageIds = data.imageIds || data.imageId ? [data.imageId] : [];
  const allImageIds = [...(data.imageIds || []), ...(imageIds)].filter(Boolean);
  if (allImageIds.length > 0) {
    imageUrl = imageMap[allImageIds[0]] || null;
  }
  // fallback: verifica imageId direto no objeto
  if (!imageUrl && obj.imageData?.url) imageUrl = obj.imageData.url;

  // Monta array de variações para produtos com múltiplas opções (ex: Trufas)
  const allVariations = (data.variations || [])
    .map(v => {
      const vd = v.itemVariationData;
      const vm = vd?.priceMoney;
      const vPriceRaw = vm?.amount != null ? Number(vm.amount) : null;
      return {
        id:       v.id,
        name:     vd?.name || '',
        priceRaw: vPriceRaw,
        price:    vPriceRaw !== null ? vPriceRaw / 100 : null,
        inStock:  vd?.sellable !== false,
      };
    })
    .filter(v => v.inStock);

  return {
    id:          obj.id,
    variationId: variation?.id || null,
    name:        data.name || 'Produto',
    description: data.description || '',
    price:       priceInUSD,
    priceRaw,                        // centavos inteiros — usado no checkout
    currency:    money?.currency || 'USD',
    image:       imageUrl,
    inStock:     sellable,
    // v44: categoryId não existe — usa reportingCategory ou categories[0]
    categoryId:   data.reportingCategory?.id || data.categories?.[0]?.id || null,
    category:     categoryMap[data.reportingCategory?.id || data.categories?.[0]?.id] || null,
    // Variações disponíveis (ex: Petit Gateau, Trufa Maracujá, etc.)
    variations:   allVariations,
  };
}

// ================================================================
//  CHECKOUT — cria link de pagamento Square
// ================================================================

async function createPaymentLink(items, delivery = {}, customerName = '') {
  console.log(`\n🛒 Criando payment link com ${items.length} item(s)...`);

  // Monta line items — amount deve ser BigInt para o SDK v44
  const lineItems = items.map(item => {
    const amt = Math.round(Number(item.priceRaw));
    console.log(`   - ${item.name} × ${item.quantity || 1}  (${amt}¢)`);
    return {
      name:           String(item.name),
      quantity:       String(item.quantity || 1),
      basePriceMoney: {
        amount:   BigInt(amt),
        currency: 'USD',
      },
    };
  });

  // Taxa de entrega como line item separado
  if (delivery.fee && Number(delivery.fee) > 0) {
    const feeAmt = Math.round(Number(delivery.fee) * 100);
    console.log(`   + Entrega: ${delivery.method || 'UPS Ground'} (${feeAmt}¢)`);
    lineItems.push({
      name:           `Entrega — ${delivery.method || 'UPS Ground'}`,
      quantity:       '1',
      basePriceMoney: {
        amount:   BigInt(feeAmt),
        currency: 'USD',
      },
    });
  }

  const redirectBase = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/$/, '');

  try {
    const body = {
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
      },
      checkoutOptions: {
        allowTipping:          false,
        redirectUrl:           `${redirectBase}/checkout-success.html`,
        merchantSupportEmail:  'bellabrasilmarket@gmail.com',
        askForShippingAddress: false,
      },
    };

    console.log(`   → Location ID: ${process.env.SQUARE_LOCATION_ID}`);
    console.log(`   → Redirect:    ${body.checkoutOptions.redirectUrl}`);

    // SDK v44: client.checkout.paymentLinks.create(body)
    const response = await client.checkout.paymentLinks.create(body);

    // SDK v44: resultado em response.paymentLink OU response.data?.paymentLink
    const link = response.paymentLink || response.data?.paymentLink;
    const url  = link?.url || link?.longUrl;

    if (!url) {
      console.error('   ❌ Resposta sem URL:', JSON.stringify(
        response,
        (_, v) => typeof v === 'bigint' ? v.toString() : v
      ).slice(0, 400));
      throw new Error('Square não retornou URL de pagamento.');
    }

    console.log(`   ✅ Link criado: ${url}\n`);
    return url;

  } catch (err) {
    if (err?.errors?.length) {
      const detail = err.errors.map(e => `[${e.code}] ${e.detail}`).join(' | ');
      console.error('   ❌ Square API error:', detail);
      throw new Error(`Erro Square: ${detail}`);
    }
    // Re-lança se já for um Error nosso
    if (err.message.startsWith('Erro Square') || err.message.includes('URL')) throw err;
    console.error('   ❌ createPaymentLink:', err?.message || err);
    throw new Error('Não foi possível criar o link de pagamento.');
  }
}

module.exports = { getProducts, createPaymentLink };
