import './style.css';

const root = document.getElementById('root');

root.innerHTML = `
<div class="app">
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <div class="logo">P</div>
      <div>
        <strong>Papu Bot</strong>
        <small>3.0</small>
      </div>
    </div>

    <button class="new-chat" id="newChat">＋ Nueva conversación</button>

    <nav>
      <button class="nav-item active">💬 Chat</button>
      <button class="nav-item" id="mapBtn">🗺️ Mapa interactivo</button>
      <button class="nav-item" id="aboutBtn">ℹ️ Sobre Papu Bot</button>
    </nav>

    <div class="side-note">
      <span class="dot"></span>
      Gemini conectado mediante servidor
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <button class="menu" id="menu">☰</button>

      <div>
        <h1>Papu Bot 3.0</h1>
        <p>Asistente histórico y de investigación</p>
      </div>

      <div class="status">
        <span></span> Online
      </div>
    </header>

    <section class="content" id="content">
      <div class="welcome">
        <div class="hero-icon">⚔️</div>

        <h2>¿Qué querés investigar?</h2>

        <p>
          Puedo ayudarte a estudiar historia, especialmente la Segunda Guerra
          Mundial, comparar hechos, explicar campañas y organizar información.
        </p>

        <div class="chips">
          <button>Explicame la Segunda Guerra Mundial</button>
          <button>¿Qué fue la Operación Barbarroja?</button>
          <button>Compará Alemania y la URSS</button>
        </div>
      </div>

      <div class="messages" id="messages"></div>
    </section>

    <form class="composer" id="form">
      <textarea
        id="input"
        rows="1"
        placeholder="Escribí tu pregunta..."
        autocomplete="off"
      ></textarea>

      <button type="submit" id="send">➤</button>
    </form>

    <div class="disclaimer">
      Papu Bot puede cometer errores. Para trabajos escolares importantes,
      verificá las fuentes.
    </div>
  </main>
</div>

<div class="modal hidden" id="modal">
  <div class="modal-card">
    <button class="close" id="close">×</button>

    <h2>🗺️ Mapa interactivo</h2>

    <p>
      Esta versión incluye el panel preparado para incorporar mapas históricos.
      Podés pedirme información sobre cualquier frente o campaña.
    </p>

    <div class="map-placeholder">
      <div class="map-grid"></div>
      <span>MAPA HISTÓRICO</span>
    </div>
  </div>
</div>
`;

const messages = document.getElementById('messages');
const input = document.getElementById('input');
const form = document.getElementById('form');
const send = document.getElementById('send');
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('modal');

let history = [];

function addMessage(role, text) {
  const el = document.createElement('div');

  el.className = `message ${role}`;

  el.innerHTML = `
    <div class="avatar">${role === 'user' ? 'Tú' : 'P'}</div>
    <div class="bubble"></div>
  `;

  el.querySelector('.bubble').textContent = text;

  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;

  return el;
}

async function ask(text) {
  addMessage('user', text);

  const loading = addMessage('bot', 'Pensando...');

  send.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        history
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error del servidor');
    }

    loading.querySelector('.bubble').textContent = data.reply;

    history.push({
      role: 'user',
      parts: [{ text }]
    });

    history.push({
      role: 'model',
      parts: [{ text: data.reply }]
    });

  } catch (err) {
    loading.querySelector('.bubble').textContent =
      'No pude conectarme con Gemini. Revisá que GEMINI_API_KEY esté configurada en Vercel y volvé a intentar.';
  } finally {
    send.disabled = false;
    input.focus();
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const text = input.value.trim();

  if (!text || send.disabled) return;

  input.value = '';

  ask(text);
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll('.chips button').forEach(btn => {
  btn.addEventListener('click', () => {
    ask(btn.textContent);
  });
});

document.getElementById('menu').onclick = () => {
  sidebar.classList.toggle('open');
};

document.getElementById('newChat').onclick = () => {
  history = [];
  messages.innerHTML = '';
  sidebar.classList.remove('open');
};

document.getElementById('mapBtn').onclick = () => {
  modal.classList.remove('hidden');
  sidebar.classList.remove('open');
};

document.getElementById('aboutBtn').onclick = () => {
  addMessage(
    'bot',
    'Soy Papu Bot 3.0, un asistente basado en Gemini. Estoy configurado para explicar historia de forma clara, comparar acontecimientos y ayudarte a investigar la Segunda Guerra Mundial.'
  );

  sidebar.classList.remove('open');
};

document.getElementById('close').onclick = () => {
  modal.classList.add('hidden');
};

modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});
