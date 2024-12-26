import  { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout"
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProds } from "../context/prods";
import { useCart } from "../context/Cart";

const CategoryList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const { prodsList } = useProds();
  const [cart, setCart] = useCart([]);


  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/categoryProduct/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const AddToChart = (pid) => {
    const existingItem = cart.find(p => p._id === pid);
    

    if (existingItem) {
        // If the item exists, update the quantity
        const updatedCart = cart.map(p =>
            p._id === pid ? { ...p, quantity: p.quantity + 1 } : p
        );
        setCart(updatedCart); // Set the updated cart with increased quantity
    } else {
        // If the item does not exist, find the product and add it to the cart
        const productToAdd = prodsList.find(p => p._id === pid);
        if (productToAdd) {
            setCart([...cart, { ...productToAdd, quantity: 1 }]); // Add new product with quantity 1
        } else {
            console.error("Product not found in prodsList.");
        }
    }
};

  return (
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div
                  className="card m-2"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={p.photo}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text"> $ {p.price}</p>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/ProductDetails/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-1" onClick={()=>AddToChart(p._id)}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;