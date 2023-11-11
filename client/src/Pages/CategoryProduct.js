import React, { useState, useEffect } from 'react'
import Layout from '../Components/Layout/Layout'
import axios from 'axios'
import { useParams,useNavigate } from 'react-router-dom'

const CategoryProduct = () => {
    const navigate=useNavigate()
    const params = useParams()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    //get product by category
    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (params?.slug) {
            getProductsByCat()
        }

    }, [params?.slug])
    return (
        <Layout>
            <div className='container mt-3'>
                <h4 className='text-center'> Category - {category?.name}</h4>
                <h6 className='text-center'>{products?.length} results found</h6>
                <div className='row'>
                <div className='d-flex flex-wrap'>
            {products.map((p) => (
              <div className="col-md-4 mb-4 px-1" key={p.id}>
                  <div className="product-card card">
                    <img src={`/api/v1/product/get-photo/${p.id}`} alt="Product" />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0,30)}</p>    
                      <p className="card-price">${p.price}</p>
                      <button className="btn btn-secondary ms-1" onClick={()=>navigate(`/product/${p.slug}`)}>More Details</button>
                    </div>
                  </div> 
              </div>
            ))}
          </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
