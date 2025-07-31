import express from 'express';
import * as toxicity from '@tensorflow-models/toxicity';
import * as tf from '@tensorflow/tfjs';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // enable CORS so extension can call it

let model;
const threshold = 0.9;

toxicity.load(threshold).then((loaded) => {
  model = loaded;
  console.log('Toxicity model loaded ✅');
});

app.get('/', (req, res) => {
  res.send('Toxicity API is up and running.');
});

app.post('/analyze', async (req, res) => {
  if (!model) return res.status(503).json({ error: 'Model still loading' });

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" must be a non-empty string' });
  }

  try {
    const predictions = await model.classify([text]);
    res.json({ predictions });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Failed to classify text' });
  }
});

app.listen(port, () => {
  console.log(`Toxicity API running at http://localhost:${port}`);
});
