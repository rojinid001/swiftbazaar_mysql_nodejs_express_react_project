import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Modal, Input, Upload, Button } from 'antd';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bannerId, setBannerId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const fetchBanners = async () => {
        try {
            const { data } = await axios.get('/api/v1/adminDashboardRoute/get-all-banner');
            setBanners(data.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleDelete = async (bannerId) => {
        try {
            await axios.delete(`/api/v1/adminDashboardRoute/delete-banner/${bannerId}`);
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const handleUpdate = (bannerId) => {
        setBannerId(bannerId);
        setIsModalVisible(true);
    };

    const handleUpdateBanner = async () => {
        if (!name || !description || !file) {
            toast.error("Please fill in all fields and select a banner image.");
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('banner', file);
    
        try {
            await axios.put(`/api/v1/adminDashboardRoute/update-banner/${bannerId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            toast.success("Banner updated successfully");
    
            fetchBanners();
            setIsModalVisible(false);
    
            // Reset modal input fields
            setName('');
            setDescription('');
            setFile(null);
        } catch (error) {
            console.error('Error updating banner:', error);
        }
    };
    
    

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <Layout title="Banners - Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Banners</h1>
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Banner Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map((banner) => (
                                        <tr key={banner.id}>
                                            <td>{banner.id}</td>
                                            <td>{banner.name}</td>
                                            <td>{banner.description}</td>
                                            <td>
                                                <img
                                                    src={URL.createObjectURL(new Blob([new Uint8Array(banner.banner.data)]))}
                                                    alt={banner.name}
                                                    style={{ width: '200px', height: 'auto' }}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-warning mx-2" onClick={() => handleUpdate(banner.id)}>
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Update Banner"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdateBanner}>
                        Update
                    </Button>,
                ]}
            >
                <Input
                    className='mb-3'
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    className='mb-3'
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Upload beforeUpload={(file) => setFile(file)} showUploadList={false}>
                    <Button>Select Banner</Button>
                </Upload>
            </Modal>
        </Layout>
    );
};

export default Banners;


// src={convertBufferToData\URL(bannerItem.banner)}
