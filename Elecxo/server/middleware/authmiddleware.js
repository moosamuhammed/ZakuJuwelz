const jwt = require('jsonwebtoken');
require('dotenv/config') 

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token payload to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;