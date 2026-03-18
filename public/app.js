// =============================================
//  CONFIG
// =============================================
const API_BASE     = 'http://localhost:3000/api';
const ADMIN_PASS   = 'admin123';    // ← admin şifreni buradan değiştir
const SECRET_PASS  = 'nurefsan';    // ← gizli mesaj şifresi
const SECRET_MSG   = `Seni çok seviyorum Nurefşan. Bu sitenin her köşesi, seni ne kadar özel hissettiğini görmek için yapıldı. İyi ki doğdun, iyi ki varsın. ❤️`;

// =============================================
//  CUSTOM CURSOR
// =============================================
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', e => {
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  setTimeout(() => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top  = e.clientY + 'px';
  }, 80);
});

document.querySelectorAll('a,button,input,textarea,.flip-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '28px';
    cursor.style.height = '28px';
    cursor.style.background = 'var(--gold)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '18px';
    cursor.style.height = '18px';
    cursor.style.background = 'var(--pink-deep)';
  });
});

// =============================================
//  THEME TOGGLE
// =============================================
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});

// =============================================
//  MUSIC TOGGLE
// =============================================
const music      = document.getElementById('bgMusic');
const musicBtn   = document.getElementById('musicToggle');
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicBtn.textContent = '🎵';
    musicPlaying = false;
  } else {
    music.play().catch(() => {}); // autoplay policy
    musicBtn.textContent = '🔇';
    musicPlaying = true;
  }
});

// =============================================
//  FLOATING PETALS
// =============================================
(function spawnPetals() {
  const container = document.getElementById('petals');
  const symbols = ['🌸', '🌺', '✨', '💫', '🌹', '💕', '⭐', '🎀', '💖'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (0.75 + Math.random() * 0.9) + 'rem';
    el.style.animationDuration = (7 + Math.random() * 10) + 's';
    el.style.animationDelay   = (-Math.random() * 14) + 's';
    container.appendChild(el);
  }
})();

// =============================================
//  FLIP CARD
// =============================================
document.getElementById('flipCard').addEventListener('click', function() {
  this.classList.toggle('flipped');
  if (this.classList.contains('flipped')) launchConfetti();
});

// =============================================
//  TABS
// =============================================
let activeTab = 'text';
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    document.getElementById('tab-' + activeTab).classList.add('active');
  });
});

// =============================================
//  EMOJI PICKER
// =============================================
let selectedEmoji = '🎂';
document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedEmoji = btn.dataset.emoji;
  });
});

// =============================================
//  CHAR COUNTER
// =============================================
const messageInput = document.getElementById('messageInput');
const charCount    = document.getElementById('charCount');
messageInput.addEventListener('input', () => {
  charCount.textContent = `${messageInput.value.length} / 500`;
});

// =============================================
//  VOICE RECORDER
// =============================================
let mediaRecorder = null;
let audioChunks   = [];
let recordTimer   = null;
let recordSeconds = 0;
let voiceBlob     = null;

const recordBtn    = document.getElementById('recordBtn');
const recordTimerEl = document.getElementById('recordTimer');
const timerVal     = document.getElementById('timerVal');
const voicePreview = document.getElementById('voicePreview');
const voicePlayback = document.getElementById('voicePlayback');
const waveform     = document.getElementById('waveform');
const discardVoice = document.getElementById('discardVoice');

recordBtn.addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks   = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        voiceBlob = new Blob(audioChunks, { type: 'audio/webm' });
        voicePlayback.src = URL.createObjectURL(voiceBlob);
        voicePreview.style.display = 'flex';
        waveform.classList.remove('active');
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      recordBtn.textContent = '⏹ Durdur';
      recordBtn.classList.add('recording');
      recordTimerEl.style.display = 'inline';
      waveform.classList.add('active');
      recordSeconds = 0;
      recordTimer   = setInterval(() => {
        recordSeconds++;
        const m = Math.floor(recordSeconds / 60);
        const s = recordSeconds % 60;
        timerVal.textContent = `${m}:${s.toString().padStart(2,'0')}`;
        if (recordSeconds >= 60) stopRecording();
      }, 1000);
    } catch (err) {
      showToast('❌ Mikrofon erişimi reddedildi');
    }
  } else {
    stopRecording();
  }
});

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  recordBtn.textContent = '🎤 Kayıt Başlat';
  recordBtn.classList.remove('recording');
  recordTimerEl.style.display = 'none';
  clearInterval(recordTimer);
}

discardVoice.addEventListener('click', () => {
  voiceBlob = null;
  voicePreview.style.display = 'none';
  voicePlayback.src = '';
  showToast('🗑 Ses kaydı silindi');
});

// =============================================
//  LOAD MESSAGES & STORIES
// =============================================
const reacted = new Set();

async function loadMessages() {
  const grid = document.getElementById('messagesGrid');
  try {
    const res  = await fetch(`${API_BASE}/messages`);
    const data = await res.json();
    const msgs = data.filter(m => m.type !== 'story');

    if (!msgs.length) {
      grid.innerHTML = `<div class="empty-state"><div class="big-emoji">💌</div><p>Henüz mesaj yok — ilk yazan sen ol!</p></div>`;
      return;
    }

    grid.innerHTML = '';
    msgs.forEach((msg, i) => grid.appendChild(createCard(msg, i)));
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="big-emoji">⚠️</div><p>Bağlantı hatası. Backend çalışıyor mu?</p></div>`;
  }
}

async function loadStories() {
  const track = document.getElementById('storiesTrack');
  try {
    const res    = await fetch(`${API_BASE}/messages`);
    const data   = await res.json();
    const stories = data.filter(m => m.type === 'story');
    if (!stories.length) return;
    track.innerHTML = '';
    stories.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'story-card';
      div.style.animationDelay = `${i * 0.1}s`;
      div.innerHTML = `
        <div class="story-years">${s.years || '?'}</div>
        <div class="story-years-label">yıldır tanışıyoruz</div>
        <p class="story-text">"${escapeHtml(s.message)}"</p>
        <span class="story-author">— ${escapeHtml(s.author)}</span>
      `;
      track.appendChild(div);
    });
  } catch {}
}

function createCard(msg, index) {
  const div = document.createElement('div');
  div.className = 'message-card';
  div.style.animationDelay = `${index * 0.07}s`;

  const date    = new Date(msg.createdAt);
  const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  const reactions = msg.reactions || {};
  const reactionEmojis = ['❤️', '🥂', '🎉', '😊'];

  const reactionsHTML = reactionEmojis.map(emoji => {
    const count = reactions[emoji] || 0;
    return `<button class="reaction-btn ${reacted.has(msg._id+emoji)?'reacted':''}"
      onclick="addReaction('${msg._id}','${emoji}',this)">
      ${emoji} <span class="rcount">${count > 0 ? count : ''}</span>
    </button>`;
  }).join('');

  const pendingBadge = msg.approved === false
    ? `<span class="card-pending">⏳ Onay bekliyor</span>` : '';

  if (msg.voiceUrl) {
    div.innerHTML = `
      <span class="card-emoji">🎤</span>
      <audio class="card-audio" controls src="${msg.voiceUrl}"></audio>
      <div class="card-footer">
        <span class="card-author">— ${escapeHtml(msg.author)}</span>
        <span class="card-date">${dateStr}</span>
      </div>
      ${pendingBadge}
      <div class="card-reactions">${reactionsHTML}</div>`;
  } else {
    div.innerHTML = `
      <span class="card-emoji">${msg.emoji || '🎂'}</span>
      <p class="card-message">"${escapeHtml(msg.message)}"</p>
      <div class="card-footer">
        <span class="card-author">— ${escapeHtml(msg.author)}</span>
        <span class="card-date">${dateStr}</span>
      </div>
      ${pendingBadge}
      <div class="card-reactions">${reactionsHTML}</div>`;
  }
  return div;
}

function escapeHtml(str = '') {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// =============================================
//  ADD REACTION
// =============================================
async function addReaction(id, emoji, btn) {
  const key = id + emoji;
  if (reacted.has(key)) return;
  reacted.add(key);
  btn.classList.add('reacted');
  try {
    const res  = await fetch(`${API_BASE}/messages/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji })
    });
    const data = await res.json();
    const count = data.reactions?.[emoji] || 0;
    btn.querySelector('.rcount').textContent = count > 0 ? count : '';
  } catch {}
}
window.addReaction = addReaction;

// =============================================
//  SUBMIT MESSAGE
// =============================================
const form      = document.getElementById('messageForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = submitBtn.querySelector('.btn-text');
const btnLoad   = submitBtn.querySelector('.btn-loading');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const author = document.getElementById('authorInput').value.trim();
  if (!author) { showToast('❗ Adını yaz!'); return; }

  submitBtn.disabled       = true;
  btnText.style.display    = 'none';
  btnLoad.style.display    = 'inline';

  try {
    if (activeTab === 'text') {
      const message = messageInput.value.trim();
      if (!message) { showToast('❗ Mesajını yaz!'); return; }
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, message, emoji: selectedEmoji, type: 'text' })
      });

    } else if (activeTab === 'voice') {
      if (!voiceBlob) { showToast('❗ Önce ses kaydet!'); return; }
      const fd = new FormData();
      fd.append('author', author);
      fd.append('type', 'voice');
      fd.append('audio', voiceBlob, 'voice.webm');
      await fetch(`${API_BASE}/messages/voice`, { method: 'POST', body: fd });

    } else if (activeTab === 'story') {
      const story = document.getElementById('storyInput').value.trim();
      const years = document.getElementById('yearsInput').value || '0';
      if (!story) { showToast('❗ Anını yaz!'); return; }
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, message: story, years, type: 'story', emoji: '📖' })
      });
    }

    // Reset
    form.reset();
    charCount.textContent = '0 / 500';
    voiceBlob = null;
    voicePreview.style.display = 'none';
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-emoji="🎂"]').classList.add('active');
    selectedEmoji = '🎂';

    showToast('🎉 Gönderildi! Teşekkürler 💖');
    launchConfetti();
    await loadMessages();
    await loadStories();

  } catch {
    showToast('❌ Bir hata oluştu, tekrar dene.');
  } finally {
    submitBtn.disabled    = false;
    btnText.style.display = 'inline';
    btnLoad.style.display = 'none';
  }
});

// =============================================
//  SECRET MESSAGE
// =============================================
document.getElementById('unlockBtn').addEventListener('click', () => {
  const pw = document.getElementById('secretPassword').value;
  if (pw === SECRET_PASS) {
    document.getElementById('secretUnlockRow').style.display = 'none';
    document.getElementById('secretMessageText').textContent = SECRET_MSG;
    document.getElementById('secretMessageBox').style.display = 'block';
    launchConfetti();
    showToast('🔓 Gizli mesaj açıldı! 💖');
  } else {
    showToast('❌ Yanlış şifre');
    document.getElementById('secretPassword').value = '';
    document.getElementById('secretPassword').style.borderColor = 'var(--pink-mid)';
    setTimeout(() => {
      document.getElementById('secretPassword').style.borderColor = '';
    }, 1500);
  }
});

document.getElementById('secretPassword').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('unlockBtn').click();
});

// =============================================
//  ADMIN PANEL
// =============================================
let adminClickCount = 0;
document.getElementById('adminTrigger').addEventListener('click', () => {
  adminClickCount++;
  if (adminClickCount >= 5) {
    adminClickCount = 0;
    document.getElementById('adminOverlay').style.display = 'flex';
  }
});

document.getElementById('adminClose').addEventListener('click', () => {
  document.getElementById('adminOverlay').style.display = 'none';
});

document.getElementById('adminLoginBtn').addEventListener('click', async () => {
  const pw = document.getElementById('adminPassword').value;
  if (pw !== ADMIN_PASS) { showToast('❌ Yanlış admin şifre'); return; }

  document.getElementById('adminLoginForm').style.display = 'none';
  document.getElementById('adminContent').style.display   = 'block';
  await loadAdminMessages();
});

async function loadAdminMessages() {
  const list = document.getElementById('adminMsgList');
  const stats = document.getElementById('adminStats');
  list.innerHTML = '<p style="color:var(--text-soft);font-size:.85rem">Yükleniyor...</p>';
  try {
    const res  = await fetch(`${API_BASE}/messages?admin=true&token=${ADMIN_PASS}`);
    const data = await res.json();
    stats.textContent = `Toplam ${data.length} mesaj`;
    list.innerHTML = '';
    if (!data.length) {
      list.innerHTML = '<p style="color:var(--text-soft);font-size:.85rem">Henüz mesaj yok.</p>';
      return;
    }
    data.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'admin-msg-item';
      div.innerHTML = `
        <div class="admin-msg-info">
          <div class="admin-msg-author">${escapeHtml(msg.author)} <span style="color:var(--gold)">${msg.type==='voice'?'🎤':msg.type==='story'?'📖':'✏️'}</span></div>
          <div class="admin-msg-text">${escapeHtml(msg.message || '[ses mesajı]')}</div>
          <div class="admin-msg-meta">${new Date(msg.createdAt).toLocaleDateString('tr-TR')} · ${msg.approved===false?'⏳ Onay bekliyor':'✅ Onaylı'}</div>
        </div>
        <div class="admin-msg-actions">
          ${msg.approved===false ? `<button class="btn-approve" onclick="adminApprove('${msg._id}')">✓ Onayla</button>` : ''}
          <button class="btn-delete" onclick="adminDelete('${msg._id}')">🗑 Sil</button>
        </div>`;
      list.appendChild(div);
    });
  } catch {
    list.innerHTML = '<p style="color:var(--text-soft)">Yüklenemedi.</p>';
  }
}

async function adminApprove(id) {
  await fetch(`${API_BASE}/messages/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: ADMIN_PASS })
  });
  showToast('✅ Onaylandı');
  await loadAdminMessages();
}

async function adminDelete(id) {
  if (!confirm('Bu mesajı silmek istediğine emin misin?')) return;
  await fetch(`${API_BASE}/messages/${id}?token=${ADMIN_PASS}`, { method: 'DELETE' });
  showToast('🗑 Silindi');
  await loadAdminMessages();
  await loadMessages();
}

window.adminApprove = adminApprove;
window.adminDelete  = adminDelete;

// =============================================
//  TOAST
// =============================================
function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
//  CONFETTI
// =============================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#c2185b','#e91e8c','#f8bbd0','#d4a843','#f5d98a','#ffffff','#b5179e','#ff6eb4'];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 60,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    size: 5 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.14,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  }));
  const duration = 4500;
  const start    = performance.now();
  let frame;
  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle  = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    if (elapsed < duration) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (frame) cancelAnimationFrame(frame);
  requestAnimationFrame(draw);
}

// =============================================
//  INIT
// =============================================
loadMessages();
loadStories();
setTimeout(() => launchConfetti(), 1200);
