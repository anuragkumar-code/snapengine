const fs = require('fs').promises;
const path = require('path');

const logError = async (error, context = '') => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${context}: ${error.stack || error.message}\n`;
  
  try {
    await fs.appendFile(
      path.join(__dirname, '../../logs/error.log'),
      logEntry
    );
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

module.exports = {
  logError
};