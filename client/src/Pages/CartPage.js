import React, { useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { useCart } from '../Context/Cart';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';


import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [newTotal, setNewTotal] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');


  const [productQuantity, setproductQuantity] = useState()
  const [isLoading, setIsLoading] = useState(false);



  const handleIncreaseQuantity = async (pid) => {
    // Make an API request to get the product's quantity
    try {
      const response = await axios.get(`/api/v1/product/product-quantity/${pid}`);
      const productQuantity = response.data.data.quantity;

      setproductQuantity(productQuantity)

      const cartItem = cart.find((item) => item.id === pid);

      if (cartItem) {
        if (cartItem.quantity < productQuantity) {
          const updatedCart = cart.map((item) => {
            if (item.id === pid) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });
          setCart(updatedCart);
        } else {

          console.log("Quantity limit reached");
        }
      }
    } catch (error) {
      console.error('Error fetching product quantity:', error);
    }
  };


  const handleDecreaseQuantity = (pid) => {
    const updatedCart = cart.map((item) => {
      if (item.id === pid) {
        const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const formattedPrice = totalPrice.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
    return formattedPrice;
  };

  const removeCartItem = (pid) => {
    try {
      if (auth?.token) {
        let myCart = [...cart];
        let index = myCart.findIndex((item) => item.id === pid);
        if (index !== -1) {
          myCart.splice(index, 1);
          setCart(myCart);
          localStorage.setItem('cart', JSON.stringify(myCart));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const containerStyle = {
    padding: '20px',
  };

  const headerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'center',
  };

  const cartItemStyle = {
    display: 'flex',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const imageStyle = {
    width: '100px',
    height: '100px',
  };
  const makePayment = async () => {
    try {
      setIsLoading(true);
      if (selectedPaymentMethod === "online") {
        const stripe = await loadStripe("pk_test_51NyDCdSBNFN8eX03l234KgyRmnpByp546y3tgKPadC8OmTDsuua6zC8hKIk9iNImuziuvtIcWcJK8HOSkM4tEXTw0006CFW5kV");
        const body = {
          products: cart,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
          userId: auth.user.id,
          total: newTotal,
          email: auth.user.email,
          couponApplied: couponApplied,
          paymentMethod: selectedPaymentMethod,
        };
  
        const headers = {
          "Content-Type": "application/json",
        };
  
        const response = await axios.post("/api/v1/payment/create-checkout-session", body, {
          headers: headers,
        });
  
        const result = stripe.redirectToCheckout({
          sessionId: response.data.id,
        });
  
        if (result.error) {
          console.log(result.error);
        } else {
          localStorage.removeItem("cart");
        }
      } else if (selectedPaymentMethod === "cod") {
       
        const body = {
          products: cart,
          userId: auth.user.id,
          total: newTotal,
          email: auth.user.email,
          couponApplied: couponApplied,
          paymentMethod: selectedPaymentMethod,
        };
        const headers = {
          "Content-Type": "application/json",
        };
        const orderResponse = await axios.post("/api/v1/payment/create-order", body, {
          headers: headers,
        });
        if (orderResponse.status === 200) {
          console.log("Order details saved aan mone:", orderResponse.data); 
          localStorage.removeItem("cart");
          window.location.href = `${window.location.origin}/success`;
        } else {
          console.error("Failed to save order details"); 
        }
      }
    } catch (error) {
      setIsLoading(false); 
      console.error("Error making payment:", error);
    }
  };
  

  // apply coupon  
  const applyCoupon = async () => {
  try {
    if (couponCode) {
      const response = await axios.post('/api/v1/coupon/apply-coupon', {
        couponCode,
        cartTotal: getTotalPrice(),
      });

      if (response.data && response.data.message === 'Coupon has expired') {
        toast.error('Coupon has expired or is invalid');
        setDiscount(0);
        setNewTotal(0);
        setCouponApplied(false);
      } else if (response.data && response.data.data) {
        console.log("This is response data", response.data.message);
        const appliedDiscount = response.data.data.DiscountAmount;
        const newTotal = response.data.data.newTotal;

        setDiscount(appliedDiscount);
        setNewTotal(newTotal);
        setCouponApplied(true);
      } else {
        setDiscount(0);
        setNewTotal(0);
        setCouponApplied(false);
      }
    } else {
      setDiscount(0);
      setNewTotal(0);
      setCouponApplied(false);
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
  }
};

  return (
    <Layout>
      <div className='container' style={containerStyle}>  
        <div className='row'>
          <div className='col-md-12'>
            <h1 className='text-center bg-light p-2 mb-1'>
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className='text-center bg-light p-2 mb-1'>
              {cart?.length > 1 ? (
                `You have ${cart.length} items in your cart ${auth?.token ? '' : 'Please login to Continue'
                }`
              ) : (
                'Your cart is empty'
              )}
            </h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-9'>
            {cart?.map((p) => (
              <div key={p.id} className='row m-2 card p-3 flex-row' style={cartItemStyle}>
                <div className='col-md-4'>
                  <img
                    src={`/api/v1/product/get-photo/${p.id}`}
                    alt='Product'
                    width='100px'
                    height='100px'
                    style={imageStyle}
                  />
                </div>
                <div className='col-md-8'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h4>{p.name}</h4>
                    <button className='btn btn-danger btn-sm' onClick={() => removeCartItem(p.id)}>Remove</button>
                  </div>
                  <p>{p.description.substring(0, 30)}</p>
                  <h5>Price: ₹{p.price}</h5>
                  <h5 className='mb-0'> {p.size}</h5>
                  <div className='d-flex align-items-center'>

                    <button
                      className='btn btn-secondary me-2'
                      onClick={() => handleDecreaseQuantity(p.id)}
                    >
                      -
                    </button>
                    <p className='mb-0'>Quantity: {p.quantity}</p>
                    {p.quantity < 100 && (
                      <button
                        className='btn btn-secondary ms-2'
                        onClick={() => handleIncreaseQuantity(p.id)}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='col-md-3'>
            {cart?.length > 0 && (
              <div>
                <h3>Cart Summary</h3>
                <div className='bg-light p-3'>
                  <p>Total | Checkout | Payment</p>
                  <h5 className='mb-3'>Total Price:{discount > 0 ? newTotal : getTotalPrice()}</h5>
                  <div style={{ marginBottom: '20px' }}>
                    <h5 className='mb-2 text-danger'>Have a Coupon Code?</h5>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type='text'
                          placeholder='Enter Coupon Code (Optional)'
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          style={{
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '100%',
                          }}
                        />
                      </div>
                      <button className='btn btn-primary' onClick={applyCoupon}>
                        Apply Coupon
                      </button>

                      <div>
                      </div>

                    </div>
                    <h5 className='mb-3'>Discount: {discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h5>

                    <div>
                      <h5>Payment Method:</h5>
                      <label>
                        <input
                          type="radio"
                          value="online" 
                          checked={selectedPaymentMethod === 'online'}
                          onChange={() => setSelectedPaymentMethod('online')}
                        />
                        Online Payment
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="cod"
                          checked={selectedPaymentMethod === 'cod'}
                          onChange={() => setSelectedPaymentMethod('cod')}
                        />
                        Cash on Delivery (COD)
                      </label>
                    </div>

                  </div>
                  {auth?.user?.address ? (
                    <>
                      <div className="mb-3">
                        <h4>Current Address</h4>
                        <h5>{auth?.user?.address}</h5> 
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => navigate("/dashboard/user/profile")}
                        >
                          Update Address
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mb-3">
                      {auth?.token ? (
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => navigate("/dashboard/user/profile")}
                        >
                          Update Address
                        </button>
                      ) : (
                        <button className='btn btn-primary w-100' onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }>
                          Please Login to checkout
                        </button>
                      )}
                    </div>
                  )}
                  {auth?.token && (
                   <button
                   className={`btn btn-primary w-100 ${selectedPaymentMethod === 'cod' ? 'place-order' : ''}`}
                   onClick={makePayment}
                 >
                   {isLoading ? (
                     <div>
                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                       Loading...
                     </div>
                   ) : (
                     selectedPaymentMethod === 'cod' ? 'Place Order' : 'Checkout'
                   )}
                 </button>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;


// const makePayment = async () => {
//   const stripe = await loadStripe("pk_test_51NyDCdSBNFN8eX03l234KgyRmnpByp546y3tgKPadC8OmTDsuua6zC8hKIk9iNImuziuvtIcWcJK8HOSkM4tEXTw0006CFW5kV");

//   try {
//     const body = {
//       products: cart,
//       successUrl: `${window.location.origin}/success`,
//       cancelUrl: `${window.location.origin}/cancel`,
//       userId: auth.user.id,
//       total: newTotal,
//       email: auth.user.email,
//       couponApplied: couponApplied,
//     };

//     const headers = {
//       "Content-Type": "application/json",
//     };

//     const response = await axios.post("/api/v1/payment/create-checkout-session", body, {
//       headers: headers,
//     });

//     const result = stripe.redirectToCheckout({
//       sessionId: response.data.id,
//     });

//     if (result.error) {
//       console.log(result.error);
//     } else {
//       localStorage.removeItem("cart");
//     }
//   } catch (error) {
//     console.error("Error making payment:", error);
//   }
// };