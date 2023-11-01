import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/Auth';
import { SearchProvider } from './Context/search';
import { CartProvider } from './Context/Cart';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </CartProvider>
      </SearchProvider>
  </AuthProvider>

);

