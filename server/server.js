const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const userRoutes = require('./routes/userRoutes');
const dateRoutes = require('./routes/dateRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Environment variables
dotenv.config();

// Force production mode for Railway
if (process.env.RAILWAY_SERVICE_ID) {
  process.env.NODE_ENV = 'production';
}

console.log(`Setting up server in ${process.env.NODE_ENV || 'development'} mode`);

// Connect to database
const setupDatabase = async () => {
  try {
    // First try to connect
    await connectDB();
    
    // Only sync models (not force sync!) in development
    if (process.env.NODE_ENV === 'development') {
      const { sequelize } = require('./config/db');
      console.log('Syncing database tables in development mode...');
      await sequelize.sync({ alter: true });
      console.log('Database tables synchronized successfully');
    }
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
  credentials: true,
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/contacts', contactRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});