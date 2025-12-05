const mongoose=require('mongoose')

const  categorySchema = new mongoose.Schema({
    name: { type: String, required: true  },
    image: { type: String, required: true  },

}, { minimize: false })

const categoryModel = mongoose.models.category || mongoose.model('category',categorySchema);

module.exports=categoryModel