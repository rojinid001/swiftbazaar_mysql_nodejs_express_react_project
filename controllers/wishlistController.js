import Wishlist from '../models/wishlistModel.js';

export const addItemToWishlist = async (req, res) => {
  try {
    const { ItemName, userId,price,productId,slug } = req.body

    const wishlistItem = await Wishlist.create({
      ItemName,
      userId,
      price,
      productId,
      slug
    });

    return res.status(201).json({
      success: true,
      message: 'Item added to the wishlist successfully',   
      data: wishlistItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// Function to remove an item from a user's wishlist
export const removeItemFromWishlist = async (req, res) => { 
  try {
    const { itemId } = req.params; 
    const deletedItem = await Wishlist.destroy({
      where: { id: itemId },
    });

    if (deletedItem) {
      return res.status(200).json({
        success: true,
        message: 'Item removed from the wishlist successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Item not found in the wishlist or could not be removed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// get wishlist items

export const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      attributes: ['ItemName', 'id', 'price', 'productId','slug'], 
    });

    if (wishlistItems.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist items retrieved successfully',
        data: wishlistItems,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found or has no wishlist items',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
