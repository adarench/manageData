const { sequelize } = require('../config/db');
const { User, Contact, Date } = require('../models');

// Function to initialize database
const initDatabase = async () => {
  try {
    console.log('Attempting to connect to database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync all models
    console.log('Creating database tables...');
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully!');
    
    // Create a test admin user
    console.log('Creating test admin user...');
    const adminUser = await User.create({
      displayName: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      weeklyQuota: 2,
      personalGoals: ['Improve dating life', 'Meet new people'],
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=random&color=fff'
    });
    
    console.log('Test admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
    // Exit process
    console.log('Database initialization complete. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase();