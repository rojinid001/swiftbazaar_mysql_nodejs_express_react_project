import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminMenu from '../../Components/Layout/AdminMenu';
import { useAuth } from '../../Context/Auth';
import moment from 'moment';
import { Select, Button, Input, Spin } from 'antd';
import '../../styles/adminStyles.css';
import Layout from '../../Components/Layout/Layout';

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    'Not Process',
    'Processing',
    'Shipped',
    'delivered',
    'cancel',
  ]);
  const [changeStatus, setChangeStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // State variable for searching

  const getOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/v1/auth/all-orders');
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/product/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const { data } = await axios.delete(`/api/v1/product/delete-order/${orderId}`);
      if (data.success) {
        toast.success('Order deleted successfully');
        getOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while deleting the order');
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true); // Set searching to true while searching
      const { data } = await axios.get(`/api/v1/product/search-order/${searchOrderId}`);
      setOrders(data);
      setIsSearching(false); // Set searching to false when the search is completed
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while searching for the order');
      setIsSearching(false); // Set searching to false on error
    }
  };

  return (
    <Layout title="All users-Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Orders</h1>
            <div className="search-bar">
              <Input
                placeholder="Search by Order ID"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <Button className='btn btn-info mb-3' type="primary" onClick={handleSearch}  style={{ fontSize: '13px' }}>
                {isSearching ? ( // Display a loader when searching
                  <Spin size="small" />
                ) : (
                  'Search'
                )}
                
              </Button>
            </div>
            <Button
            className='btn btn-warning'
              type="primary"
              onClick={() => {
                setShowAllOrders(true);
                getOrders();
              }}
              style={{ fontSize: '13px' }}
            >
              Show All Orders
            </Button>
            {isLoading ? (
              <div className="spinner">
                <Spin size="large" />
              </div>
            ) : (
              orders?.map((o, i) => (
                <div className="border shadow" key={o.OrderId}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Amount Paid</th>
                        <th scope="col">Address</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Mode Of Payment</th>
                        <th scope="col">Actions</th>
                        

                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{o?.OrderId}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o.OrderId, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.buyerName}</td>
                        <td>{o?.totalAmountPaid}</td>
                        <td>{o?.buyerAddress}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.id ? 'Success' : 'Cash on Delivery'}</td>
                        <td>{o?.products?.length}</td>
                        <td>{o?.payment_mode}</td>
                        <td className="actions-col">
                          <Button className="btn btn-danger" type="primary" onClick={() => handleDelete(o.OrderId)} style={{ fontSize: '13px' }}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container"> 
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p.id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/get-photo/${p.id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height="100px"
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                          <p>Size:{p.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;


