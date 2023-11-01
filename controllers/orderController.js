import Order from '../models/orderModel.js'; 
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

export const getOrdersController = async (req, res) => {
  try {
    const userId = req.user.userId; 

    const orders = await Order.findAll({
      where: { buyer: userId }, 
      attributes: ['products', 'payment', 'buyer', 'status'], 
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while getting orders',
      error: error.message,
    });
  }
};

const fetchUserNames = async (orders) => {
  const userNames = {};

  for (const order of orders) { 
    try {
      const user = await User.findOne({
        where: { id: order.buyer }, 
        attributes: ['name'],
      });

      if (user) {
        userNames[order.buyer] = user.name;
      } else {
        userNames[order.buyer] = 'Unknown User'; 
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      userNames[order.buyer] = 'Unknown User'; 
    }
  }

  return userNames;
};


const fetchUserAddresses = async (orders) => {
  const userAddresses = {};

  for (const order of orders) {
    try {
      const user = await User.findOne({
        where: { id: order.buyer },
        attributes: ['address'],
      });

      if (user) {
        userAddresses[order.buyer] = user.address;
      } else {
        userAddresses[order.buyer] = 'Unknown Address'; 
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
      userAddresses[order.buyer] = 'Unknown Address'; 
    }
  }

  return userAddresses;
};

//get all orders

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ['OrderId', 'products', 'payment', 'buyer','totalAmountPaid', 'status','payment_mode', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
    });

    const userNames = await fetchUserNames(orders);

    const userAddresses = await fetchUserAddresses(orders);

    const ordersWithUserDetails = orders.map((order) => ({
      ...order.toJSON(),
      buyerName: userNames[order.buyer],
      buyerAddress: userAddresses[order.buyer],
    }));

    res.json(ordersWithUserDetails);
  } catch (error) {
    console.error('Error fetching orders:', error); 
    res.status(500).json({
      success: false,
      message: 'Error while getting orders',
      error: error.message,
    });
  }
};



//update order status

export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.update(
      { status },
      { where: { OrderId: orderId } }
    ); 

    if (status === 'Shipped') {
      const order = await Order.findOne({
        attributes: ['products'],
        where: { OrderId: orderId }
      });
    
      if (order && order.products && Array.isArray(order.products)) {
        for (const product of order.products) {
          const productId = product.id;
          const orderedQuantity = product.quantity;
  
          await Product.decrement('quantity', {
            by: orderedQuantity,
            where: { id: productId }
          });
        }
      }
    }
    res.json(updatedOrder); 
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while updating order status',    
      error: error.message, 
    });
  }
};

//delete order

export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.destroy({
      where: { OrderId: orderId },
    });

    if (deletedOrder > 0) {
      res.json({
        success: true,
        message: 'Order deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found or already deleted',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while deleting the order',
      error: error.message,
    });
  }
};


export const searchOrderController = async (req, res) => {
  try {
    const { searchOrderId } = req.params;

    if (!searchOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Order ID for the search.',
      });
    }

    const orders = await Order.findAll({
      where: { OrderId: searchOrderId },
      attributes: [
        'OrderId',
        'products',
        'payment',
        'totalAmountPaid',
        'payment_mode',
        'buyer',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for the provided Order ID.',
      });
    }

    const userNames = await fetchUserNames(orders);
    const userAddresses = await fetchUserAddresses(orders);
    const ordersWithUserDetails = orders.map((order) => ({
      ...order.toJSON(),
      buyerName: userNames[order.buyer],
      buyerAddress: userAddresses[order.buyer],
    }));

    res.json(ordersWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while searching for orders by Order ID',
      error: error.message,
    });
  }
};


//order status

// export const orderStatus= async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     // Use Sequelize to update the order status
//     const updatedOrder = await Order.update(
//       { status },
//       { where: { OrderId: orderId } }
//     );
//     res.json(updatedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Error while updating order status',
//       error: error.message,
//     });
//   }
// };


