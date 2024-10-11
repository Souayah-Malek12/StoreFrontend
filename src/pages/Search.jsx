import { NavLink, useNavigate } from "react-router-dom"
import Layout from "../components/Layouts/Layout"
import { useSearch } from "../context/search"

export const Search = () => {

    // eslint-disable-next-line no-unused-vars
    const [values, setValues] = useSearch()
    const navigate= useNavigate() 
  return (

    <Layout title={'Search Results'}>
        <div className="conatiner">
            <div className="text-center">
                <h1>Search Results</h1>
                <h6>{values?.results.length<1 ?
                    "No producs Found"   
                    : `Found ${values.results.length}` 
            }</h6>
            </div>
            <div className="d-flex flex-wrap mt-4">
                  
            {values?.results.map((p) => (
              <div className="col-md-4 mb-4" key={p._id}>
                <div className="card" style={{ width: "100%" }}>
                <NavLink key={p._id} to={`/ProductDetails/${p.slug}`} className='product-link' >

                  <img
                    src={p.photo}
                    className="card-img-top"
                    loading="lazy"
                    alt={`${p.name} picture`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                    <p className="card-text">${p.price.toFixed(3)}</p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-primary" onClick={(()=> navigate(`/ProductDetails/${p.slug}`))}>More details</button>
                      <button className="btn btn-secondary">Add To Cart</button>
                    </div>
                  </div>
                  </NavLink>

                </div>
              </div>
            ))}
            </div>
        </div>
    </Layout>
)
}
