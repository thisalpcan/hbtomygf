// =============================================
//  server.js — Birthday App Backend (v2)
//  Node.js + Express + MongoDB + Multer (ses)
// =============================================

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const multer   = require('multer');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Admin token
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Ses dosyaları klasörü ───────────────────
const AUDIO_DIR = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AUDIO_DIR),
  filename:    (req, file, cb) => cb(null, `voice_${Date.now()}.webm`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── MongoDB ─────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://alpkisisel_db_user:alpcanbi12@cluster0.lv4smui.mongodb.net/?appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB bağlandı'))
  .catch(err => console.error('❌  MongoDB hatası:', err));

// ── Schema ──────────────────────────────────
const messageSchema = new mongoose.Schema({
  author:   { type: String, required: true, trim: true, maxlength: 50 },
  message:  { type: String, trim: true, maxlength: 600, default: '' },
  emoji:    { type: String, default: '🎂' },
  type:     { type: String, enum: ['text', 'voice', 'story'], default: 'text' },
  voiceUrl: { type: String },
  years:    { type: Number },
  approved: { type: Boolean, default: true },
  reactions: {
    '❤️': { type: Number, default: 0 },
    '🥂': { type: Number, default: 0 },
    '🎉': { type: Number, default: 0 },
    '😊': { type: Number, default: 0 },
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

function isAdmin(req) {
  return req.query.token === ADMIN_TOKEN || req.body?.token === ADMIN_TOKEN;
}

// ── Routes ──────────────────────────────────

// GET all messages
app.get('/api/messages', async (req, res) => {
  try {
    const filter = isAdmin(req) ? {} : { approved: { $ne: false } };
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Mesajlar alınamadı' });
  }
});

// POST text / story
app.post('/api/messages', async (req, res) => {
  const { author, message, emoji, type, years } = req.body;
  if (!author?.trim()) return res.status(400).json({ error: 'Ad zorunlu' });
  try {
    const doc = await Message.create({
      author:  author.slice(0,50),
      message: (message || '').slice(0,600),
      emoji:   emoji || '🎂',
      type:    ['text','story'].includes(type) ? type : 'text',
      years:   years ? Number(years) : undefined,
      approved: true
    });
    res.status(201).json(doc);
  } catch {
    res.status(500).json({ error: 'Kaydedilemedi' });
  }
});

// POST voice
app.post('/api/messages/voice', upload.single('audio'), async (req, res) => {
  const { author } = req.body;
  if (!author?.trim() || !req.file) return res.status(400).json({ error: 'Ad ve ses dosyası zorunlu' });
  try {
    const voiceUrl = `/audio/${req.file.filename}`;
    const doc = await Message.create({ author: author.slice(0,50), type: 'voice', voiceUrl, approved: true });
    res.status(201).json(doc);
  } catch {
    res.status(500).json({ error: 'Ses kaydedilemedi' });
  }
});

// POST reaction
app.post('/api/messages/:id/react', async (req, res) => {
  const { emoji } = req.body;
  if (!['❤️','🥂','🎉','😊'].includes(emoji)) return res.status(400).json({ error: 'Geçersiz emoji' });
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Bulunamadı' });
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    msg.markModified('reactions');
    await msg.save();
    res.json(msg);
  } catch {
    res.status(500).json({ error: 'Reaksiyon kaydedilemedi' });
  }
});

// PATCH approve
app.patch('/api/messages/:id/approve', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'Yetkisiz' });
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(msg);
  } catch {
    res.status(500).json({ error: 'Güncellenemedi' });
  }
});

// DELETE
app.delete('/api/messages/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'Yetkisiz' });
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (msg?.voiceUrl) {
      const fp = path.join(__dirname, 'public', msg.voiceUrl);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ error: 'Silinemedi' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`🎂  Sunucu: http://localhost:${PORT}`);
  console.log(`🛡  Admin token: ${ADMIN_TOKEN}`);
});
