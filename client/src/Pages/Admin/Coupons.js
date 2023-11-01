import React, { useState, useEffect } from "react";
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import axios from "axios";
import { Modal, Button, Form, Input, DatePicker, InputNumber } from 'antd';
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 
    const [isAddCouponModalVisible, setIsAddCouponModalVisible] = useState(false); 

    const [couponName, setCouponName] = useState(null);
    const [addCouponForm] = Form.useForm();

    const handleDelete = (couponId) => {
        setCouponName(couponId); 
        setIsDeleteModalVisible(true); 
    };

    const handleAddCoupon = () => {
        setIsAddCouponModalVisible(true);
    };


    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/v1/coupon/delete-coupon/${couponName}`);
            toast.success("Coupon Deleted successfully");
            fetchCoupons();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleteModalVisible(false); 
        }
    };

    // Handle the submission of the add coupon form
    const handleAddCouponSubmit = async () => {
        try {
            const values = await addCouponForm.validateFields();
            await axios.post('/api/v1/coupon/create-coupon', values);
            toast.success("Coupon Added successfully");
            setIsAddCouponModalVisible(false); 
            fetchCoupons();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add the coupon");
        }
    };

    // Cancel the delete action
    const cancelDelete = () => {
        setCouponName(null); 
        setIsDeleteModalVisible(false);
    };

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/v1/coupon/get-coupon');

            if (data) {
                setCoupons(data.data);
            } 
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSearch = async () => {
        try {
            const { data } = await axios.get(`/api/v1/coupon/search-coupon/${searchTerm}`);


            if (data.success) {
                setCoupons([data.data]);
            } else {
                setCoupons([]); 
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Layout title="All Coupons - Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">  
                        <h1>All Coupons</h1>
                        <div className="mb-3" style={{ display: "flex", alignItems: "center" }}>
                            <Button
                                className="btn btn-info"
                                type="primary"
                                onClick={handleAddCoupon}
                            >
                                Add Coupon
                            </Button>
                            <div style={{ margin: "0 10px" }}></div> 
                           
                            
                        </div>
                        <input
                                type="text"
                                placeholder="Search by Coupon Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}  
                                style={{
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',   
                                }}
                            />
                        <button   
                                className="btn btn-success"
                                onClick={handleSearch}
                                style={{
                                    padding: '10px',
                                    borderRadius: '4px', 
                                }}
                            >
                                Search
                            </button>


                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Coupon Name</th>
                                    <th>Expiry Date</th>
                                    <th>Discount (%)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(coupons) && coupons.length > 0 ? (
                                    coupons.map((coupon) => (
                                        <tr key={coupon.id}>
                                            <td>{coupon.name}</td>
                                            <td>{coupon.expiry}</td>
                                            <td>{coupon.discount}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(coupon.name)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No coupons found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Delete confirmation modal */}
                        <Modal
                            title="Confirm Delete"
                            visible={isDeleteModalVisible}
                            onOk={confirmDelete}
                            onCancel={cancelDelete}
                        > 
                            <p>Are you sure you want to delete this coupon?</p> 
                        </Modal>

                        {/* Add coupon modal */}      
                        <Modal
                            title="Add Coupon"
                            visible={isAddCouponModalVisible}
                            onOk={handleAddCouponSubmit}
                            onCancel={() => setIsAddCouponModalVisible(false)}
                        >
                            <Form form={addCouponForm}>
                                <Form.Item
                                    name="name"
                                    label="Coupon Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter a coupon name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="expiry"
                                    label="Expiry Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select an expiry date!',
                                        },
                                    ]}
                                >
                                    <DatePicker format="YYYY-MM-DD" />
                                </Form.Item>

                                <Form.Item
                                    name="discount"
                                    label="Discount (%)"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            min: 0,
                                            message: 'Please enter a valid discount percentage!',
                                        },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Coupons;
