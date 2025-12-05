// routes/adminroutes.js
const express = require('express');
const {
  fetchcustomers,
  adminSignup,
  adminLogin,
} = require('../controllers/admincontroller');
const adminAuth = require('../middleware/adminauth');

const router = express.Router();

router.get('/fetchusers', adminAuth, fetchcustomers); 

router.post('/login', adminLogin);

module.exports = router;
