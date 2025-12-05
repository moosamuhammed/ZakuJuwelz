const express = require('express');
const router = express.Router();
const authMiddleware=require('../middleware/authmiddleware')


const {  addToCart, getcart, deleteCartItem, updateCartItemQuantity}=require('../controllers/cartController')

router.post('/addtocart', authMiddleware, addToCart);
router.delete('/delete/:id', authMiddleware, deleteCartItem);
router.get('/getcart', authMiddleware, getcart);
router.patch('/update', authMiddleware, updateCartItemQuantity);

module.exports=router