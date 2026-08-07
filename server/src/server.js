require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');

const { connectDB, memoryStore, saveLocalStore } = require('./config/db');
const { getSeedData } = require('./seeds/seedData');
const { setupSockets } = require('./sockets/socketHandler');
const { apiLimiter, errorHandler } = require('./middlewares/rateLimiter');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
app.set('socketio', io);
setupSockets(io);

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));
app.use('/api/', apiLimiter);

// Static assets (uploads, public images, and production client build)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../../client/public/images')));
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'HAMS (Hospital & Healthcare Management System - ABDM Ready)',
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

// SPA Fallback for client routing
app.get('*', (req, res) => {
  const clientIndex = path.join(__dirname, '../../client/dist/index.html');
  res.sendFile(clientIndex);
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
  console.log(`✅ HAMS & ORS Dataset Loaded: ${memoryStore.hospitals.length} Hospitals, ${memoryStore.users.length} Users.`);
};

// Error handling middleware
app.use(errorHandler);

// Start Server immediately and connect DB in background
initializeData();

server.listen(PORT, () => {
  console.log(`🚀 [HAMS UNIFIED FULLSTACK SERVER] Running on http://localhost:${PORT}`);
  console.log(`🏥 ABDM Gateway Sandbox: http://localhost:${PORT}/api/abha`);
  console.log(`📊 Excel Exporter: http://localhost:${PORT}/api/export`);
  console.log(`👥 Admin Users DB: http://localhost:${PORT}/api/admin/users`);
  
  // Non-blocking DB check
  connectDB().catch(err => console.log('DB Note:', err.message));
});
