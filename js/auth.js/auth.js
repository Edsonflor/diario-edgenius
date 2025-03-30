// Configuração do Firebase - Substitua com suas credenciais do console Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Verifica se o usuário está logado
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(user => {
    // Redireciona se estiver na página errada
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (user && isLoginPage) {
      window.location.href = 'index.html';
    } else if (!user && !isLoginPage) {
      window.location.href = 'login.html';
    }
  });

  // Formulário de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch(error => {
          alert(`Erro no login: ${error.message}`);
        });
    });
  }

  // Botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut()
        .then(() => {
          window.location.href = 'login.html';
        })
        .catch(error => {
          alert(`Erro ao sair: ${error.message}`);
        });
    });
  }
});
