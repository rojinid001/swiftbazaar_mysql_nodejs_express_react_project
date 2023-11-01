import React from 'react'
import { useSearch } from '../Context/search'
import Layout from '../Components/Layout/Layout'
import { Link } from 'react-router-dom'

const Search = () => {
    const[values,setValues]=useSearch()
  return (
    <Layout title="Search results">
      <div className='container'>
        <div className='text-center'>
           <h1>Search Results</h1>
           <h6>{values?.results.length<1?'No Products Found':`Found ${values?.results.length}`}</h6>  
           <div className='d-flex flex-wrap mt-4'>
            {values?.results.map((p) => (
              <div className="col-md-4 mb-4 px-1" key={p.id}>
                <Link key={p.id} to={`/dashboard/admin/${p.slug}`} className='product-link'>
                  <div className="product-card card">
                    <img src={`/api/v1/product/get-photo/${p.id}`} alt="Product" />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5> 
                      <p className="card-text">{p.description.substring(0,30)}</p>  
                      <p className="card-price">${p.price}</p>
                      <button className="btn btn-secondary ms-1">More Details</button>
                      <button className="btn btn-primary ms-1">Add to Cart</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  ) 
}

export default Search   
