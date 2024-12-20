const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
  try {
    const dbUri = process.env.DB_URI;
    if (!dbUri) {
      throw new Error('DB_URI is not defined in the environment variables');
    }
    await mongoose.connect(dbUri);
    console.log('MongoDB connected...');
  } catch (err) {
    console.log('MongoDB connection failed');
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
