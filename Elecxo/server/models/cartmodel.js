const mongoose=require('mongoose')
const { schema } = require('./usermodels')

const cartSchema= new mongoose.Schema ({
   user:{ref:'userModel' , type:mongoose.Schema.Types.ObjectId},
   cartItems:[
   { 
    productId:{ref:'product' , type:mongoose.Schema.Types.ObjectId},
    quantity:{type:Number,default: 1,}, 
    
}
   ]

}, { minimize: false})

const cartModel = mongoose.models.cart || mongoose.model('cart',cartSchema);

module.exports=cartModel