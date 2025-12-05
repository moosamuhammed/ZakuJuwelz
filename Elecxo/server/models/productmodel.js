const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true }, 
    details: { type: String, required: true },
    category: { ref: 'categoryModel', type: mongoose.Schema.Types.ObjectId },

    
    stock: {
        type: Number,
        required: true,
        default: 0,  
        min: 0       
    }

}, { minimize: false })

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

module.exports = productModel
