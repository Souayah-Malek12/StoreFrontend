import { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices"; // Ensure Prices is an array
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [prods, setProds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/getProducts`
      );
      if (data?.success) {
        setProds(data.products);
        toast.success("Products loaded successfully");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/productList/${page}`
      );
      if (data?.success) {
        setProds((prevProds) => [...prevProds, ...data.products]);
      }
      setLoading(false);
      console.log("load")
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/productCount`);
      if (data?.success) {
        setTotal(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadMore();
    }
  }, [page]);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/category/findAll`
      );
      if (data?.success) {
        setCategories(data.category);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Something went wrong when fetching categories");
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProducts();
    getTotal();
    loadMore()
  }, []);

  // Handle category filtering
  const handleChecked = (checkedValue, categoryId) => {
    setChecked((prevChecked) => {
      if (checkedValue) {
        return [...prevChecked, categoryId];
      } else {
        return prevChecked.filter((c) => c !== categoryId);
      }
    });
  };

  const filterProducts = async (page = 1) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/product/filterProducts`, {
        checked,
        radio,
        page,  // Send the current page to the backend
      });
      if (data?.success) {
        if (page === 1) {
          setProds(data?.products); // Reset products when filters are applied
        } else {
          setProds((prevProds) => [...prevProds, ...data.products]); // Append products when loading more
        }
        setTotal(data?.total);
      } else {
        setProds([]);
      }
    } catch (error) {
      toast.error("Something went wrong when filtering products");
      console.log(error);
    }
  };
  

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts(page); // Fetch filtered products with pagination
    } else {
      loadMore(); // Fetch unfiltered paginated products
    }
  }, [page]);
  
  useEffect(() => {
    setPage(1);  // Reset to the first page when filters are applied
    if (checked.length || radio.length) {
      filterProducts(1);  // Fetch first page of filtered products
    } else {
      getAllProducts();  // Fetch all products if no filters are applied
    }
  }, [checked, radio]);
  

  return (
    <Layout title={"All Products - Best Offer"}>
      <div className="row">
        {/* Filter by Category */}
        <div className="col-md-3">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((cat) => (
              <Checkbox
                key={cat._id}
                onChange={(e) => handleChecked(e.target.checked, cat._id)}
              >
                {cat.name}
              </Checkbox>
            ))}
          </div>

          {/* Filter by Price */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mt-4">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Réinitialiser les filtres</button>
          </div>
        </div>

        {/* Product Display */}
        <div className="col-md-9">
          <h1 className="text-center">All products ({total})</h1>
          <div className="d-flex flex-wrap">
            {prods.map((p) => (
              <div className="col-md-4 mb-4" key={p._id}>
                <div className="card" style={{ width: "100%" }}>
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
                </div>
              </div>
            ))}
          </div>
          
        </div>
        <div className="mt-4">
            <div className="mt-4">
  <div className="m-2 p-3 text-center">
    {prods && prods.length < total && (
      <button
      className="btn btn-warning"
      onClick={(e) => {
        e.preventDefault();
        setPage((prevPage) => prevPage + 1);  // Increment page number
      }}
    >
      {loading ? "...loading" : "Load More"}
    </button>
    
    )}
  </div>
</div>

          </div>
      </div>
    </Layout>
  );
};

export default HomePage;