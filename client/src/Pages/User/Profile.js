import React, { useState, useEffect } from 'react'
import UserMenu from '../../Components/Layout/UserMenu'
import Layout from '../../Components/Layout/Layout'
import { useAuth } from '../../Context/Auth'
import axios from 'axios'
import toast from 'react-hot-toast'


const Profile = () => {
  const [auth, setAuth] = useAuth()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const { email, name, phone, address } = auth?.user; 
    setEmail(email)
    setName(name)
    setPhone(phone)
    setAddress(address) 
  }, [auth?.user])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put('/api/v1/auth/profile', { name, email, password, phone, address })
      if (data?.error) {
        toast.error(data?.error)
      } else {
        setAuth({ ...auth, user: data?.updatedUser })
        let ls = localStorage.getItem("auth")
        ls = JSON.parse(ls)
        ls.user = data.updatedUser
        localStorage.setItem('auth', JSON.stringify(ls))
        toast.success('Profile Updated SUccessfully')
      }

    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }


  };
  return (
    <Layout title="Profile-Dashboard">
      <div className='container-fluid m-3 p-3'>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          
          <div className="col-md-9">
          <div className="col-md-3">
          <div className="card w-75 p-3">
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Name: {auth?.user?.name}</h3> 
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Email: {auth?.user?.email}</h3>
            </div>
        </div>
            <div>
              <form onSubmit={handleSubmit}>
                <h4 className='title'>User Profile</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}

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

                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Your Password"
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
                <button type="submit" className="btn btn-success">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
