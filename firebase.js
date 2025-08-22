require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');

console.log("✅ FIREBASE_KEY_PATH:", process.env.FIREBASE_KEY_PATH);

const serviceAccount = require(path.resolve(__dirname, '..', process.env.FIREBASE_KEY_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
