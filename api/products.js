// Vercel Serverless Function — GET /api/products
require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { getProducts } = require('../server/square');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const products = await getProducts();
    res.status(200).json({ products });
  } catch (err) {
    console.error('❌ /api/products:', err.message);
    res.status(502).json({ error: err.message });
  }
};
