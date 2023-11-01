import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/Auth';
import toast from 'react-hot-toast';
import { RingLoader } from 'react-spinners';

const Wishlist = () => {
  const [auth] = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistItems = async () => {
    try {
      const userId = auth.user ? auth.user.id : null;
      const response = await axios.get(`/api/v1/wishlist/get-wishlist/${userId}`);
      setWishlistItems(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist items', error);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await axios.delete(`/api/v1/wishlist/remove-from-wishlist/${itemId}`);

      if (response.status === 200) {
        setWishlistItems((items) => items.filter((item) => item.id !== itemId));
        toast.success("Item removed from Wishlist");
      }
    } catch (error) {
      console.error('Error removing item from wishlist', error);
    }
  };

  return (
    <Layout title="Wishlist-Dashboard">
      <div className="container-fluid m-3 p-3">
        <h1 className="title text-center">Wishlist</h1>
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="wishlist-container">
              {loading ? (
                <div className="loader-container">
                  <RingLoader color={"#123abc"} loading={loading} size={150} />
                </div>
              ) : (
                wishlistItems?.length === 0 ? (
                  <p className="text-center">Your wishlist is empty.</p>
                ) : (
                  <div className="wishlist-items">
                    {wishlistItems?.map((item) => (
                      <div className="wishlist-item mt-3" key={item.id}>
                        <div className="wishlist-item-details">
                          <div className="product-details">
                            <Link to={`/product/${item.slug}`} style={{ color: 'black', textDecoration: 'none' }}>
                              <img
                                src={`/api/v1/product/get-photo/${item.productId}`}
                                alt="Product"
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '100px',
                                  objectFit: 'contain',
                                }}
                                className="wishlist-item-image"
                              />
                              <div className="text-details">
                                <h5>{item.ItemName}</h5>
                                <p className="item-price">Price: ₹{item.price}</p>
                              </div>
                            </Link>
                          </div>
                          <button
                            className="remove-from-wishlist-button"
                            onClick={() => removeFromWishlist(item.id)}
                            style={{
                              backgroundColor: '#ff0000',
                              color: '#fff',
                              padding: '5px 8px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
