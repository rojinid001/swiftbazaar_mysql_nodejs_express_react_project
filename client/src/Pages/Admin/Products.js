import React, { useEffect, useState } from 'react';
import AdminMenu from '../../Components/Layout/AdminMenu';
import Layout from '../../Components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/get-product');
            setProducts(data.data);
            console.log("Data received from the database in 1st index", data.data);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting products");
        }
    }

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <Layout title="All users-Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>All products</h1>
                        <div className='row'>
                            {products.map((p) => (
                                <div className="col-md-4 mb-4" key={p.id}>
                                    <Link key={p.id} to={`/dashboard/admin/${p.slug}`} className='product-link'>
                                        <div className="card product-card">
                                            <img src={`/api/v1/product/get-photo/${p.id}`} alt="Product" />
                                            <div className="card-body">
                                                <h5 className="card-title">{p.name}</h5>
                                                <p className="card-text">{p.description}</p>
                                                <p className="card-text">₹{p.price}</p>
                                                <p className="card-text">Quantity: {p.quantity}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Products; 

