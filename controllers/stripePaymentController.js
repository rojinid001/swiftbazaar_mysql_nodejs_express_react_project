import Stripe from 'stripe';
import OrderModel from '../models/orderModel.js';
import PDFDocument from 'pdfkit'
import transporter from '../helpers/mailer.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import fs from 'fs'




// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const stripePayment = async (req, res) => {
  try {
    const { products, successUrl, cancelUrl, userId, total, email,paymentMethod } = req.body; 

    let couponApplied = req.body.couponApplied; 

    const userEmail = email;  
    let unit_amount;

    const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);     

    let couponTotal=total;

    let totalAmountPaidByUser;

    if (couponApplied) {
      totalAmountPaidByUser = total; 
    } else {
      totalAmountPaidByUser = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    }
  
    const lineItems = products.map((product) => {

      if (couponApplied) {
        unit_amount = Math.ceil((total * 100) / totalQuantity);  
      } else {
        unit_amount = Math.ceil((product.price * 100));      
      }
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.photo],
          },
          unit_amount,
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({    
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    const order = await OrderModel.create({
      products: products,
      payment: session,
      buyer: userId, 
      totalAmountPaid: totalAmountPaidByUser,
    }); 
    sendOrderConfirmationEmail(userEmail, order.OrderId, products, couponTotal, couponApplied,paymentMethod);  
    res.json({ id: session.id, order });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Payment processing error" });   
  }
}; 

export const saveOrderDetails = async (req, res) => {
  try {
   
    const { products, total, userId, couponApplied, email,paymentMethod } = req.body;     
    const userEmail = email; 
    const  couponTotal=total 

    let totalAmountPaidByUser;

    if (couponApplied) {
      totalAmountPaidByUser = total; 
    } else {
      totalAmountPaidByUser = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    }


    const order = await Order.create({ 
      products: products,
      total: total,
      buyer: userId,  
      couponApplied: couponApplied,  
      payment_mode:paymentMethod,
      totalAmountPaid: totalAmountPaidByUser,
    });
    sendOrderConfirmationEmail(userEmail, order.OrderId, products, couponTotal, couponApplied,paymentMethod);   

    res.status(200).json({ message: 'Order saved successfully', order });

  } catch (error) {
    console.error('Error saving order details:', error);
    res.status(500).json({ error: 'Error saving order details' });   
  }
};


export const sendOrderConfirmationEmail = async (userEmail, orderId, products, couponTotal, couponApplied,paymentMethod) => {
  const subtotal = products.reduce((acc, product) => acc + product.quantity * product.price, 0);      
  
  async function getUserDetailsFromDatabase(id) {      
    try {
      const user = await User.findByPk(id, {    
        attributes: ['name', 'address'],
      });
      if (user) {
        console.log("User found:", user); 
        return user; 
      } else {
        console.log("User not found"); 
        return null; 
      }
    } catch (error) {
      console.error('Error retrieving user details:', error);
      throw error;
    }
  }
  
  const pdfFileName = `order_${orderId}.pdf`;  
  const pdfDoc = new PDFDocument();
  const pdfStream = fs.createWriteStream(pdfFileName);

  pdfDoc.pipe(pdfStream);

  try {
    const order = await Order.findByPk(orderId, {
      attributes: ['buyer'],
    });

    if (order) {
      const buyerId = order.buyer;
      const user = await getUserDetailsFromDatabase(buyerId);

      if (user) {
        pdfDoc.text(`Dear ${user.name}`);
        pdfDoc.text(`Shipping Address: ${user.address}`);
      } else {
        pdfDoc.text(`Dear Sir`);
      }
    } else {
      pdfDoc.text(`Order not found`);
    }
  } catch (error) {
    console.error('Error retrieving order:', error);
    pdfDoc.text(`Order not found`);
  }

  pdfDoc.text('We are thrilled to inform you that your order at SwiftBazaar has been successfully placed! Thank you for choosing us for your footwear needs.');
  pdfDoc.text(`Order ID: ${orderId}`);
  const currentDate = new Date().toLocaleDateString();
  pdfDoc.text(`Order Date: ${currentDate}`);

  pdfDoc.text('Here is a summary of the items you have ordered:');
  products.forEach((product, index) => {
    pdfDoc.text(`Product Name: ${product.name}`);
    pdfDoc.text(`Size: ${product.size}`);
    pdfDoc.text(`Quantity: ${product.quantity}`);
    pdfDoc.text(`Price: ₹${product.price}`);
  });
 
  if (couponApplied) {
    pdfDoc.text(`Subtotal: ₹${couponTotal}`); 
  } else {         
    pdfDoc.text(`Subtotal: ₹${subtotal}`);
  }
  pdfDoc.text(`Payment Method: ${paymentMethod}`);         

  pdfDoc.text('Your order will be processed and shipped with care. Once it\'s on its way, you will receive a tracking number to keep an eye on the delivery status.');
  pdfDoc.text('Please allow us some time to prepare your order for shipment. You will receive another email as soon as your order is dispatched.');

  pdfDoc.text('Should you have any questions or require assistance, please do not hesitate to reach out to our customer support team at [Customer Support Email] or [Customer Support Phone Number].');
  pdfDoc.text('We appreciate your trust in SwiftBazaar. We work diligently to ensure that you have the best shopping experience, and we can\'t wait for you to receive your new footwear.');

  pdfDoc.text('Thank you for being a part of the SwiftBazaar family. We look forward to serving you again in the future.');
  pdfDoc.text('Sincerely,');
  pdfDoc.text('Rojin');
  pdfDoc.text('Wherever you go, I am there - SwiftBazaar');
  pdfDoc.text('SwiftBazaar');
  pdfDoc.text('www.swiftbazaar.in');
  pdfDoc.text('Email: rojinid99@gmail.com');
  pdfDoc.text('Phone: 8971582431');
  pdfDoc.end();

  pdfStream.on('finish', () => {

 
    const mailOptions = {
      from: 'www.rojindevadaso2@gmail.com',
      to: userEmail,
      subject: 'Order Confirmation',
      text: `Thank you for your order!`,
      attachments: [
        { 
          filename: 'order-details.pdf', 
          path: pdfFileName,
        },
      ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
};



