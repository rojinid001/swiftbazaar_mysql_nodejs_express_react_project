import React from 'react';
import { Link } from 'react-router-dom'; 
function Footer() {
  return (
    <div className="footer">
      <h4 className='text-center'>All Right Reserved &copy; SwiftBazaar </h4>
      <h6 className='text-center mt-3'>
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link> |
        <Link to="/policy">Privacy-Policy</Link> 
      </h6>
    </div>
  );
}

export default Footer; 

