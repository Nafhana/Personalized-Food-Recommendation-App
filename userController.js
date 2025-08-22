const db = require('../config/firebase');

const registerUser = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    // ✅ Check if all required fields exist
    if (!username || !name || !password) {
      return res.status(400).json({ error: 'Username, name, and password are required.' });
    }

    // ✅ Check if username already exists
    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    // 🔐 [Optional] hash password here later if you plan to
    await userRef.set({
      username,
      name,
      password, // ❗ plain text for now — just for FYP. Not safe for production!
      joinedAt: new Date()
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
