// Vercel Serverless Function — POST /api/create-checkout
const { createPaymentLink } = require('./lib/square');
const { isEmailConfigured, sendOrderConfirmation } = require('./lib/email');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, delivery, customerName, customerEmail, subtotal, total } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum item no carrinho.' });
    }

    const checkoutUrl = await createPaymentLink(items, delivery || {}, customerName || '');

    // Envia e-mail de confirmação direto do backend — não depende do browser
    let emailSent = false;
    if (isEmailConfigured() && customerEmail) {
      try {
        const fee = Number(delivery?.fee || 0);
        const sub = subtotal != null ? Number(subtotal) : items.reduce((s, i) => s + (i.priceRaw / 100) * i.quantity, 0);
        const tot = total    != null ? Number(total)    : sub + fee;

        await sendOrderConfirmation({
          customerName,
          customerEmail,
          items: items.map(i => ({
            name:     i.name,
            quantity: i.quantity,
            priceRaw: i.priceRaw, // em centavos — o template do email divide por 100
          })),
          subtotal:       sub,
          deliveryFee:    fee,
          total:          tot,
          deliveryMethod: delivery?.method || 'delivery',
        });
        emailSent = true;
        console.log(`✅ E-mail enviado para ${customerEmail}`);
      } catch (emailErr) {
        console.error('⚠️ Falha ao enviar e-mail:', emailErr.message);
      }
    }

    res.status(200).json({ success: true, checkoutUrl, emailReady: isEmailConfigured(), emailSent });
  } catch (err) {
    console.error('❌ /api/create-checkout:', err.message);
    res.status(502).json({ success: false, error: err.message });
  }
};
