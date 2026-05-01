require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const path = require('path');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

const upload = multer({ dest: 'uploads/' });

// CORS -- whitelist local dev origins
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:4173',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.use(express.json({ limit: '2mb' }));


const Groq = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('CRITICAL: GROQ_API_KEY is not defined in .env');
} else {
  console.log(`Groq API Key loaded: ${GROQ_API_KEY.substring(0, 7)}...`);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Cognito, an AI study assistant built to help students learn effectively. You explain concepts clearly, give examples, and adapt to the student's level. When appropriate, use markdown formatting (headers, bold, lists, code blocks) to structure your answers. Be concise but thorough.`;

// ── Health check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('Cognito backend is running.');
});

// ── Chat endpoint (Groq) ─────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    // Support both old format { message } and new format { messages }
    let conversationMessages;

    if (req.body.messages && Array.isArray(req.body.messages)) {
      conversationMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...req.body.messages,
      ];
    } else if (req.body.message) {
      conversationMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: req.body.message },
      ];
    } else {
      return res.status(400).json({ error: 'No message provided' });
    }

    console.log('Incoming Chat Request Body:', JSON.stringify(req.body, null, 2));

    const chatCompletion = await groq.chat.completions.create({
      messages: conversationMessages,
      model: 'llama-3.3-70b-versatile',
    });
    
    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('Groq API returned no content');
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat error full details:', err);
    res.status(500).json({ 
      error: `Chat failed: ${err.message}`,
      details: err.response?.data || err.stack 
    });
  }
});

// ── File Analysis endpoint ──────────────────────────────
app.post('/api/analyze/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const analyzeFilePath = path.join(__dirname, 'analyzer_api.py');
  
  const pythonProcess = spawn('python', [analyzeFilePath, filePath], {
    env: { ...process.env },
  });

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (error) console.warn('Python stderr (analyze):', error);
    
    // Clean up file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    if (code !== 0) {
      return res.status(500).json({ error: error || 'Failed to run analysis' });
    }

    try {
      const parsed = JSON.parse(result.trim());
      return res.json({
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        analysis1: parsed.weak_topics,
      });
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON returned from script' });
    }
  });
});

// ── Video Recommendation endpoint ───────────────────────
app.post('/api/recommend', (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'No topic provided' });
  }

  const filePath = path.join(__dirname, 'recommender_api.py');
  const py = spawn('python', [filePath, topic], {
    env: { ...process.env },
  });

  let out = '';
  let errOut = '';

  py.stdout.on('data', (d) => (out += d.toString()));
  py.stderr.on('data', (d) => (errOut += d.toString()));

  py.on('close', (code) => {
    if (errOut) console.warn('Python stderr (recommend):', errOut);

    if (code !== 0) {
      return res.status(500).json({ error: 'Failed to run recommender' });
    }

    try {
      const json = JSON.parse(out);
      res.json(json);
    } catch (err) {
      console.error('Failed to parse recommend output:', out);
      res.status(500).json({ error: 'Recommender returned invalid response.' });
    }
  });
});

// ── Video Summarization endpoint ────────────────────────
app.post('/api/summarize', (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'No video URL provided' });
  }

  const filePath = path.join(__dirname, 'summarizer_api.py');
  const py = spawn('python', [filePath, videoUrl], {
    env: { ...process.env },
  });

  let out = '';
  let errOut = '';

  py.stdout.on('data', (d) => (out += d.toString()));
  py.stderr.on('data', (d) => (errOut += d.toString()));

  py.on('close', (code) => {
    if (errOut) console.warn('Python stderr (summarize):', errOut);

    if (code !== 0) {
      return res.status(500).json({ error: 'Summarizer process failed. Check your GOOGLE_API_KEY.' });
    }

    try {
      const json = JSON.parse(out);
      if (json.error) {
        return res.status(500).json({ error: json.error });
      }
      res.json({ summary: json.summary, title: json.title || null });
    } catch (err) {
      console.error('Failed to parse summarize output:', out);
      res.status(500).json({ error: 'Summarizer returned invalid JSON.' });
    }
  });
});

const PORT = process.env.PORT || 3030;
const server = app.listen(PORT, () => console.log(`Cognito backend listening on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}`);
});

// Keep-alive to prevent event loop from emptying
setInterval(() => {}, 1000 * 60 * 60);
