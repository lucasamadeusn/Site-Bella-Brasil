// ================================================================
//  auth.js — Bella Brasil Market Plus
//  Autenticação local (localStorage) + Firebase (Google/Facebook/Apple)
// ================================================================

const AUTH_KEY = 'bellabrasil_user';

function getUser()      { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } }
function clearUser()    { localStorage.removeItem(AUTH_KEY); }

function saveUser(user) {
  const prev = getUser();
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  // ── Persistência do carrinho ao fazer login ──────────────────────
  // Se havia um carrinho de convidado E o usuário acabou de logar
  // (conta diferente ou login novo), mantém o carrinho intacto.
  // Se o usuário tinha um carrinho salvo em sua conta, mescla os itens.
  try {
    const CART_KEY = 'bellabrasil_cart';
    const USER_CART_KEY = `bellabrasil_cart_${user.email}`;

    const guestCart  = JSON.parse(localStorage.getItem(CART_KEY)  || '[]');
    const savedCart  = JSON.parse(localStorage.getItem(USER_CART_KEY) || '[]');

    if (savedCart.length > 0 && guestCart.length === 0) {
      // Usuário tinha carrinho salvo → restaura
      localStorage.setItem(CART_KEY, JSON.stringify(savedCart));
    } else if (guestCart.length > 0 && savedCart.length > 0) {
      // Mescla: some quantidades de itens duplicados
      const merged = [...savedCart];
      guestCart.forEach(gi => {
        const existing = merged.find(m => m.id === gi.id);
        if (existing) existing.qty = Math.min(existing.qty + gi.qty, 99);
        else merged.push(gi);
      });
      localStorage.setItem(CART_KEY, JSON.stringify(merged));
      localStorage.setItem(USER_CART_KEY, JSON.stringify(merged));
    } else if (guestCart.length > 0) {
      // Só carrinho de convidado → salva no perfil do usuário
      localStorage.setItem(USER_CART_KEY, JSON.stringify(guestCart));
    }

    // Dispara atualização do badge
    window.dispatchEvent(new Event('cartUpdated'));
  } catch(e) {}
}
function initials(name)  { return (name || '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase(); }

// ── Tabs
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
  clearAlerts();
}
document.querySelectorAll('.auth-tab').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// ── Alerts
function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = (type === 'error' ? '⚠️ ' : '✅ ') + msg;
  el.className = `auth-alert show ${type}`;
}
function clearAlerts() { document.querySelectorAll('.auth-alert').forEach(a => a.classList.remove('show')); }

// ── Password toggle
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const shown = input.type === 'text';
  input.type = shown ? 'password' : 'text';
  btn.textContent = shown ? '👁️' : '🙈';
}

// ── Password strength
const pwdInput = document.getElementById('reg-pwd');
if (pwdInput) {
  pwdInput.addEventListener('input', () => {
    const v = pwdInput.value;
    const bar = document.getElementById('pwd-strength-bar');
    const lbl = document.getElementById('pwd-strength-label');
    if (!bar || !lbl) return;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const levels = [
      { w:'0%',   bg:'',                   txt:'' },
      { w:'25%',  bg:'var(--red)',          txt:'Fraca' },
      { w:'55%',  bg:'var(--gold-dark)',    txt:'Razoável' },
      { w:'80%',  bg:'var(--green)',        txt:'Boa' },
      { w:'100%', bg:'var(--green-dark)',   txt:'Muito forte 💪' },
    ];
    const lvl = v.length === 0 ? levels[0] : levels[Math.min(score, 4)];
    bar.style.width = lvl.w; bar.style.background = lvl.bg; lbl.textContent = lvl.txt;
  });
}

// ── Field validation
function setFieldError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err) { err.textContent = msg || err.textContent; err.classList.add('show'); }
}
function clearFieldErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
}

// ================================================================
//  LOGIN COM E-MAIL
// ================================================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    clearFieldErrors('login-form'); clearAlerts();
    const email = document.getElementById('login-email').value.trim();
    const pwd   = document.getElementById('login-pwd').value;
    let ok = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('login-email','login-email-err'); ok=false; }
    if (!pwd) { setFieldError('login-pwd','login-pwd-err'); ok=false; }
    if (!ok) return;

    const users = JSON.parse(localStorage.getItem('bellabrasil_users') || '[]');
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) { showAlert('login-alert','E-mail não encontrado. Crie sua conta!'); return; }
    if (found.pwd !== btoa(pwd)) { showAlert('login-alert','Senha incorreta. Tente novamente.'); return; }

    saveUser({ ...found, pwd: undefined });
    showAlert('login-alert', `Bem-vindo de volta, ${found.firstName}! 🎉`, 'success');
    const redir2 = new URLSearchParams(location.search).get('redirect');
    if (redir2 === 'checkout') { setTimeout(() => location.href = 'checkout.html', 800); return; }
    setTimeout(() => renderDashboard(), 800);
  });
}

// ================================================================
//  CADASTRO COM E-MAIL
// ================================================================
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    clearFieldErrors('register-form'); clearAlerts();
    const fname = document.getElementById('reg-fname').value.trim();
    const lname = document.getElementById('reg-lname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const addr  = document.getElementById('reg-addr').value.trim();
    const city  = document.getElementById('reg-city').value.trim();
    const zip   = document.getElementById('reg-zip').value.trim();
    const pwd   = document.getElementById('reg-pwd').value;
    const pwd2  = document.getElementById('reg-pwd2').value;
    const state = document.getElementById('reg-state').value;
    const pref  = document.getElementById('reg-pref').value;
    const optin = document.getElementById('reg-optin').checked;
    const dob   = document.getElementById('reg-dob').value;

    let ok = true;
    if (!fname) { setFieldError('reg-fname','reg-fname-err'); ok=false; }
    if (!lname) { setFieldError('reg-lname','reg-lname-err'); ok=false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('reg-email','reg-email-err'); ok=false; }
    if (!phone || phone.replace(/\D/g,'').length < 10) { setFieldError('reg-phone','reg-phone-err'); ok=false; }
    if (!addr) { setFieldError('reg-addr','reg-addr-err'); ok=false; }
    if (!city) { setFieldError('reg-city','reg-city-err'); ok=false; }
    if (!zip || zip.replace(/\D/g,'').length < 5) { setFieldError('reg-zip','reg-zip-err'); ok=false; }
    if (pwd.length < 8) { setFieldError('reg-pwd','reg-pwd-err'); ok=false; }
    if (pwd !== pwd2) { setFieldError('reg-pwd2','reg-pwd2-err','As senhas não coincidem.'); ok=false; }
    if (!ok) { registerForm.querySelector('.error')?.scrollIntoView({behavior:'smooth',block:'center'}); return; }

    const users = JSON.parse(localStorage.getItem('bellabrasil_users') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      showAlert('register-alert','Este e-mail já está cadastrado. Faça login!'); return;
    }
    const newUser = {
      id: Date.now().toString(),
      firstName:fname, lastName:lname, name:`${fname} ${lname}`,
      email, phone, dob,
      address:{ street:addr, city, state, zip },
      preference:pref, optin,
      pwd: btoa(pwd),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('bellabrasil_users', JSON.stringify(users));
    saveUser({ ...newUser, pwd: undefined });
    showAlert('register-alert', `Conta criada com sucesso, ${fname}! 🎉`, 'success');
    const btn = document.getElementById('register-submit');
    if (btn) { btn.classList.add('loading'); btn.textContent = '⏳ Criando conta...'; }
    setTimeout(() => renderDashboard(), 900);
  });
}

// ================================================================
//  DASHBOARD
// ================================================================
function renderDashboard() {
  const user = getUser();
  if (!user) return;
  document.getElementById('auth-tabs')?.style.setProperty('display','none');
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  const dash = document.getElementById('account-dashboard');
  if (!dash) return;
  dash.classList.add('active');

  const avatar = document.getElementById('acc-avatar');
  if (avatar) {
    if (user.photoURL) {
      avatar.innerHTML = `<img src="${user.photoURL}" alt="${user.name}"
        style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`;
      avatar.style.background = 'transparent';
    } else {
      avatar.textContent = initials(user.name);
      const colors = ['#1A3B6F','#1FAD5C','#E8A800','#7C3AED','#DC2626'];
      avatar.style.background = colors[(user.name||'').charCodeAt(0) % colors.length];
    }
  }
  document.getElementById('acc-name').textContent  = `Olá, ${user.firstName || user.name}! 👋`;
  document.getElementById('acc-email').textContent = user.email;
  updateNavAccountLink(user);
}

function logout() {
  // Salva o carrinho atual no perfil antes de sair
  try {
    const user = getUser();
    if (user && user.email) {
      const cart = localStorage.getItem('bellabrasil_cart');
      if (cart) localStorage.setItem(`bellabrasil_cart_${user.email}`, cart);
    }
  } catch(e) {}

  clearUser();
  // Limpa carrinho da sessão (não fica no browser de outra pessoa)
  localStorage.removeItem('bellabrasil_cart');
  window.dispatchEvent(new Event('cartUpdated'));
  document.getElementById('auth-tabs')?.style.removeProperty('display');
  document.getElementById('account-dashboard')?.classList.remove('active');
  switchTab('login');
  authToast('Você saiu da conta. Até logo! 👋', 'success');
}

function showOrderHistory()  { authToast('📦 Histórico de pedidos em breve!','info'); }
function showAddresses()     { location.href = 'enderecos.html'; }
function showNotifications() { location.href = 'perfil.html?tab=pref'; }

function showEditProfile() {
  location.href = 'perfil.html';
}

function safeSet(id, val) { const el=document.getElementById(id); if(el) el.value=val; }

function showForgotModal(e) {
  e.preventDefault();
  authToast(`📧 Entre em contato pelo WhatsApp para redefinir sua senha.`, 'success');
}

function updateNavAccountLink(user) {
  document.querySelectorAll('#nav-account-link').forEach(link => {
    if (user) link.textContent = `👤 ${user.firstName || 'Conta'}`;
  });
}

function authToast(msg, type='success') {
  if (typeof showToast === 'function') return showToast(msg, type);
  const colors = {success:'#1FAD5C',error:'#DC2626',info:'#1A3B6F'};
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
    background:${colors[type]||colors.success};color:#fff;padding:.85rem 1.4rem;
    border-radius:12px;font-size:.95rem;font-weight:500;
    box-shadow:0 8px 24px rgba(0,0,0,.2);max-width:340px;`;
  t.textContent = msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3500);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (user && document.getElementById('account-dashboard')) renderDashboard();
  if (user) updateNavAccountLink(user);
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'register') switchTab('register');
});
