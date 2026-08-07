require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { connectDB, memoryStore, saveLocalStore } = require('../server/src/config/db');
const { getSeedData } = require('../server/src/seeds/seedData');
const { apiLimiter, errorHandler } = require('../server/src/middlewares/rateLimiter');
const apiRoutes = require('../server/src/routes/api');

const app = express();

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static assets if present
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'JSR Healthcare (Vercel Serverless & HAMS Ready)',
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

// Seed data function ensuring all Indian hospitals and accounts are loaded
const initializeData = () => {
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
};

initializeData();
app.use(errorHandler);

module.exports = app;
