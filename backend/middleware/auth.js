const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'secretkey'; // use env variable in production

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id); // Changed from userId to id to match auth routes
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

const checkBaseAccess = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'logistics_officer') {
    return next();
  }

  // Base commanders can only access their assigned base
  const baseParam = req.body.baseName || req.body.sourceBase || req.body.destinationBase;
  if (baseParam && baseParam !== req.user.assignedBase) {
    return res.status(403).json({ message: 'Access denied to this base' });
  }

  next();
};

module.exports = {
  verifyToken,
  checkRole,
  checkBaseAccess,
  JWT_SECRET
}; 