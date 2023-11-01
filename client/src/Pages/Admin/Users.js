import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import axios from 'axios';
import { Modal } from 'antd';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/all-users');
      setUsers(data.data);
    } catch (error) {
      console.log(error); 
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(`/api/v1/auth/update-role/${userId}`, {
        role: newRole,
      });

      if (response.data.success) {
        // Role updated successfully, you can update the user's role in the state if needed
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            return { ...user, role: newRole };
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        // Handle error if role update fails
        console.error('Role update failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const showDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setIsModalVisible(false);
  
      const response = await axios.delete(`/api/v1/auth/delete-user/${userId}`);
  
      if (response.data.success) {
 
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
  
        toast.success('User deleted successfully');
      } else {
        toast.error('Something went wrong');
        console.error('User deletion failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Layout title="All users-Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{user.createdAt}</td>
                      <td>{user.updatedAt}</td>
                      <td>
                      <button
                          onClick={() => showDeleteModal(user.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={() => handleDeleteUser(userIdToDelete)}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </Layout>
  );
};

export default Users;
