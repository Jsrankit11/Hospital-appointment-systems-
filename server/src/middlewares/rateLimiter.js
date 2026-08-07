const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Rate limit exceeded, please try again shortly.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after a brief pause.'
  }
});

const errorHandler = (err, req, res, next) => {
  console.error('❌ [SERVER ERROR]:', err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error encountered in HAMS gateway.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  errorHandler
};
