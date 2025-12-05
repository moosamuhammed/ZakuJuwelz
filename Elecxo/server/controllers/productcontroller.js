const categoryModel = require('../models/categorymodels');
const productModel = require('../models/productmodel');
const mongoose = require("mongoose");

// ADD CATEGORY
const addcategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("addcategory body:", req.body);

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

    const newcategory = await categoryModel.create({
      name,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newcategory
    });
  } catch (error) {
    console.log("Error in addcategory:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ADD PRODUCT
const addproduct = async (req, res) => {
  try {
    const { name, details, price, category, stock } = req.body;
    console.log("addproduct body:", { name, details, price, category, stock });

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!price) {
      return res.status(400).json({ success: false, message: "Price is required" });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    let parsedStock = 0;
    if (typeof stock !== "undefined") {
      parsedStock = Number(stock);
      if (Number.isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative number",
        });
      }
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

    const newProduct = await productModel.create({
      name,
      details,
      price,
      category,
      image: imageUrl,
      stock: parsedStock,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error in addproduct:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET ALL CATEGORIES
const getcategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.log("Error in getcategory:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET ALL PRODUCTS
const getproduct = async (req, res) => {
  try {
    const product = await productModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error in getproduct:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE PRODUCT
const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};

// ✅ GET PRODUCT BY ID (used in detail page)
const getproductbyid = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("getproductbyid ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("Found product:", product);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({ success: false, message: "Error getting product" });
  }
};

// EDIT PRODUCT
const editproduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Edit product ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const { name, price, details, category, stock } = req.body;
    console.log("Edit product body:", req.body);

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let imageUrl;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
    }

    if (name) product.name = name;
    if (details) product.details = details;
    if (typeof price !== "undefined") product.price = price;
    if (category) product.category = category;
    if (imageUrl) product.image = imageUrl;

    if (typeof stock !== "undefined") {
      const parsedStock = Number(stock);
      if (Number.isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative number",
        });
      }
      product.stock = parsedStock;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// GET /product/productbycategory/:id
const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getProductsByCategory → id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await productModel.find({ category: id });

    return res.status(200).json({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while loading category",
    });
  }
};

// SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  try {
    const qRaw = (req.query.search || req.query.q || "").trim();

    if (!qRaw || qRaw.length < 2) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    const escaped = qRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const products = await productModel
      .find({
        $or: [{ name: regex }, { details: regex }],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name && name !== category.name) {
      const existing = await categoryModel.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: "Category name already in use" });
      }
      category.name = name;
    }

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
      category.image = imageUrl;
    } else if (req.body.image) {
      category.image = req.body.image;
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error editing category:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for category id:", id);

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await categoryModel.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  addcategory,
  addproduct,
  getcategory,
  getproductbyid,
  deleteproduct,
  getproduct,
  editproduct,
  getProductsByCategory,
  searchProducts,
  editCategory,
  deleteCategory
};
