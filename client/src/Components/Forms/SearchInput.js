import React from 'react'
import { useSearch } from '../../Context/search'
import '../../styles/searchBarStyles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SearchInput = () => {
  const navigate = useNavigate()
  const [values, setValues] = useSearch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data.data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }          
  };
  return (
    <div>
       <form class="d-flex" role="search" onSubmit={handleSubmit}>
        <input class="form-control me-2 custom-search-input" type="search" placeholder="Search" aria-label="Search" value={values.keyword}
    onChange={(e) => setValues({ ...values, keyword: e.target.value })}/>
        <button class="btn btn-outline-orange custom-search-button" type="submit">Search</button>
      </form>
    </div>
  )
}

export default SearchInput

