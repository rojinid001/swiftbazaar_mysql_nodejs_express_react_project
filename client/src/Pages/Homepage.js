import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/cardStyles.css';
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { prices } from '../Components/prices';
import { useCart } from '../Context/Cart';
import { RingLoader } from 'react-spinners';

const Homepage = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [banner, setBanners] = useState([]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProduct();
  }, []);

  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (page === 1) {
      return;
    }
    loadmore();
  }, [page]);

  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.data]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    } else {
      getAllProduct();
    }
  }, [checked, radio]);


  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/product/product-filter', { checked, radio });
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      console.error('Error filtering products:', error);
      setLoading(false);
      setProducts([]);
    }
  };
  //get banners

  const getAllBanners = async () => {
    try {
      const { data } = await axios.get('/api/v1/adminDashboardRoute/get-all-banner');
      setBanners(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBanners();
  }, []);

  const convertBufferToDataURL = (buffer) => {
    const binary = new Uint8Array(buffer.data);
    const blob = new Blob([binary]);
    return URL.createObjectURL(blob);
  };



  return (
    <Layout title={"All products-Best offers"}>
      {banner?.map((bannerItem) => (
        <img
          key={bannerItem.id}
          src={convertBufferToDataURL(bannerItem.banner)}
          className="banner-img"
          alt="bannerimage"
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
        />
      ))}

      <div className="row mt-3">
        <div className='col-md-2'>
          <h4 className='text-center'>Filter By Category</h4>
          <div className='d-flex flex-column checkbox-list'>
            {categories?.map(c => (
              <div className="checkbox-item" key={c.id}>
                <Checkbox onChange={(e) => handleFilter(e.target.checked, c.id)} />
                <span className="checkbox-label">{c.name}</span>
              </div>
            ))}
          </div>
          <h4 className='text-center mt-4'>Filter By Price</h4>
          <div className='d-flex flex-column checkbox-list'>
            <Radio.Group onChange={e => setRadio(e.target.value)}>
              {prices.map(p => (
                <div key={p.id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column checkbox-list'>
            <button className='btn btn-danger' onClick={() => window.location.reload()}>RESET FILTERS</button>
          </div>
        </div>
        <div className='col-md-9'>
          <h3 className='text-center'>All Products</h3>
          {loading ? (
            <div className="loader-container">
              <RingLoader color={"#123abc"} loading={loading} size={150} />
            </div>
          ) : (
            <>
              {products?.length > 0 ? (
                <div className='row'>
                  {products.map((p) => (
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={p.id}>
                      <div className="product-card card">
                        <img src={`/api/v1/product/get-photo/${p.id}`} alt="Product" className="card-img-top" />
                        <div className="card-body">
                          <h5 className="card-title">{p.name}</h5>
                          <p className="card-text">{p.description.substring(0, 30)}</p>
                          <p className="card-price">₹{p.price}</p>
                          {p.quantity >= 1 ? (
                            <>
                              <button className="btn btn-warning ms-1" onClick={() => navigate(`/product/${p.slug}`)}>
                                More Details
                              </button>

                            </>
                          ) : (
                            <p className="out-of-stock-text">Out of Stock</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-center'>No products found</p>
              )}
              <div className='m-2 p-3'>
                {products && products.length < total && (
                  <button className='btn btn-dark' onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}>
                    {loading ? "Loading" : 'Load More'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Homepage;






