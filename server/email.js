// ================================================================
//  email.js — Bella Brasil Market Plus
//  Envio de e-mail de confirmação de compra via nodemailer / Gmail
//
//  CONFIGURAÇÃO (obrigatória):
//  1. Ative verificação em 2 etapas na conta Google
//  2. Acesse: myaccount.google.com → Segurança → Senhas de app
//  3. Crie uma senha de app "Mail" → copie os 16 caracteres
//  4. Cole em .env: GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
// ================================================================

const nodemailer = require('nodemailer');

// Cria transporter (reutilizado para todas as chamadas)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Verifica se o e-mail está configurado
function isEmailConfigured() {
  return !!(
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD &&
    process.env.GMAIL_APP_PASSWORD !== 'COLE_AQUI_APP_PASSWORD'
  );
}

// ================================================================
//  Template HTML do e-mail de confirmação
// ================================================================
function buildOrderEmailHtml({ customerName, customerEmail, items, subtotal, deliveryFee, total, deliveryMethod, orderId }) {
  const storeName  = process.env.STORE_NAME || 'Bella Brasil Market Plus';
  const storeEmail = process.env.GMAIL_USER || 'bellabrasilmarket@gmail.com';
  const storePhone = '(425) 968-2011';
  const storeAddr  = '12545 116th Ave NE, Kirkland, WA 98034';

  const itemsHtml = (items || []).map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1F2937">
        ${item.name}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#6B7280;text-align:center">
        ${item.quantity}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1F2937;text-align:right;font-weight:600">
        $${(Number(item.priceRaw) * item.quantity / 100).toFixed(2)}
      </td>
    </tr>`).join('');

  const freeShipping = Number(deliveryFee) === 0;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Pedido Confirmado — ${storeName}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- ── HEADER ── -->
  <tr>
    <td style="background:#1A3B6F;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center">
      <div style="font-size:28px;font-weight:900;color:#FFD200;letter-spacing:1px">
        🇧🇷 ${storeName}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">
        ${storeAddr}
      </div>
    </td>
  </tr>

  <!-- ── HERO ── -->
  <tr>
    <td style="background:#ffffff;padding:40px 40px 24px;text-align:center;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB">
      <div style="width:72px;height:72px;background:linear-gradient(135deg,#1FAD5C,#178048);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px">
        ✅
      </div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1A3B6F">
        Pedido Confirmado!
      </h1>
      <p style="margin:0;font-size:15px;color:#6B7280">
        Olá, <strong style="color:#1F2937">${customerName || 'Cliente'}</strong>! Recebemos seu pedido com sucesso. 🎉
      </p>
      ${orderId ? `<div style="margin-top:12px;display:inline-block;background:#EEF3FB;border-radius:8px;padding:6px 16px;font-size:12px;color:#1A3B6F;font-weight:600">
        Pedido #${orderId}
      </div>` : ''}
    </td>
  </tr>

  <!-- ── ITEMS ── -->
  <tr>
    <td style="background:#ffffff;padding:0 40px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB">
      <h2 style="font-size:15px;font-weight:700;color:#1A3B6F;margin:0 0 12px;text-transform:uppercase;letter-spacing:.06em">
        Resumo do pedido
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden">
        <tr style="background:#F9FAFB">
          <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Produto</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Qtd</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Total</th>
        </tr>
        ${itemsHtml}
      </table>

      <!-- Totais -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">
        <tr>
          <td style="font-size:14px;color:#6B7280;padding:4px 0">Subtotal</td>
          <td style="font-size:14px;color:#1F2937;text-align:right;font-weight:600;padding:4px 0">$${Number(subtotal).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#6B7280;padding:4px 0">
            Entrega (${deliveryMethod || 'UPS Ground'})
          </td>
          <td style="font-size:14px;padding:4px 0;text-align:right;font-weight:600;color:${freeShipping ? '#1FAD5C' : '#1F2937'}">
            ${freeShipping ? '🎉 GRÁTIS' : '$' + Number(deliveryFee).toFixed(2)}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border-top:2px solid #E5E7EB;padding-top:12px"></td>
        </tr>
        <tr>
          <td style="font-size:17px;font-weight:800;color:#1A3B6F;padding:0">TOTAL</td>
          <td style="font-size:17px;font-weight:800;color:#1FAD5C;text-align:right;padding:0">$${Number(total).toFixed(2)}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── PRÓXIMOS PASSOS ── -->
  <tr>
    <td style="background:#EEF3FB;padding:24px 40px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB">
      <h2 style="font-size:15px;font-weight:700;color:#1A3B6F;margin:0 0 16px;text-transform:uppercase;letter-spacing:.06em">
        Próximos passos
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="36" style="vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#1FAD5C;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">1</div>
          </td>
          <td style="padding-left:12px;font-size:14px;color:#374151;padding-bottom:14px">
            <strong>Pagamento confirmado</strong> — Seu pedido foi recebido e está sendo preparado.
          </td>
        </tr>
        <tr>
          <td width="36" style="vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#1A3B6F;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">2</div>
          </td>
          <td style="padding-left:12px;font-size:14px;color:#374151;padding-bottom:14px">
            <strong>Separação</strong> — Nossa equipe vai preparar todos os itens com cuidado.
          </td>
        </tr>
        <tr>
          <td width="36" style="vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#FFD200;border-radius:50%;color:#1A3B6F;font-size:13px;font-weight:700;text-align:center;line-height:28px">3</div>
          </td>
          <td style="padding-left:12px;font-size:14px;color:#374151">
            <strong>Entrega</strong> — Você receberá o rastreamento assim que o pedido for despachado.
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── CONTATO ── -->
  <tr>
    <td style="background:#ffffff;padding:24px 40px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB">
      <p style="margin:0;font-size:14px;color:#6B7280;text-align:center">
        Dúvidas? Fale conosco:<br/>
        📞 <a href="tel:+14259682011" style="color:#1FAD5C;font-weight:600">${storePhone}</a>
        &nbsp;|&nbsp;
        ✉️ <a href="mailto:${storeEmail}" style="color:#1FAD5C;font-weight:600">${storeEmail}</a>
      </p>
    </td>
  </tr>

  <!-- ── FOOTER ── -->
  <tr>
    <td style="background:#1A3B6F;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center">
      <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,.8)">
        © ${new Date().getFullYear()} ${storeName} — ${storeAddr}
      </p>
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,.5)">
        Este e-mail foi enviado para ${customerEmail} porque você realizou uma compra em nossa loja.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}

// ================================================================
//  FUNÇÃO PRINCIPAL — envia e-mail de confirmação
// ================================================================
async function sendOrderConfirmation({ customerName, customerEmail, items, subtotal, deliveryFee, total, deliveryMethod, orderId }) {
  if (!isEmailConfigured()) {
    console.warn('⚠️  E-mail não configurado. Adicione GMAIL_APP_PASSWORD ao .env para ativar.');
    return { sent: false, reason: 'not_configured' };
  }

  if (!customerEmail) {
    console.warn('⚠️  E-mail do cliente não informado.');
    return { sent: false, reason: 'no_customer_email' };
  }

  const storeName = process.env.STORE_NAME || 'Bella Brasil Market Plus';

  try {
    const transporter = createTransporter();
    const html = buildOrderEmailHtml({ customerName, customerEmail, items, subtotal, deliveryFee, total, deliveryMethod, orderId });

    const info = await transporter.sendMail({
      from:    `"${storeName}" <${process.env.GMAIL_USER}>`,
      to:      customerEmail,
      subject: `✅ Pedido confirmado — ${storeName}`,
      html,
    });

    console.log(`   ✉️  E-mail enviado para ${customerEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };

  } catch (err) {
    console.error('   ❌ Erro ao enviar e-mail:', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendOrderConfirmation, isEmailConfigured };
