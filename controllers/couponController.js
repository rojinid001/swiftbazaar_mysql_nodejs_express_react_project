import Coupon from '../models/CouponModel.js';

// Create a new coupon
export const createCoupon = async (req, res) => {
  const { name, expiry, discount } = req.body;

  try {
    const newCoupon = await Coupon.create({ 
      name,
      expiry,
      discount,
    });

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();

    if (coupons) {
      return res.status(200).json({
        success: true,
        message: 'Coupons retrieved successfully',
        data: coupons,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No coupons found',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// Search for a coupon by name
export const searchCoupon = async (req, res) => {
  const { couponName } = req.params; 

  try {
    const coupon = await Coupon.findOne({
      where: { name: couponName }, 
    });

    if (coupon) {
      return res.status(200).json({
        success: true,
        message: 'Coupon retrieved successfully',
        data: coupon,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: 'No coupon found for the provided name', 
        data: null,
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



// Delete a coupon by name
export const deleteCoupon = async (req, res) => {
  const { couponName } = req.params;

  try {
    const deletedCoupon = await Coupon.destroy({
      where: { name: couponName },
    });

    if (deletedCoupon) {
      return res.status(200).send({
        success: true,
        message: 'Coupon deleted successfully',
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Coupon not found or could not be deleted',
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

//apply coupon

export const applyCoupon = async (req, res) => {
  const { couponCode, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({
      where: { name: couponCode },
    });

    if (coupon) {
      const currentDate = new Date();
      const expiryDate = new Date(coupon.expiry);

      if (currentDate > expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'Coupon has expired',
          data: null,
        });
      }
      const discount = coupon.discount;

      const numericCartTotal = parseFloat(cartTotal.replace(/[^0-9.-]+/g, ""));

      const DiscountAmount = numericCartTotal * (discount / 100);

      const newTotal = numericCartTotal - DiscountAmount;
      return res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          newTotal,
          DiscountAmount,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or invalid',
        data: null,
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








