import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Use NavLink with a lowercase "n"
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../Context/Auth';
import useCategory from '../../hooks/useCategory';
import SearchInput from '../Forms/SearchInput';
import { toast } from 'react-hot-toast'
import { useCart } from '../../Context/Cart';
import { Badge } from 'antd';

function Header() {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart()
  const categories = useCategory()
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });
    localStorage.removeItem('auth')
    toast.success('logged out successfully')
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary text-white">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white">
            <FaShoppingCart /> SwiftBazaar
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <div className="d-flex justify-content-center align-items-center mx-5">
              <SearchInput />
            </div>

              <li className="nav-item">
                <NavLink to="/" className="nav-link text-white" aria-current="page">
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-white dropdown-toggle-split"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={`/categories`}>
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li key={c.id}>
                      <Link className="dropdown-item" to={`/category/${c.slug}`}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to="/wishlist" className="nav-link text-white" aria-current="page">
                  Wishlist
                </NavLink>
              </li>


              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                  <NavLink to="/cart" className="nav-link text-white" style={{ fontSize: '25px', fontFamily: 'Roboto, sans-serif' }}>
                    Cart
                  </NavLink>
                </Badge>
              </li>

              {!auth.user ? (    
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link text-white">     
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link text-white">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 'admin' ? "admin" : "profile"
                            }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
