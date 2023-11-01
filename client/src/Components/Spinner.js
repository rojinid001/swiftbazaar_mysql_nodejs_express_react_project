import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

const Spinner = ({path="login"}) => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location=useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1); // Use parentheses here
    }, 1000);

    if (count === 0) {
      clearInterval(interval); // Clear the interval when count reaches 0
      navigate(`/${path}`,{
        state:location.pathname
      });
    }

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [count, navigate,location,path]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h1>Redirecting to you in {count} seconds</h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
