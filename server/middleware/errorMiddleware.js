const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error('Error caught by middleware:', err);
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
    console.log('Validation error:', message);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'The provided value is already in use';
    console.log('Unique constraint error:', err.errors);
  }
  
  // Handle database connection errors
  if (err.name === 'SequelizeConnectionError' || 
      err.name === 'SequelizeConnectionRefusedError' ||
      err.name === 'SequelizeHostNotFoundError' ||
      err.name === 'SequelizeAccessDeniedError') {
    statusCode = 500;
    message = 'Database connection issue. Please try again later.';
    console.error('Database connection error:', err);
  }

  res.status(statusCode).json({
    message,
    error: err.name,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };