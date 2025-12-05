const cartModel = require("../models/cartmodel");
const productsModel = require("../models/productmodel");
const orderModel = require("../models/ordermodel");

exports.updateCartItem = async (userId, productId, quantity) => {
  if (quantity <= 0) throw new Error("Quantity must be greater than 0");

  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );
  if (!item) throw new Error("Item not found in cart");

  item.quantity = quantity;
  await cart.save();

  return cart;
};
exports.deleteCartItem = async (userId, productId) => {
  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart;
};
exports.clearCart = async (userId) => {
  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  cart.items = [];
  await cart.save();
  return { message: "Cart cleared successfully" };
};


exports.getCartByUser = async (userId) => {
  const cart = await cartModel.findOne({ userId });
  return cart;
};

exports.removeFromCart = async ({ userId, productId }) => {
  const cart = await cartModel.findOne({ userId });
  if (!cart) return null;

  const item = cart.items.find(i => i.productId.toString()=== productId);

  if (!item) return cart;

  if (item.quantity > 1) {
    item.quantity -= 1; 
  } else {
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
  }

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();
  return cart;
};



const mongoose = require("mongoose");


exports.addToCart = async ({ userId, productId, name, price, image }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const product = await productsModel.findById(productId);
  if (!product) throw new Error("Product not found in database");

  let cart = await cartModel.findOne({ userId });
  if (!cart) {
    cart = new cartModel({ userId, items: [], totalAmount: 0 });
  }

  const existingItem = cart.items.find(
    (i) => i.productId?.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();
  return cart;
};