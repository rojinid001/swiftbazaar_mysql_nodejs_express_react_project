import React, { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { email, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the data just before sending the request
    console.log("Data being sent in the request:", {
      email,
      token,
      newPassword,
      confirmPassword,
    });

    try {
      const res = await axios.post('/api/v1/auth/reset-password', {
        email,
        token,
        newPassword,
        confirmPassword,
      });

      // Log the full response
      console.log("Response from the server:", res);

      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // Log the full error
      console.error("Error from the server:", error);

      toast.error('An error occurred while resetting the password. Please try again later.');
    }
  };


  return (
    <Layout title="forgot password-swift bazar">
      <div className="form-container">
        <h1 className="title">Reset Password</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label"> 
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;  
