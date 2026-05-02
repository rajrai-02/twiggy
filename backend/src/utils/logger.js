const ErrorLog = require('../models/ErrorLog');

const logError = async (service, error, payload = null) => {
  console.error(`[${service}] ERROR:`, error.message || error);
  
  try {
    await ErrorLog.create({
      service,
      message: error.message || String(error),
      stack: error.stack,
      payload
    });
  } catch (dbError) {
    console.error(`[Logger] Failed to save error to DB:`, dbError);
  }
};

module.exports = { logError };
