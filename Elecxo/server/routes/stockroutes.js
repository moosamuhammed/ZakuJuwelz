const express = require('express');
const { updateStock, setStock, getProductStock, getAllStocks } = require('../controllers/stockcontroller');
const router = express.Router();


router.patch('/updatestock/:id',updateStock);
router.put('/setstock/:id', setStock);
router.get('/productstock/:id', getProductStock);
router.get('/allstock', getAllStocks);

module.exports = router;
