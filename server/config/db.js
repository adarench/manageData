const { Sequelize } = require('sequelize');
require('dotenv').config();

// Debug logging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  // Print first few chars for debugging while hiding credentials
  const safeUrl = process.env.DATABASE_URL.substring(0, 20) + '...';
  console.log('DATABASE_URL preview:', safeUrl);
}

let sequelize;

try {
  // Explicitly create a new connection using DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('Creating Sequelize instance with DATABASE_URL');
    
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    });
  } else {
    console.log('Creating Sequelize instance with local config');
    
    sequelize = new Sequelize('dating_app', 'postgres', 'postgres', {
      host: 'localhost',
      dialect: 'postgres',
      logging: false
    });
  }
} catch (error) {
  console.error('Failed to create Sequelize instance:', error);
  throw error;
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      // Sync models in development mode
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };