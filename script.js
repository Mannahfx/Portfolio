// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================
function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Mobile nav toggle (simple)
function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  if (!links) return;
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.display = 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '72px';
    links.style.right = '24px';
    links.style.background = 'rgba(3,6,17,0.95)';
    links.style.backdropFilter = 'blur(14px)';
    links.style.padding = '20px 28px';
    links.style.borderRadius = '12px';
    links.style.border = '1px solid rgba(255,255,255,0.08)';
    links.style.gap = '18px';
    links.style.zIndex = '200';
    links.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
  }
}

// Close mobile nav when clicking outside or clicking a link
document.addEventListener('click', (e) => {
  const links = document.querySelector('.nav-links');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (links && links.style.display === 'flex' && links.style.flexDirection === 'column') {
    if (!links.contains(e.target) && !menuBtn.contains(e.target)) {
      links.style.display = 'none';
    }
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links && links.style.display === 'flex' && links.style.flexDirection === 'column') {
      links.style.display = 'none';
    }
  });
});

// Active nav link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ==========================================
// CHAT WIDGET
// ==========================================
function toggleChat() {
  const chat = document.getElementById('chat-box-container');
  if (!chat) return;

  if (chat.style.display === 'flex') {
    chat.style.display = 'none';
  } else {
    chat.style.display = 'flex';
    const chatBox = document.getElementById('chat-box');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function addMessage(sender, text) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const msgWrap = document.createElement('div');
  msgWrap.className = `msg-wrap ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerText = sender === 'user' ? '👤' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerText = text;

  msgWrap.appendChild(avatar);
  msgWrap.appendChild(bubble);
  chatBox.appendChild(msgWrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return null;

  const msgWrap = document.createElement('div');
  msgWrap.className = 'msg-wrap ai';
  msgWrap.id = 'typing-indicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerText = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  bubble.appendChild(dots);
  msgWrap.appendChild(avatar);
  msgWrap.appendChild(bubble);
  chatBox.appendChild(msgWrap);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msgWrap;
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  input.value = '';

  const typing = showTypingIndicator();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (typing) typing.remove();
    const data = await res.json();
    addMessage('ai', data.reply);
  } catch (err) {
    if (typing) typing.remove();
    addMessage('ai', '⚠️ Could not connect to the AI backend. Please try again later or reach out via the contact form.');
    console.error(err);
  }
}

function applySuggestion(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendChat();
  }
}

// ==========================================
// CONTACT FORM
// ==========================================


// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Init scroll reveal animations
  initRevealAnimations();

  // Chat enter key support
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChat();
    });
  }
});
