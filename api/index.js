require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { connectDB, memoryStore, saveLocalStore } = require('../server/src/config/db');
const { getSeedData } = require('../server/src/seeds/seedData');
const { errorHandler } = require('../server/src/middlewares/rateLimiter');
const apiRoutes = require('../server/src/routes/api');

const app = express();

app.set('trust proxy', 1);

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static assets if present
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Health Check
app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'JSR Healthcare (Vercel Serverless Live)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    records: {
      users: (memoryStore.users || []).length,
      patients: (memoryStore.patients || []).length,
      appointments: (memoryStore.appointments || []).length,
      hospitals: (memoryStore.hospitals || []).length,
      beds: (memoryStore.beds || []).length,
      medicines: (memoryStore.medicines || []).length,
      labTests: (memoryStore.labTests || []).length,
      bills: (memoryStore.bills || []).length
    }
  });
});

// Mount routes on both /api and root
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Seed data initialization
const initializeData = () => {
  try {
    const seed = getSeedData();
    if (!memoryStore.hospitals || memoryStore.hospitals.length < 10) {
      memoryStore.hospitals = seed.hospitals;
    }
    if (!memoryStore.users || memoryStore.users.length < 5) {
      memoryStore.users = seed.users;
    }
    if (!memoryStore.patients || memoryStore.patients.length === 0) {
      memoryStore.patients = seed.patients;
    }
    if (!memoryStore.bloodBank || memoryStore.bloodBank.length < 8) {
      memoryStore.bloodBank = seed.bloodBank;
    }
    if (!memoryStore.beds || memoryStore.beds.length === 0) {
      memoryStore.beds = seed.beds;
    }
    if (!memoryStore.medicines || memoryStore.medicines.length === 0) {
      memoryStore.medicines = seed.medicines;
    }
    if (!memoryStore.labTests || memoryStore.labTests.length === 0) {
      memoryStore.labTests = seed.labTests;
    }
    if (!memoryStore.bills || memoryStore.bills.length === 0) {
      memoryStore.bills = seed.bills;
    }
    if (!memoryStore.appointments || memoryStore.appointments.length === 0) {
      memoryStore.appointments = seed.appointments;
    }
    saveLocalStore();
  } catch (e) {
    console.warn('Seed init warning:', e.message);
  }
};

initializeData();
app.use(errorHandler);

module.exports = (req, res) => {
  return app(req, res);
};
