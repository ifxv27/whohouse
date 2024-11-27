import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize cards data file
const cardsFilePath = path.join(__dirname, '../../data/cards.json');
if (!fs.existsSync(path.dirname(cardsFilePath))) {
  fs.mkdirSync(path.dirname(cardsFilePath), { recursive: true });
}
if (!fs.existsSync(cardsFilePath)) {
  fs.writeFileSync(cardsFilePath, JSON.stringify([]));
}

// Helper function to read/write cards
const readCards = () => {
  try {
    const data = fs.readFileSync(cardsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cards:', error);
    return [];
  }
};

const writeCards = (cards) => {
  try {
    fs.writeFileSync(cardsFilePath, JSON.stringify(cards, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing cards:', error);
    return false;
  }
};

// Card endpoints
router.get('/api/cards', (req, res) => {
  try {
    const cards = readCards();
    res.json(cards);
  } catch (error) {
    console.error('Error getting cards:', error);
    res.status(500).json({ error: 'Failed to get cards' });
  }
});

router.post('/api/cards', (req, res) => {
  try {
    const cards = readCards();
    const newCard = { ...req.body, id: `card-${Date.now()}` };
    cards.push(newCard);
    writeCards(cards);
    res.json(newCard);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ error: 'Failed to add card' });
  }
});

router.put('/api/cards/:id', (req, res) => {
  try {
    const cards = readCards();
    const index = cards.findIndex(card => card.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }
    cards[index] = { ...cards[index], ...req.body };
    writeCards(cards);
    res.json(cards[index]);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

router.delete('/api/cards/:id', (req, res) => {
  try {
    const cards = readCards();
    const filteredCards = cards.filter(card => card.id !== req.params.id);
    writeCards(filteredCards);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Images endpoint
router.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, '../../public/images');
  try {
    const files = fs.readdirSync(imagesDir);
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    res.json(images);
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Failed to read images directory' });
  }
});

export default router;
