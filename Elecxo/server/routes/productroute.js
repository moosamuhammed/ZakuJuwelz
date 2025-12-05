const express = require('express');
const upload = require('../config/multerconfig');
const {
  addcategory,
  addproduct,
  getcategory,
  getproduct,
  deleteproduct,
  editproduct,
  getProductsByCategory,
  getproductbyid,
  searchProducts,
  editCategory,
  deleteCategory
} = require('../controllers/productcontroller');

const router = express.Router();

router.post('/catogary/add', upload.single('image'), addcategory);
router.post('/add', upload.single('image'), addproduct);
router.get('/getcategory', getcategory);
router.get('/getproduct', getproduct);
router.delete('/deleteproduct/:id', deleteproduct);
router.put('/editproduct/:id', upload.single('image'), editproduct);
router.get("/getproduct/:id", getproductbyid);
router.put('/editcategory/:id', upload.single('image'), editCategory)
router.delete('/deletecategory/:id',deleteCategory)

router.get('/productbycategory/:id', getProductsByCategory);
router.get("/search", searchProducts);

module.exports = router;
