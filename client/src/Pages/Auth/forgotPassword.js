import React, { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to your server to initiate the password reset process
      const res = await axios.post('/api/v1/auth/forgot-password', { email });

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout title="forgot password-swift bazar">
      <div className="form-container">
        <h1 className="title">Forgot Password</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter your email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Reset Email
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
