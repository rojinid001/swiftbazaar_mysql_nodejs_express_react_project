import React from 'react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
        <>
             <div class="list-group">
                <h4>Dashboard</h4>
                <NavLink to="/dashboard/profile" className="list-group-item list-group-item-action">Profile</NavLink>
                <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">Orders</NavLink>
            </div>
        </>
  )
}

export default UserMenu
