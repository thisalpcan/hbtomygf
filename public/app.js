// =============================================
//  CONFIG
// =============================================
const API_BASE = 'https://hbtomygf.onrender.com/api';
const ADMIN_PASS   = 'dgkoadmin123';    // ← admin şifreni buradan değiştir
const SECRET_PASS  = 'dgkotome';    // ← gizli mesaj şifresi
const SECRET_MSG   = `Seni çok seviyorum Nurefşan'ım. Bu sitenin her köşesi, seni ne kadar sevdiğimizi görmen için yapıldı. İyi ki doğdun, iyi ki varsın. ❤️`;

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
let musicPlaying = true;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicBtn.textContent = '🔇';
    musicPlaying = false;
  } else {
    music.play().catch(() => {}); // autoplay policy
    musicBtn.textContent = '🎵';
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
//  STAR MAP — 24 Mart 2008, Kahramanmaraş
// =============================================
function drawStarMap() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 680, H = 520;
  canvas.width = W; canvas.height = H;

  // Background
  const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.7);
  bgGrad.addColorStop(0, '#0d0820');
  bgGrad.addColorStop(0.5, '#080514');
  bgGrad.addColorStop(1, '#020108');
  ctx.fillStyle = bgGrad;
  ctx.roundRect(0, 0, W, H, 16);
  ctx.fill();

  // Milky way
  ctx.save();
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 800; i++) {
    const x = 180 + Math.sin(i * 0.05) * 60 + (Math.random() - 0.5) * 120;
    const y = i * (H / 800) + (Math.random() - 0.5) * 20;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.restore();

  // Seeded random background stars
  function seededRand(seed) {
    let s = seed;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  }
  const rand = seededRand(20080324);
  for (let i = 0; i < 320; i++) {
    const x = rand() * W, y = rand() * H, r = rand() * 0.9 + 0.2, a = rand() * 0.5 + 0.2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
  }

  // Constellations
  const constellations = [
    { name:'Orion', namePos:[105,225], stars:[
        {x:80,y:120,r:2.8,color:'#aaddff',name:'Betelgeuse'},{x:140,y:115,r:2.2,color:'#ffffff',name:'Bellatrix'},
        {x:90,y:165,r:1.8,color:'#ffffff'},{x:115,y:170,r:1.8,color:'#ffffff'},{x:140,y:165,r:1.8,color:'#ffffff'},
        {x:85,y:215,r:2.5,color:'#aaaaff',name:'Rigel'},{x:145,y:210,r:1.8,color:'#ffffff',name:'Saiph'},
      ], lines:[[0,1],[0,2],[1,3],[2,3],[2,4],[3,4],[4,5],[5,6],[2,6]] },
    { name:'Büyükayı', namePos:[430,85], stars:[
        {x:370,y:60,r:2.2,color:'#ffffff'},{x:400,y:50,r:2.0,color:'#ffffff'},{x:430,y:55,r:2.2,color:'#ffffff'},
        {x:455,y:70,r:2.0,color:'#ffffff'},{x:480,y:95,r:1.8,color:'#ffffff'},{x:510,y:85,r:1.8,color:'#ffffff'},{x:535,y:65,r:2.0,color:'#ffffff'},
      ], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] },
    { name:'Aslan', namePos:[510,200], stars:[
        {x:490,y:155,r:2.8,color:'#ffffcc',name:'Regulus'},{x:530,y:145,r:1.8,color:'#ffffff'},
        {x:560,y:160,r:1.8,color:'#ffffff'},{x:575,y:195,r:2.0,color:'#ffffff',name:'Denebola'},
        {x:545,y:210,r:1.6,color:'#ffffff'},{x:515,y:200,r:1.6,color:'#ffffff'},
      ], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[5,2]] },
    { name:'İkizler', namePos:[250,95], stars:[
        {x:225,y:65,r:2.5,color:'#ffffaa',name:'Castor'},{x:260,y:60,r:2.6,color:'#ffddaa',name:'Pollux'},
        {x:215,y:100,r:1.6,color:'#ffffff'},{x:250,y:95,r:1.6,color:'#ffffff'},
        {x:205,y:135,r:1.6,color:'#ffffff'},{x:240,y:130,r:1.6,color:'#ffffff'},
      ], lines:[[0,2],[1,3],[2,4],[3,5],[2,3],[4,5]] },
    { name:'Boğa', namePos:[185,115], stars:[
        {x:175,y:95,r:2.8,color:'#ffaaaa',name:'Aldebaran'},{x:205,y:80,r:1.6,color:'#ffffff'},
        {x:160,y:75,r:1.4,color:'#aaddff'},{x:145,y:70,r:1.4,color:'#aaddff'},
        {x:150,y:82,r:1.4,color:'#aaddff'},{x:155,y:90,r:1.4,color:'#aaddff'},
      ], lines:[[0,1],[0,2],[2,3],[3,4],[4,5],[5,0]] },
    { name:'Kız Burcu', namePos:[390,350], stars:[
        {x:390,y:320,r:2.5,color:'#ffffcc',name:'Spica'},{x:360,y:310,r:1.6,color:'#ffffff'},
        {x:345,y:335,r:1.6,color:'#ffffff'},{x:415,y:330,r:1.6,color:'#ffffff'},{x:430,y:355,r:1.6,color:'#ffffff'},
      ], lines:[[0,1],[1,2],[0,3],[3,4]] },
  ];

  const planets = [
    {x:300,y:280,r:5,color:'#ffcc44',glow:'rgba(255,200,50,0.35)',name:'Jüpiter',symbol:'♃'},
    {x:200,y:340,r:4,color:'#ff9999',glow:'rgba(255,100,80,0.3)',name:'Mars',symbol:'♂'},
    {x:430,y:170,r:4.5,color:'#ffaadd',glow:'rgba(255,150,200,0.3)',name:'Venüs',symbol:'♀'},
    {x:155,y:380,r:3.5,color:'#aaccff',glow:'rgba(100,150,255,0.25)',name:'Satürn',symbol:'♄'},
  ];

  // Moon
  const mx = 560, my = 380, mr = 18;
  const mg = ctx.createRadialGradient(mx-4, my-4, 2, mx, my, mr);
  mg.addColorStop(0,'#fffbe0'); mg.addColorStop(0.6,'#f0e080'); mg.addColorStop(1,'#c8b840');
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2); ctx.fillStyle = mg; ctx.fill();
  ctx.beginPath(); ctx.arc(mx+10, my-2, mr-1, 0, Math.PI*2); ctx.fillStyle = '#0d0820'; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.15;
  ctx.beginPath(); ctx.arc(mx, my, mr+10, 0, Math.PI*2); ctx.fillStyle = '#fffbe0'; ctx.fill();
  ctx.globalAlpha = 1; ctx.restore();
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#d4a843';
  ctx.textAlign = 'center'; ctx.fillText('🌙 Ay · Yay', mx, my + mr + 14);

  // Constellation lines
  constellations.forEach(con => {
    ctx.save(); ctx.strokeStyle = 'rgba(180,160,255,0.25)';
    ctx.lineWidth = 0.8; ctx.setLineDash([3,4]);
    con.lines.forEach(([a,b]) => {
      ctx.beginPath(); ctx.moveTo(con.stars[a].x, con.stars[a].y);
      ctx.lineTo(con.stars[b].x, con.stars[b].y); ctx.stroke();
    });
    ctx.restore();
  });

  // Stars + labels
  constellations.forEach(con => {
    con.stars.forEach(star => {
      ctx.save(); ctx.globalAlpha = 0.3;
      const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r*4);
      g.addColorStop(0, star.color); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r*4, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
      ctx.fillStyle = star.color; ctx.fill();
      if (star.name) {
        ctx.font = '10px sans-serif'; ctx.fillStyle = 'rgba(220,200,255,0.75)';
        ctx.textAlign = 'center'; ctx.fillText(star.name, star.x, star.y - star.r - 5);
      }
    });
    ctx.font = '500 11px sans-serif'; ctx.fillStyle = 'rgba(212,168,67,0.85)';
    ctx.textAlign = 'center'; ctx.fillText(con.name, con.namePos[0], con.namePos[1]);
  });

  // Planets
  planets.forEach(p => {
    ctx.save(); ctx.globalAlpha = 0.45;
    const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*5);
    pg.addColorStop(0, p.glow); pg.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r*5, 0, Math.PI*2);
    ctx.fillStyle = pg; ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.font = '11px sans-serif'; ctx.fillStyle = p.color;
    ctx.textAlign = 'center'; ctx.fillText(p.symbol + ' ' + p.name, p.x, p.y + p.r + 13);
  });

  // Sun / birth marker
  const sx = 310, sy = 420;
  for (let i = 0; i < 12; i++) {
    const angle = (i/12)*Math.PI*2, len = i%2===0?14:9;
    ctx.beginPath();
    ctx.moveTo(sx+Math.cos(angle)*6, sy+Math.sin(angle)*6);
    ctx.lineTo(sx+Math.cos(angle)*len, sy+Math.sin(angle)*len);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI*2); ctx.fillStyle = '#ffd700'; ctx.fill();
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center'; ctx.fillText('☀ Güneş · Koç', sx, sy+22);

  // Horizon
  ctx.save(); ctx.globalAlpha = 0.12;
  ctx.beginPath(); ctx.moveTo(0, H-30); ctx.lineTo(W, H-30);
  ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#050210'; ctx.fillRect(0, H-30, W, 30);
  ctx.globalAlpha = 0.5; ctx.font = '10px sans-serif';
  ctx.fillStyle = '#5566aa'; ctx.textAlign = 'left'; ctx.fillText('UFUK', 16, H-14);
  ctx.globalAlpha = 1; ctx.restore();

  // Info label
  ctx.font = '500 12px sans-serif'; ctx.fillStyle = 'rgba(212,168,67,0.7)';
  ctx.textAlign = 'right'; ctx.fillText('Kahramanmaraş · 37.6°K 36.9°D · 22:00', W-16, 24);

  // Compass
  ['K','D','G','B'].forEach((dir, i) => {
    const angle = i*Math.PI/2 - Math.PI/2, cx = 50, cy = H-60, cr = 22;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = i===0 ? '#ff6666' : 'rgba(180,160,200,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(dir, cx+Math.cos(angle)*cr, cy+Math.sin(angle)*cr+4);
  });
  ctx.beginPath(); ctx.arc(50, H-60, 16, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(180,160,200,0.25)'; ctx.lineWidth = 0.5; ctx.stroke();
}

// =============================================
//  INIT
// =============================================
loadMessages();
loadStories();
drawStarMap();
setTimeout(() => launchConfetti(), 1200);

