const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        console.log('Connecting to provided MONGO_URI with 8s timeout...');
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 8000,
          maxPoolSize: 25, // Prevents exceeding Atlas free tier connection limit
          minPoolSize: 2,  // Maintains warm connections for instant latency
          maxIdleTimeMS: 30000, // Closes idle connections after 30s to keep pool clean
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return;
      } catch (remoteErr) {
        if (process.env.NODE_ENV === 'production') {
          console.error(`FATAL: Remote MongoDB Atlas connection failed in production (${remoteErr.message}). Halting process to prevent dangerous data split-brain.`);
          process.exit(1);
        }
        console.warn(`Remote MONGO_URI failed (${remoteErr.message}). Falling back to local / in-memory database for local development...`);
      }
    }

    // Try connecting to default local mongodb
    try {
      console.log('Attempting connection to local mongodb://127.0.0.1:27017/pillowala...');
      await mongoose.connect('mongodb://127.0.0.1:27017/pillowala', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected to local instance: ${mongoose.connection.host}`);
      return;
    } catch (localErr) {
      console.log('Local MongoDB not available, falling back to embedded MongoMemoryServer for development...');
    }

    // Persistent embedded MongoDB database (survives restarts, saves all reviews & data)
    const fs = require('fs');
    const path = require('path');
    const persistentDbDir = path.join(__dirname, '../data/db');
    if (!fs.existsSync(persistentDbDir)) {
      fs.mkdirSync(persistentDbDir, { recursive: true });
    }

    mongod = await MongoMemoryServer.create({
      instance: {
        ip: '127.0.0.1',
        dbPath: persistentDbDir,
        storageEngine: 'wiredTiger',
      },
    });
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Persistent Database connected at ${mongoUri} (storage: backend/data/db)`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, closeDB };
