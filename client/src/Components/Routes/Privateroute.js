import { useState, useEffect } from "react";
import { useAuth } from "../../Context/Auth";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth,setAuth] = useAuth();
  const navigate = useNavigate(); // Use useNavigate from react-router-dom

  useEffect(() => {
  const authCheck = async () => {
    try {
      const res = await axios.get('/api/v1/auth/user-auth', {});

      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
       
        // Redirect to the login page if not authenticated
        navigate('/login'); // Redirect to the login page
      }
    } catch (error) {
      // Handle the error here, e.g., log it or display an error message
      console.error(error);
      setOk(false); // Set ok to false in case of an error
  
    }
  };
  
  if (auth?.token){ 

    authCheck()
  }; // Call the authCheck function
}, [auth?.token, navigate]);


  // Render the Outlet if authenticated
  return ok ? <Outlet /> : <Spinner/>;
}
