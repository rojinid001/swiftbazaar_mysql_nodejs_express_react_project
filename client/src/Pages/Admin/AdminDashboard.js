import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import { useAuth } from '../../Context/Auth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie } from 'victory'; // Import Victory chart components

import '../../styles/adminStyles.css';

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0)
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [earningsOverTime, setEarningsOverTime] = useState([]);




  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axios.get('/api/v1/adminDashboardRoute/get-product-count');
        setProductCount(response.data.total);
        const productsData = response.data.products;
        const inStock = productsData.filter(product => product.quantity > 0);
        const outOfStock = productsData.filter(product => product.quantity === 0);
        console.log("count of in stock and out of stock", inStock, outOfStock)

        setInStockCount(inStock.length);
        setOutOfStockCount(outOfStock.length);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };

    const fetchOrderCount = async () => {
      try {
        const response = await axios.get('/api/v1/adminDashboardRoute/get-order-count');
        setOrderCount(response.data.total);
        setTotalAmount(response.data.totalAmountPaid)
      } catch (error) {
        console.error('Error fetching order count:', error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axios.get('/api/v1/adminDashboardRoute/get-user-count');
        setUserCount(response.data.total);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    const fetchEarningsOverTime = async () => {
      try {
        const response = await axios.get('/api/v1/adminDashboardRoute/get-earnings-over-time');
        const earningsData = response.data; // Assuming it returns an array of objects with date and earnings

        setEarningsOverTime(earningsData);
      } catch (error) {
        console.error('Error fetching earnings over time:', error);
      }
    };

    fetchProductCount();
    fetchOrderCount();
    fetchUserCount();
    fetchEarningsOverTime();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="w-100 p-3">
              <h1>Dashboard</h1>
              <div className="dashboardSummary">
                <div>
                  <p>
                    Total Amount <br /> ₹{totalAmount}
                  </p>
                </div>
                <div className="dashboardSummaryBox2">
                  <Link to="/dashboard/admin/products">
                    <p>Product</p>
                    <p>{productCount}</p>
                  </Link>
                  <Link to="/dashboard/admin/orders">
                    <p>Orders</p>
                    <p>{orderCount}</p>
                  </Link>
                  <Link to="/dashboard/admin/users">
                    <p>Users</p>
                    <p>{userCount}</p>
                  </Link>
                </div>
              </div>
              <div className="dashboardContainer">
                <div className="lineChart">
                  <h2>Amount Earned Over Time</h2>
                  <VictoryChart theme={VictoryTheme.material}>
                    <VictoryLine
                      data={[
                        { name: 'Initial Amount', value: 0 },
                        { name: 'Amount Earned', value: totalAmount },
                      ]}
                      x="name"
                      y="value"
                        
                    />
                  </VictoryChart>
                </div>



              </div>
              <div className="doughnutChart">
                <h2 className='text-center mt-5'>Stock Overview</h2> 
                <VictoryPie
                  data={[
                    { x: 'Out of Stock', y: outOfStockCount },
                    { x: 'In Stock', y: inStockCount },
                  ]}
                  colorScale={['#00A6B4', '#6800B4']}
                  labels={({ datum }) => `${datum.x}: ${datum.y}`} 
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

