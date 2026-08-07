const jwt = require('jsonwebtoken');
const { memoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'hams_hospital_super_secure_jwt_secret_key_2026';

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Locate user in store
    const user = memoryStore.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      hprId: user.hprId,
      abhaNumber: user.abhaNumber
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
};

// Middleware to authorize specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user ? req.user.role : 'GUEST'}' does not have sufficient permissions.`
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
  JWT_SECRET
};
