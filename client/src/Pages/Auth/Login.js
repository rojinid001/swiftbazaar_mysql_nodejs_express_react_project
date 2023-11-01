import React, { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate ,useLocation} from 'react-router-dom';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../Context/Auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[auth,setAuth]=useAuth()
  const navigate = useNavigate();
  const location=useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
  
      if (res.data.success) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: res.data.data,
          token: res.data.token
        }));
        localStorage.setItem("auth",JSON.stringify(res.data))
  
        // Login successful, redirect to the home page
        navigate(location.state||'/');
        toast.success(res.data && res.data.message);
      } else {
        // Login failed, display an error message
        toast.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid Credentials');
    }
  };
  
  return (
    <Layout>
      <div className='form-container'>
        <h1 className="title">LOGIN FORM</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <a href="/forgot-password" className="text-primary" onClick={()=>{navigate('/forgot-password')}}>
                Forgot Password? <i className="fas fa-question-circle"></i>
              </a>
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
