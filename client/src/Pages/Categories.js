import React from 'react';
import useCategory from '../hooks/useCategory';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout>
      <h1>All Categories</h1>
      <div className="container">
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-4 mb-4" key={c.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{c.name}</h5>
                  <Link to={`/category/${c.slug}`} className="btn btn-warning">
                    Explore {c.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
