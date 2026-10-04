require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const offerRoutes = require('./routes/offerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const luckyDrawRoutes = require('./routes/luckyDrawRoutes');

const app = express();

// Connect to MongoDB & auto-seed if fresh development database
const Product = require('./models/Product');
const Category = require('./models/Category');
const { seedData } = require('./seeds/seed');

connectDB().then(async () => {
  try {
    const productCount = await Product.countDocuments();
    const rootCatCount = await Category.countDocuments({ parentCategory: 'root' });
    if (productCount === 0 || rootCatCount === 0) {
      console.log('Detected unseeded master categories or empty database. Running automatic seed...');
      await seedData();
    }
  } catch (seedErr) {
    console.warn('Auto-seed check warning:', seedErr.message);
  }
});

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration: allow frontend & admin origins
const allowedOrigins = [
  'http://localhost:5180',
  'http://localhost:5181',
  'http://127.0.0.1:5180',
  'http://127.0.0.1:5181',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like mobile apps, curl, or same-origin
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Lightweight Ping & Health endpoints (placed before rate limiter so monitoring bots & pre-warmup never hit rate limits)
app.get('/api/ping', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).send('pong');
});

app.head('/api/ping', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).end();
});

app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Pillowala API Server',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/ready', (req, res) => {
  const mongoose = require('mongoose');
  const dbConnected = mongoose.connection.readyState === 1;
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  if (dbConnected) {
    return res.status(200).json({
      status: 'ready',
      database: 'connected',
      host: mongoose.connection.host,
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(503).json({
    status: 'unready',
    database: 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// General API rate limiter
app.use('/api', apiLimiter);

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/luckydraw', luckyDrawRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Pillowala API running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
});

module.exports = app;
