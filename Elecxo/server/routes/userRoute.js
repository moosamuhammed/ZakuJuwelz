const express = require('express');
const router = express.Router();
const {loginuser,register, adminLogin}=require('../controllers/userController');



router.post('/login',loginuser)
router.post('/register',register)


module.exports = router;