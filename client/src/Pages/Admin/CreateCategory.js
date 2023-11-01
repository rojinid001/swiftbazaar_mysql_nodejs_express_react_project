import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../Components/Forms/CategoryForm';
import { Modal } from 'antd'
import { Footer } from 'antd/es/layout/layout';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState("")
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name })
      if (data?.success) {
        getAllCategory()
        toast.success(`${name} is created`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong in the input form")
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update category

  const handleUpdate = async (e) => {         
    e.preventDefault()
    try {
      const{data}=await axios.put(`/api/v1/category/update-category/${selected.id}`,{name:updatedName})
      if(data.success){
        toast.success(`${updatedName} is updated`)
        setSelected(e)
        setUpdatedName('')
        setVisible(false)
        getAllCategory()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }

  }
//delete category

const handleDelete = async (id, name) => {
  try {
    const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`);
    if (data.success) {
      toast.success(`${name} is deleted`);
      getAllCategory();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

  return (
    <Layout title="Create Category-Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className='p-3 w-50'>
            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

            </div>

            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>
                        <button className="btn btn-primary mx-3" onClick={() => { setVisible(true); setUpdatedName(c.name);setSelected(c) }}>Edit</button>

                        <button className="btn btn-danger" onClick={()=>{handleDelete(c.id,c.name)}}>Delete</button>
                      </td>
                    </tr> 
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
              <CategoryForm handleSubmit={handleUpdate} name={updatedName} setName={setUpdatedName} />  
            </Modal>

          </div>
        </div>
      </div>
    </Layout>  
  );
};

export default CreateCategory;
