// ================================================================
//  firebase-config.js — Configuração do Firebase Auth
//
//  COMO CONFIGURAR (5 minutos):
//  1. Acesse https://console.firebase.google.com
//  2. Clique em "Add project" → dê um nome (ex: bella-brasil)
//  3. No menu lateral: Authentication → Get started
//  4. Ative os provedores desejados:
//     • Google      → só clicar em Enable
//     • Facebook    → precisa de App ID + Secret do developers.facebook.com
//     • Apple       → precisa de conta Apple Developer ($99/ano)
//  5. No menu lateral: Project Settings (⚙️) → Your apps → Web (</>)
//  6. Copie o firebaseConfig e cole abaixo
//  7. Em Authentication → Settings → Authorized domains
//     adicione: localhost (já deve estar lá)
// ================================================================

const FIREBASE_CONFIG = {
  apiKey:            "COLE_AQUI",
  authDomain:        "SEU-PROJETO.firebaseapp.com",
  projectId:         "SEU-PROJETO",
  storageBucket:     "SEU-PROJETO.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:xxxxxxxxxxxxxxxx",
};

// Detecta se o config foi preenchido
window._firebaseReady = FIREBASE_CONFIG.apiKey !== "COLE_AQUI";
