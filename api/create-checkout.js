// Vercel Serverless Function — POST /api/create-checkout
const { createPaymentLink } = require('./lib/square');
const { isEmailConfigured } = require('./lib/email');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, delivery, customerName } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum item no carrinho.' });
    }
    const checkoutUrl = await createPaymentLink(items, delivery || {}, customerName || '');
    res.status(200).json({ success: true, checkoutUrl, emailReady: isEmailConfigured() });
  } catch (err) {
    console.error('❌ /api/create-checkout:', err.message);
    res.status(502).json({ success: false, error: err.message });
  }
};
