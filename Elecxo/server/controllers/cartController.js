const cartModel = require('../models/cartmodel');
const productModel = require('../models/productmodel');
// const categoryModel = require('../models/categorymodels'); // not used, can remove

// ADD TO CART
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.userId;

  // Ensure user is authenticated
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Make sure quantity is a number
  const qty = Number(quantity);

  if (!productId || !qty || qty <= 0) {
    return res.status(400).json({ message: 'Invalid product ID or quantity' });
  }

  try {
    // Check if the product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create a cart for the current user
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new cartModel({
        user: userId,
        cartItems: [{ productId, quantity: qty }],
      });
    } else {
      // Check if the product is already in the cart
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update the quantity if the product already exists in the cart
        cart.cartItems[itemIndex].quantity += qty;
      } else {
        // Add new product to cartItems if not present
        cart.cartItems.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    await cart.populate('cartItems.productId'); // populate products if you want

    return res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error while updating the cart:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// DELETE CART ITEM
const deleteCartItem = async (req, res) => {
  const { id } = req.params; // can be cartItem _id OR productId
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    const cart = await cartModel.findOne({ user: userId });
    console.log(cart);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const beforeLen = cart.cartItems.length;

    // Remove any item whose _id OR productId matches the given id
    cart.cartItems = cart.cartItems.filter(
      (item) =>
        item._id.toString() !== id && item.productId.toString() !== id
    );

    if (cart.cartItems.length === beforeLen) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    await cart.populate('cartItems.productId');

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    console.error('Error while deleting cart item:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET CART
const getcart = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate({
        path: 'cartItems.productId',
        model: 'product', // change to 'Product' if that's your model name
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: null,
        message: 'Cart is empty',
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// UPDATE CART ITEM QUANTITY
const updateCartItemQuantity = async (req, res) => {
  const userId = req.user?.userId;
  const { itemId, quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const qty = Number(quantity);

  if (!itemId || !qty || qty <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid item ID or quantity" });
  }

  try {
    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Try to find by cartItem _id first
    let item = cart.cartItems.id(itemId);

    // If not found, fallback: maybe itemId is productId
    if (!item) {
      item = cart.cartItems.find(
        (ci) => ci.productId.toString() === itemId
      );
    }

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in cart" });
    }

    item.quantity = qty;

    await cart.save();
    await cart.populate("cartItems.productId");

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error while updating cart item quantity:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = { addToCart, deleteCartItem, getcart ,updateCartItemQuantity};
