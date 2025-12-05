const productModel = require('../models/productmodel');


const updateStock = async (req, res) => {
    try {
        const { id } = req.params;            // product ID
        const { amount } = req.body;          // amount to add or subtract

        if (typeof amount !== 'number') {
            return res.status(400).json({ message: "Amount must be a number" });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const newStock = product.stock + amount;

        if (newStock < 0) {
            return res.status(400).json({ message: "Stock cannot go negative" });
        }

        product.stock = newStock;
        await product.save();

        res.status(200).json({ message: "Stock updated", stock: product.stock });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✔ Set stock to a specific value
const setStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }

        const product = await productModel.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Stock set successfully", product });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✔ Get stock of a specific product
const getProductStock = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id).select('name stock');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✔ Get stock for all products
const getAllStocks = async (req, res) => {
    try {
        const products = await productModel.find().select('name stock');

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports={updateStock,setStock,getProductStock,getAllStocks}