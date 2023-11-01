import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import { Modal, Input, Button, Table, Popconfirm, message } from 'antd'; 
import axios from 'axios';
import "../../styles/adminStyles.css"

const UserReviews = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchProductId, setSearchProductId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]); 
    const [showAll, setShowAll] = useState(true); 


    const showModal = () => {
        setIsModalVisible(true);
    };

    // Function to handle search
    const handleSearch = () => {
      
        axios.get(`/api/v1/product/search-review/${searchProductId}`)
            .then(response => {
                setReviews(response.data.data);
                if (response.data.data.length === 0) {
                    message.info('No products available for the provided ID');
                }
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                message.error('Error fetching reviews');
            });

  
        setIsModalVisible(false);

        setShowAll(false);
    };

    // Function to handle review deletion
    const handleDeleteReview = (reviewId) => {
     
        axios.delete(`/api/v1/product/delete-review/${reviewId}`)
            .then(response => {
                setReviews(reviews.filter(review => review.id !== reviewId));
                message.success('Review deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting review:', error);
                message.error('Error deleting the review');
            });
    };

    useEffect(() => {
       
        axios.get('/api/v1/product/get-reviews')
            .then(response => {
                setAllReviews(response.data.data); 
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Average Rating',
            dataIndex: 'average_rating',
            key: 'average_rating',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to delete this review?"
                    onConfirm={() => handleDeleteReview(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button className="Review-delete-button" type="primary">Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Layout title="All users-Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All Reviews</h1>
                        <Button type="primary" onClick={showModal} className="search-button">
                            Search
                        </Button>
                        <Button type="primary" onClick={() => setShowAll(true)} className="show-all-button">
                            Show All Reviews
                        </Button>
                        <Table dataSource={showAll ? allReviews : reviews} columns={columns} className="responsive-table" />
                    </div>
                </div>
            </div>

            <Modal
                title="Search Product Reviews"
                visible={isModalVisible}
                onOk={handleSearch}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input
                    placeholder="Enter Product ID"
                    value={searchProductId}
                    onChange={(e) => setSearchProductId(e.target.value)}
                />
            </Modal>
        </Layout>
    );
};

export default UserReviews;   
