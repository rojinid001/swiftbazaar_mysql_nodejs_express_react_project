import { useState, useEffect } from "react";
import { useAuth } from "../../Context/Auth";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth,setAuth] = useAuth();
  const navigate = useNavigate(); // Use useNavigate from react-router-dom

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get('/api/v1/auth/admin-auth');
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
          // Redirect to the login page if not authenticated
          navigate('/login'); // Redirect to the login page
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle the error (e.g., show an error message)
      }
    };
    

    if(auth?.token)authCheck(); // Call the authCheck function
  }, [auth?.token]); // Add auth and navigate to the dependency array

  // Render the Outlet if authenticated
  return ok ? <Outlet /> : <Spinner path=""/>;
}
