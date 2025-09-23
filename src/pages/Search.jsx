import { NavLink, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Layout from "../components/Layouts/Layout"
import { useSearch } from "../context/search"
import { toast } from "react-hot-toast"

export const Search = () => {
    const { 
        results, 
        keyword, 
        loading, 
        error, 
        searchProducts 
    } = useSearch()
    const location = useLocation()

    // Fetch search results if coming from a direct URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const searchKeyword = searchParams.get('q')
        
        if (searchKeyword && searchKeyword !== keyword) {
            searchProducts(searchKeyword).catch(error => {
                console.error("Error in search effect:", error)
                toast.error("Failed to load search results")
            })
        }
    }, [location.search, keyword, searchProducts])
  return (

    <Layout title={'Search Results'}>
        <div className="container">
            <div className="text-center">
                <h1>Search Results</h1>
                {loading ? (
                    <div className="d-flex justify-content-center my-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <h6>
                        {results.length < 1 
                            ? "No products found"   
                            : `Found ${results.length} ${results.length === 1 ? 'result' : 'results'}`
                        }
                    </h6>
                )}
            </div>
            <div className="d-flex flex-wrap mt-4">
                {results?.map((p) => (
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
                    <p className="card-text text-muted">
                      {p.description?.substring(0, 60) || 'No description available'}...
                    </p>
                    <p className="card-text fw-bold">${p.price?.toFixed(2)}</p>
                    <div className="d-flex justify-content-between">
                      <NavLink 
                        to={`/ProductDetails/${p.slug}`} 
                        className="btn btn-primary"
                      >
                        View Details
                      </NavLink>
                      <button 
                        className="btn btn-success"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart functionality here
                          toast.success(`${p.name} added to cart`);
                        }}
                      >
                        Add to Cart
                      </button>
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
