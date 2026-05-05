// Vercel Serverless Function — POST /api/send-confirmation
require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { sendOrderConfirmation, isEmailConfigured } = require('../server/email');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isEmailConfigured()) {
    return res.status(503).json({ error: 'Serviço de e-mail não configurado.' });
  }

  try {
    const result = await sendOrderConfirmation(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('❌ /api/send-confirmation:', err.message);
    res.status(500).json({ error: err.message });
  }
};
