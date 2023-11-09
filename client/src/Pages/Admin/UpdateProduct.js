import React, { useState, useEffect } from "react";
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;


//image preview
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

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); 
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [sizes,setSizes]=useState([])
  const [photos,setPhotos]=useState([])
  const [id, setId] = useState("");

  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setName(data.data.name);
      setId(data.data.id);
      setDescription(data.data.description);
      setPrice(data.data.price);
      setPrice(data.data.price);
      setQuantity(data.data.quantity);
      setShipping(data.data.shipping);
      setCategory(data.data.category);   
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
  }, []);
  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) { 
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");  
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("quantity", quantity);
    productData.append("category", category);
    productData.append("sizes", sizes);

    for (let i = 0; i < photos.length; i++) {
      productData.append("photo", photos[i]); 
    }

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!price || isNaN(price)) {
      toast.error('Price must be a number');
      return;
    }
    if (!quantity || isNaN(quantity)) {
      toast.error('Quantity must be a number');
      return;
    }
    if (!category) {
      toast.error('Category is required');
      return;
    }
    if (sizes.length === 0) {
      toast.error('Sizes are required');
      return;
    }

    const { data } = axios.put(
      `/api/v1/product/update-product/${id}`,
      productData
    );
    if (data?.success) {
      toast.error(data?.message);
    } else {
      toast.success("Product Updated Successfully"); 
      navigate("/dashboard/admin/products");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


  //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );
      toast.success("Product DEleted Succfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong"); 
    } 
  };
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }} 
                value={category}
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
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}     
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
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
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping ? "yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;