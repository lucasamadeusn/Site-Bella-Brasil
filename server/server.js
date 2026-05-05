// ================================================================
//  server.js — Backend Bella Brasil Market Plus
//  Serve como intermediário seguro entre o site e o Square.
//
//  Rodar localmente:
//    cd server && npm install && node server.js
//
//  Rodar em produção (Railway):
//    Basta fazer deploy — o PORT é definido automaticamente.
// ================================================================

// Carrega .env do mesmo diretório deste arquivo (funciona independente de onde o processo foi iniciado)
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const path    = require('path');
const express = require('express');
const cors    = require('cors');
const { getProducts, createPaymentLink } = require('./square');
const { sendOrderConfirmation, isEmailConfigured } = require('./email');

const app  = express();
const PORT = process.env.PORT || 3333;

// ── Serve frontend estático (HTML/CSS/JS/images) ────────────────
// Em produção (Vercel/Railway) o __dirname é server/, então subimos um nível
const FRONTEND_DIR = path.join(__dirname, '..');
app.use(express.static(FRONTEND_DIR, { index: 'index.html' }));

// ── CORS (para chamadas diretas à API de outros domínios) ───────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permite chamadas sem origin (ex: Postman, curl) e origens da lista
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(null, true); // em produção permite qualquer origin (mesma URL)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.use(express.json());

// ================================================================
//  GET /
//  Health check — confirma que o servidor está no ar.
// ================================================================
app.get('/', (_req, res) => {
  res.json({
    status:  'online',
    store:   'Bella Brasil Market Plus',
    env:     process.env.SQUARE_ENVIRONMENT || 'sandbox',
    version: '1.0.0',
  });
});

// ================================================================
//  GET /products
//  Retorna todos os produtos do Square.
//
//  Resposta:
//  { success: true, products: [ { id, name, price, ... } ] }
// ================================================================
app.get('/products', async (_req, res) => {
  try {
    console.log('📦 GET /products — buscando no Square...');
    const products = await getProducts();
    console.log(`✅ ${products.length} produto(s) retornado(s)`);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error('❌ GET /products:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================================================
//  POST /create-checkout
//  Cria um link de pagamento no Square.
//
//  Body:
//  {
//    "items":        [{ "name": "Picanha", "quantity": 1, "priceRaw": 3499 }],
//    "delivery":     { "method": "UPS Ground", "fee": 5.99 },   ← opcional
//    "customerName": "João Silva"                                ← opcional
//  }
//
//  Resposta:
//  { success: true, checkoutUrl: "https://square.link/..." }
// ================================================================
app.post('/create-checkout', async (req, res) => {
  try {
    const { items, delivery, customerName } = req.body;

    // Validação
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Campo "items" é obrigatório e deve ter ao menos 1 item.',
      });
    }
    for (const item of items) {
      if (!item.name || item.priceRaw == null) {
        return res.status(400).json({
          success: false,
          error: 'Cada item precisa de "name" e "priceRaw" (preço em centavos).',
        });
      }
    }

    console.log(`🛒 POST /create-checkout — ${items.length} item(s)`);
    const checkoutUrl = await createPaymentLink(items, delivery || {}, customerName || '');
    console.log('✅ Link criado:', checkoutUrl);

    res.json({ success: true, checkoutUrl, emailReady: isEmailConfigured() });
  } catch (err) {
    console.error('❌ POST /create-checkout:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================================================================
//  POST /send-confirmation
//  Envia e-mail de confirmação de compra ao cliente.
//
//  Body: { customerName, customerEmail, items, subtotal,
//          deliveryFee, total, deliveryMethod, orderId }
// ================================================================
app.post('/send-confirmation', async (req, res) => {
  try {
    const result = await sendOrderConfirmation(req.body);
    if (result.sent) {
      res.json({ success: true, message: `E-mail enviado para ${req.body.customerEmail}` });
    } else if (result.reason === 'not_configured') {
      res.json({ success: false, reason: 'not_configured',
        message: 'E-mail não configurado. Adicione GMAIL_APP_PASSWORD ao .env' });
    } else {
      res.status(500).json({ success: false, error: result.reason });
    }
  } catch (err) {
    console.error('❌ POST /send-confirmation:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Fallback: serve index.html para rotas desconhecidas ─────────
// (necessário para o Vercel roteando tudo pelo Express)
app.use((req, res) => {
  const requestedPage = path.join(FRONTEND_DIR, req.path);
  // Se parece um arquivo de página, tenta servir; caso contrário, 404 JSON
  if (req.path.endsWith('.html')) {
    return res.sendFile(requestedPage, err => {
      if (err) res.status(404).sendFile(path.join(FRONTEND_DIR, '404.html'),
        () => res.status(404).json({ error: 'Página não encontrada.' }));
    });
  }
  res.status(404).json({ success: false, error: 'Endpoint não encontrado.' });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🇧🇷 ═══════════════════════════════════════════');
  console.log('   Bella Brasil Backend — online!');
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Ambiente : ${process.env.SQUARE_ENVIRONMENT || 'sandbox'}`);
  console.log(`   Location : ${process.env.SQUARE_LOCATION_ID || '(não definido)'}`);
  console.log('🇧🇷 ═══════════════════════════════════════════\n');
});
