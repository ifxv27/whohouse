import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import api from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://whohouse.doyoufear.net', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

// API routes
app.use('/', api);

// Anti-sleep mechanism
const keepAlive = () => {
  console.log('Anti-sleep ping:', new Date().toISOString());
  fetch('https://whohouse-production.up.railway.app')
    .catch(error => console.log('Keep-alive ping failed:', error));
};

// Ping every 14 minutes (before Railway's 15-minute sleep timeout)
setInterval(keepAlive, 840000);

// Initial ping
keepAlive();

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
