import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div class="list-group">
                <h4>Admin Panel</h4>
                <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">Create Category</NavLink>
                <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">Create Product</NavLink>
                <NavLink to="/dashboard/admin/Products" className="list-group-item list-group-item-action">Products</NavLink>
                <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">Orders</NavLink>
                <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">Users</NavLink>
                <NavLink to="/dashboard/admin/user-reviews" className="list-group-item list-group-item-action">Reviews</NavLink>
                <NavLink to="/dashboard/admin/coupons" className="list-group-item list-group-item-action">Coupons</NavLink>
                <NavLink to="/dashboard/admin/banners" className="list-group-item list-group-item-action">Banners</NavLink>
            
                
            </div>
        </>
    )
}

export default AdminMenu
