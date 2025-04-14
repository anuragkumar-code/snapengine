const jwt = require('jsonwebtoken');
const sessionModel = require('../models/session');
const { logError } = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await sessionModel.findSessionByToken(token);
    if (!session) {
      return res.status(401).json({ message: 'Session invalid or expired' });
    }


    req.user = decoded;
    next();
    
  } catch (error) {
    await logError(error, 'Auth middleware');
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;