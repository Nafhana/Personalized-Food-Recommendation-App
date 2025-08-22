const db = require('./config/firebase');
const userRoutes = require('./routes/userRoutes');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ MUST be before any route that uses req.body
app.use('/api', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Eatoo backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/test-firestore', async (req, res) => {
  try {
    const docRef = db.collection('test').doc('sample');
    await docRef.set({ hello: 'world' });

    const snapshot = await docRef.get();
    const data = snapshot.data();

    res.json({ message: 'Data written & read!', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
