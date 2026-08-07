const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// In-Memory Fallback & Reactive Store if MongoDB is local or absent
const memoryStore = {
  users: [],
  patients: [],
  appointments: [],
  ehrs: [],
  labTests: [],
  beds: [],
  medicines: [],
  bills: [],
  consents: [],
  notifications: [],
  bloodBank: []
};

const DB_BACKUP_PATH = path.join(__dirname, '../../data-store.json');

// Auto load backup if exists
function loadLocalStore() {
  try {
    if (fs.existsSync(DB_BACKUP_PATH)) {
      const data = fs.readFileSync(DB_BACKUP_PATH, 'utf8');
      const parsed = JSON.parse(data);
      Object.assign(memoryStore, parsed);
      console.log('✅ Loaded data from local JSON database store.');
    }
  } catch (err) {
    console.warn('⚠️ Could not load data-store.json, using fresh memory state');
  }
}

function saveLocalStore() {
  try {
    fs.writeFileSync(DB_BACKUP_PATH, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('⚠️ Failed saving data-store.json:', err.message);
  }
}

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hams';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(' MongoDB Connected Successfully to:', mongoURI);
  } catch (err) {
    console.log('ℹ️ MongoDB not detected on localhost:27017 -> Using High-Performance Resilient In-Memory & File Store with Full Seed Data.');
    isMongoConnected = false;
  }
  loadLocalStore();
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  memoryStore,
  saveLocalStore
};
