import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Select } from 'antd';
const { Option } = Select;

const ImagePreview = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mb-3 text-center">
      {Array.from(photos).map((photo, index) => (
        <img
          key={index}
          src={URL.createObjectURL(photo)}
          alt={`Product Image ${index + 1}`}
          height={'200px'}
          className='img img-responsive'
        />
      ))}
    </div>
  );
};


const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photos, setPhotos] = useState([]);
  const [sizes, setSizes] = useState([]);



  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        console.log("Categories:", data.data);
        setCategories(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in getting category');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("category", category);
      productData.append("sizes", sizes);
      
      // Append each selected file to the FormData object
      for (let i = 0; i < photos.length; i++) {
        productData.append("photo", photos[i]);
      }

      console.log("FormData Content:", Object.fromEntries(productData.entries()));

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");

      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Create Product-Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Create product</h1>
            <div className='m-1 w-75'>
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className='mb-3'>
                <label className='btn btn-outline-secondary col-md-12'>
                  Upload Images
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(e.target.files)}
                    hidden
                  />
                </label>
              </div>

              <ImagePreview photos={photos} />
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={sizes}
                  placeholder="Enter sizes (comma-separated)"
                  className="form-control"
                  onChange={(e) => setSizes(e.target.value)}
                />
              </div>
              <div className="mb-3">   
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
