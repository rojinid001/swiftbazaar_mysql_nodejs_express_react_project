import React, { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate} from 'react-router-dom';
import '../../styles/AuthStyles.css'

 


const Register = () => {
  // Define state variables for each form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate=useNavigate()

  // Function to handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
        const res=await axios.post('/api/v1/auth/register',{name,email,password,phone,address})
        if(res.data.success){
            toast.success("registered successfully please login")
            navigate('/login')
        }else{
            toast.error(res.data.message)
        }
    }catch(error){
        console.log(error)
        toast.error("something went wrong")
    }

    
  };
  console.log(process.env.REACT_APP_API)

  return (
    <Layout title="Register-Swift Bazar">
      <div className='form-container'>
        <h1 className="title">REGISTER FORM</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Enter your phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Enter your address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
