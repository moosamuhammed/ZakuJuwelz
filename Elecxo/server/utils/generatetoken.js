// const jwt = require('jsonwebtoken');
// require('dotenv/config') 

// const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '1d') => {
//   return jwt.sign(payload, secret, { expiresIn });
// };

// module.exports = generateToken;

// utils/generatetoken.js
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = generateToken;
