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

  const itemsHtml = (items || []).map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#FAFFFE'}">
      <td style="padding:12px 16px;font-size:14px;color:#1F2937;font-weight:500">
        ${item.name}
      </td>
      <td style="padding:12px 16px;font-size:14px;color:#6B7280;text-align:center">
        <span style="background:#F0FDF4;color:#178048;font-weight:700;padding:2px 10px;border-radius:20px;font-size:13px">×${item.quantity}</span>
      </td>
      <td style="padding:12px 16px;font-size:14px;color:#178048;text-align:right;font-weight:700">
        $${(Number(item.priceRaw) * item.quantity / 100).toFixed(2)}
      </td>
    </tr>`).join('');

  const freeShipping = Number(deliveryFee) === 0;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Pedido Confirmado — ${storeName}</title>
</head>
<body style="margin:0;padding:0;background:#F0FDF4;font-family:'Segoe UI',Helvetica,Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;padding:40px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)">

  <!-- ══ HEADER ══ -->
  <tr>
    <td style="background:linear-gradient(135deg,#1FAD5C 0%,#0e8040 100%);padding:36px 40px;text-align:center">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:.5px;text-shadow:0 2px 4px rgba(0,0,0,.15)">
        🇧🇷 ${storeName}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,.85);margin-top:6px">
        ${storeAddr}
      </div>
    </td>
  </tr>

  <!-- ══ HERO ══ -->
  <tr>
    <td style="background:#ffffff;padding:44px 40px 28px;text-align:center">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#1FAD5C,#0e8040);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:20px;box-shadow:0 4px 16px rgba(31,173,92,.35)">
        ✅
      </div>
      <h1 style="margin:0 0 10px;font-size:28px;font-weight:900;color:#1A3B6F;line-height:1.2">
        Pedido Confirmado! 🎉
      </h1>
      <p style="margin:0 0 20px;font-size:16px;color:#6B7280;line-height:1.5">
        Olá, <strong style="color:#1F2937">${customerName || 'Cliente'}</strong>!<br/>
        Recebemos seu pedido e já estamos preparando tudo com carinho. 💚
      </p>
      ${orderId ? `
      <div style="display:inline-block;background:linear-gradient(135deg,#F0FDF4,#DCFCE7);border:2px solid #1FAD5C;border-radius:12px;padding:10px 24px">
        <div style="font-size:11px;color:#178048;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">Número do Pedido</div>
        <div style="font-size:20px;font-weight:900;color:#1A3B6F;letter-spacing:1px">${orderId}</div>
      </div>` : ''}
    </td>
  </tr>

  <!-- ══ ITENS ══ -->
  <tr>
    <td style="background:#ffffff;padding:0 40px 32px">
      <div style="background:#F0FDF4;border-radius:12px;padding:16px;margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:#178048;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">
          🛒 Itens do Pedido
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #D1FAE5">
          <tr style="background:#1FAD5C">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Produto</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Qtd</th>
            <th style="padding:10px 16px;text-align:right;font-size:12px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Total</th>
          </tr>
          ${itemsHtml}
        </table>
      </div>

      <!-- Totais -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;padding:16px;border:1px solid #E5E7EB">
        <tr>
          <td style="font-size:14px;color:#6B7280;padding:6px 16px">Subtotal</td>
          <td style="font-size:14px;color:#374151;text-align:right;font-weight:600;padding:6px 16px">$${Number(subtotal).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#6B7280;padding:6px 16px">Entrega (${deliveryMethod || 'UPS Ground'})</td>
          <td style="font-size:14px;padding:6px 16px;text-align:right;font-weight:600;color:${freeShipping ? '#1FAD5C' : '#374151'}">
            ${freeShipping ? '🎉 GRÁTIS' : '$' + Number(deliveryFee).toFixed(2)}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 16px"><div style="height:2px;background:linear-gradient(90deg,#1FAD5C,#0e8040);border-radius:2px;margin:8px 0"></div></td>
        </tr>
        <tr>
          <td style="font-size:18px;font-weight:900;color:#1A3B6F;padding:8px 16px 12px">TOTAL PAGO</td>
          <td style="font-size:22px;font-weight:900;color:#1FAD5C;text-align:right;padding:8px 16px 12px">$${Number(total).toFixed(2)}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ PRÓXIMOS PASSOS ══ -->
  <tr>
    <td style="background:#F0FDF4;padding:28px 40px;border-top:3px solid #D1FAE5;border-bottom:3px solid #D1FAE5">
      <div style="font-size:13px;font-weight:800;color:#178048;text-transform:uppercase;letter-spacing:.08em;margin-bottom:20px">
        📦 O que acontece agora?
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="44" style="vertical-align:top">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#1FAD5C,#0e8040);border-radius:50%;color:#fff;font-size:15px;font-weight:900;text-align:center;line-height:36px;box-shadow:0 2px 8px rgba(31,173,92,.4)">1</div>
          </td>
          <td style="padding-left:14px;padding-bottom:18px">
            <div style="font-size:14px;font-weight:700;color:#1A3B6F">Pagamento confirmado ✓</div>
            <div style="font-size:13px;color:#6B7280;margin-top:2px">Seu pedido foi recebido e está na fila de preparação.</div>
          </td>
        </tr>
        <tr>
          <td width="44" style="vertical-align:top">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#1A3B6F,#0f2547);border-radius:50%;color:#fff;font-size:15px;font-weight:900;text-align:center;line-height:36px;box-shadow:0 2px 8px rgba(26,59,111,.3)">2</div>
          </td>
          <td style="padding-left:14px;padding-bottom:18px">
            <div style="font-size:14px;font-weight:700;color:#1A3B6F">Separação & embalagem</div>
            <div style="font-size:13px;color:#6B7280;margin-top:2px">Nossa equipe seleciona cada produto com cuidado especial.</div>
          </td>
        </tr>
        <tr>
          <td width="44" style="vertical-align:top">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#FFD200,#f0c200);border-radius:50%;color:#1A3B6F;font-size:15px;font-weight:900;text-align:center;line-height:36px;box-shadow:0 2px 8px rgba(255,210,0,.4)">3</div>
          </td>
          <td style="padding-left:14px">
            <div style="font-size:14px;font-weight:700;color:#1A3B6F">Entrega na sua porta 🚚</div>
            <div style="font-size:13px;color:#6B7280;margin-top:2px">Você receberá o código de rastreamento assim que o pedido for despachado.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ CONTATO ══ -->
  <tr>
    <td style="background:#ffffff;padding:28px 40px;text-align:center">
      <p style="margin:0 0 16px;font-size:14px;color:#6B7280">
        Dúvidas sobre seu pedido? Estamos aqui para ajudar! 😊
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 auto">
        <tr>
          <td style="padding:0 8px">
            <a href="tel:+14259682011" style="display:inline-block;background:#1FAD5C;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:10px 20px;border-radius:8px">
              📞 ${storePhone}
            </a>
          </td>
          <td style="padding:0 8px">
            <a href="https://wa.me/14259682011" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:10px 20px;border-radius:8px">
              💬 WhatsApp
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ FOOTER ══ -->
  <tr>
    <td style="background:linear-gradient(135deg,#1FAD5C 0%,#0e8040 100%);padding:28px 40px;text-align:center">
      <div style="font-size:22px;font-weight:900;color:#ffffff;margin-bottom:6px">🇧🇷 Bella Brasil Market Plus</div>
      <div style="font-size:12px;color:rgba(255,255,255,.85);margin-bottom:12px">${storeAddr}</div>
      <div style="height:1px;background:rgba(255,255,255,.2);margin:16px 0"></div>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.65)">
        © ${year} ${storeName}. Este e-mail foi enviado para <strong>${customerEmail}</strong> porque você realizou uma compra em nossa loja.
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
