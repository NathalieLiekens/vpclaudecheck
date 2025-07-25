const handleError = (res, error, statusCode = 500) => {
  console.error('[ERROR]', error.message, error.stack);
  res.status(statusCode).json({
    error: error.message || 'Internal Server Error',
    details: error.message,
  });
};

module.exports = { handleError };