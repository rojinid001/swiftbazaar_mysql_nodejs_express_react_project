import { useState, useContext, createContext, useEffect } from "react";
import axios from 'axios'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null, 
    token: ""
  });
  //axios default
  axios.defaults.headers.common['Authorization']=auth?.token

  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) {
      const parsedata = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parsedata.data,
        token: parsedata.token
      }));
    }
    //eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}> 
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };


