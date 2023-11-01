import React, { useState, useEffect } from 'react'
import Layout from '../Components/Layout/Layout'
import '../styles/productDetailsStyles.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Modal, Button } from 'antd';

import { Rate } from 'antd';
import toast from 'react-hot-toast'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Select } from 'antd';
import { useCart } from '../Context/Cart'
import { useAuth } from '../Context/Auth'
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const ProductDetails = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [auth] = useAuth();
    const [product, setProduct] = useState({})
    const [categoryName, setCategoryName] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState()
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null)
    const [cart, setCart] = useCart()
    const [inWishlist, setInWishlist] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    const reviewSubmitHandler = () => {
        if (rating !== 0 && comment !== '' && name !== '') {
            reviewSubmit(); // Proceed with review submission
            toast.success('Review Submitted Successfully');
            closeModal();
        } else {
            if (rating === 0) {
                toast.error('Please provide a rating');
            }
            if (comment === '') {
                toast.error('Please add a comment');
            }
            if (name === '') {
                toast.error('Please enter your name');
            }
        }
    };



    //get initial product
    useEffect(() => {
        if (params?.slug) {
            getProduct()
        }
    }, [params?.slug])

    //review submitting handler

    const reviewSubmit = async () => {
        try {
            const response = await axios.post(`/api/v1/product/add-review/${product.id}`, {
                name,
                rating,
                comment,
            });
            setName('');
            setRating(0);
            setComment('');
            closeModal();
            fetchReviews(); 

        } catch (error) {
            console.error('Error submitting review', error);
        }
    };

    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.data)
            getSimilarProducts(data?.data.id, data?.data.category)
        } catch (error) {
            console.log(error)
        }
    }
    // get category

    const getCategory = async () => {
        try {
            if (product.category) {
                const { data } = await axios.get(`/api/v1/category/single-categoryId/${product.category}`);
                setCategoryName(data.data.name);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Convert binary data to a data URL
    const convertBufferToDataURL = (buffer) => {
        const binary = new Uint8Array(buffer.data);
        const blob = new Blob([binary]);
        return URL.createObjectURL(blob);
    };

    //get all photos

    const getAllProductPhotos = async () => {
        try {
            const response = await axios.get(`/api/v1/product/photos/${product.id}`);

            const photos = response.data.photos;

            setPhotos(photos);
        } catch (error) {
            console.error('Error fetching product photos', error);
        }
    };

    useEffect(() => {
        if (product.id) {
            getAllProductPhotos();
        }
    }, [product.id]);



    useEffect(() => {
        getCategory()
    }, [product])


    //get similar product
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-products/${pid}/${cid}`)
            setRelatedProducts(data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    // fetch reviews

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/reviews/${product.id}`);
            setReviews(data?.reviews);

            const averageRating = data?.reviews[0]?.average_rating;
            setAverageRating(averageRating);
        } catch (error) {
            console.log(error);
        }
    };



    // Fetch reviews when the product is loaded
    useEffect(() => {
        if (product.id) {
            fetchReviews();
        }
    }, [product.id]);



    // Add a product to the user's wishlist
    const addToWishlist = async () => {
        const data = {
            ItemName: product.name,
            userId: auth.user ? auth.user.id : null,
            price: product.price,
            productId: product.id,
            slug: product.slug
        };

        try {
            const response = await axios.post('/api/v1/wishlist/add-to-wishlist', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setInWishlist(true);
                toast.success('Product added to the wishlist successfully');
            }
        } catch (error) {
            console.error('Error adding product to the wishlist', error);
            toast.error('Failed to add the product to the wishlist');
        }

    };

    //image container styles


    const handleMouseMove = (e) => {
        const image = e.target;
        const boundingRect = image.getBoundingClientRect();
        const offsetX = e.clientX - boundingRect.left;
        const offsetY = e.clientY - boundingRect.top;
        const imageWidth = image.offsetWidth;
        const imageHeight = image.offsetHeight;

        const zoomLevelX = (offsetX / imageWidth) * 100;
        const zoomLevelY = (offsetY / imageHeight) * 100;

        image.style.transformOrigin = `${zoomLevelX}% ${zoomLevelY}%`;
    };


    const resetZoom = (e) => {
        e.target.style.transformOrigin = '50% 50%'; 
    };

    return (
        <Layout>

            <div className='row container mt-2'>
                <div className='col-md-6'>
                    <Modal visible={modalImage !== null} onCancel={closeModal} footer={null}>
                        <img
                            src={modalImage}
                            alt="Zoomed Image"
                            style={{ width: '100%' }}
                            onClick={closeModal}
                        />
                    </Modal>

                    <Carousel showStatus={false} showThumbs={false}>
                        {photos && photos.map((photo) => (
                            <div key={photo.id} className='zoom-image' onMouseMove={handleMouseMove} onMouseOut={resetZoom}>

                                <img
                                    src={convertBufferToDataURL(photo.photo)}
                                    alt={`Product Image ${photo.id}`}
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>


                </div>
                <div className='col-md-6 product-details'>
                    <h1 className='product-title text-center'>{product.name}</h1>
                    <div className='product-info'>
                        <h6 className='product-info-item'>
                            <strong>Overall Rating:</strong>
                            {averageRating > 0 ? (
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={averageRating}
                                    style={{ fontSize: 20 }}
                                />
                            ) : (
                                <span>No ratings available</span>
                            )}
                        </h6>

                        <h6 className='product-info-item'>
                            <strong>Description:</strong> {product.description}
                        </h6>
                        <h6 className='product-info-item'>
                            <strong>Category:</strong> {categoryName}
                        </h6>
                        <h6 className='product-info-item'>
                            <strong>Price:</strong> ₹ {product.price}
                        </h6>
                        <h6 className='product-info-item'>
                            <strong>Quantity:</strong> {product.quantity} left in stock
                        </h6>

                    </div>
                    <button
                        className="btn btn-warning ms-1"
                        onClick={() => {
                            if (!selectedSize) {
                                toast.error("please select size of the shoe")
                                return;
                            }
                            const existingItem = cart.find((item) => item.id === product.id && item.size === selectedSize);

                            if (existingItem) {
                                toast.error('Item is already in the cart');
                            } else {
                                setCart([...cart, { ...product, size: selectedSize }]);
                                localStorage.setItem('cart', JSON.stringify([...cart, { ...product, size: selectedSize }]));
                                toast.success('Item Added To Cart');
                            }
                        }}
                    >
                        Add to Cart
                    </button>
                    <div>
                        <button className='add-to-cart-button mt-3' onClick={openModal}>Submit Review</button>
                    </div>
                    <button
                        className={`add-to-wishlist-button ${inWishlist ? 'added' : ''} mt-3`}
                        onClick={addToWishlist}
                        disabled={inWishlist}
                    >
                        {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                    </button>


                    <h4 className='text-center'>Select Size</h4>

                    <div className="shoe-sizes">
                        {product.sizes && product.sizes.map((size) => (
                            <button
                                key={size}
                                className={`shoe-size-button ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <div>
                    </div>
                </div>
            </div>

            <div className='similar-products'>
                <h3 >Similar Products</h3>
                {relatedProducts.length < 1 && <p className='text-center'>No similar Products Found</p>}
                <div className='row'>
                    {relatedProducts.map((p) => (
                        <div className="col-md-4 col-sm-6 col-12 mb-4" key={p.id}>
                            <div className="product-card card">
                                <img src={`/api/v1/product/get-photo/${p.id}`} alt="Product" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <p className="card-price">${p.price}</p>
                                    {p.quantity <= 0 ? (
                                        <p className="out-of-stock-message">Out of Stock</p>
                                    ) : (
                                        <button
                                            className="btn btn-warning ms-1"
                                            onClick={() => {
                                                window.scrollTo(0, 0);
                                                navigate(`/product/${p.slug}`);
                                            }}
                                        >
                                            More Details
                                        </button>

                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="user-reviews">
                    <h3>User Reviews</h3>
                    {reviews.length === 0 && <p>No reviews available for this product.</p>}
                    {reviews.map((review) => (
                        <div key={review.id} className="user-review-card">
                            <div className="user-review">
                                <div className="review-header">
                                    <strong>{review.name}</strong>
                                    <Rate disabled defaultValue={review.rating} />
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Modal
                    visible={modalIsOpen}
                    onCancel={closeModal}
                    title="Submit Review"
                    footer={[
                        <Button key="cancel" onClick={closeModal}>
                            Cancel
                        </Button>,
                        <Button className='btn btn-dark' key="submit" type="primary" onClick={reviewSubmitHandler} style={{ fontSize: '12px' }}>
                            Submit
                        </Button>,
                    ]}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} // Center the modal content
                >
                    <div style={{ textAlign: 'center' }}>
                        <h2>Submit Review</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    marginBottom: '10px',
                                    padding: '10px',
                                    width: '100%',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                }} // Add styles to the input
                            />
                        </div>
                        <Rate
                            name="productRating"
                            starCount={5}
                            value={rating}
                            onChange={(value) => setRating(value)}
                        />
                        <div>
                            <textarea
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}

                                style={{
                                    marginTop: '10px',
                                    padding: '10px',
                                    width: '100%',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                }}
                            ></textarea>
                        </div>
                    </div>
                </Modal>
            </div>

        </Layout>
    )
}

export default ProductDetails    
