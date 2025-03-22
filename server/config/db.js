const { Sequelize } = require('sequelize');
require('dotenv').config();

// Print database connection debug info
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);

// Always use SSL in Railway environment
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/dating_app',
  {
    dialect: 'postgres',
    dialectOptions: {
      // Always use SSL when DATABASE_URL is provided (Railway case)
      ssl: process.env.DATABASE_URL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false
  }
);

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