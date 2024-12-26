  import { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices"; // Ensure Prices is an array
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import { FaFilter, FaTimes } from "react-icons/fa"; 
import { Input } from "antd"; // For search bar
// eslint-disable-next-line no-unused-vars
const { Search } = Input;
import Img1 from "../ImageFolder/images/Imgs/i1.jpg"
import Img2 from '../ImageFolder/images/Imgs/i2.jpg'
import Img3 from '../ImageFolder/images/Imgs/i3.jpg'
import Img4 from '../ImageFolder/images/Imgs/i4.jpg'
import Img5 from '../ImageFolder/images/Imgs/i5.jpg'
import vid1 from "../video/vid1.mp4"

const HomePage = () => {
  const [cart, setCart] = useCart([])
  const [prods, setProds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const imgs = [Img1,Img2,Img3,Img4,Img5]

  useEffect(()=>{
    const intervall = setInterval(()=>{
      setCurrentIndex((prevIndex)=>(prevIndex+1)%imgs.length);
    },3000)

    return ()=>clearInterval(intervall)
  },[imgs])


  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/getProducts`
      );
      if (data?.success) {
        setProds(data.products);
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
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/productList/${page}`);
      if (data?.success) {
        const uniqueNewProducts = [...new Map([...prods, ...data.products].map(item => [item._id, item])).values()];
        setProds(uniqueNewProducts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
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
      const productToAdd = prods.find(p => p._id === pid);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1 }]); // Add new product with quantity 1
      }
    }
  };
  
  

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts(page); 
    } else {
      loadMore(); 
    }
  }, [page]);
  
  useEffect(() => {
    setPage(1);  
    if (checked.length || radio.length) {
      filterProducts(1); 
    } else {
      getAllProducts(); 
    }
  }, [checked, radio]);
  
  const filterHidden = ()=>{
    setShowFilter(!showFilter)
  }
  return (
    <Layout title={"All Products - Best Offer"}>
      <div className="container">
        {/* Filter and Search Section */}
        <div className="row mb-4" style={{ display: "flex", alignItems: "center" }}>
          {/* Left Column: Button */}
          <div className="col-md-3 d-flex justify-content-center">
            <button
              onClick={filterHidden}
              className="btn btn-secondary shadow-sm"
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
              }}
            >
              {showFilter ? (
                <FaTimes size={20} color="white" />
              ) : (
                <FaFilter size={20} color="white" />
              )}
            </button>
          </div>

          {/* Right Column: Image and Video */}
          <div className="col-md-9">
            <div
              className="d-flex align-items-center"
              style={{
                gap: "20px",
                padding: "10px",
                flexWrap: "wrap",
              }}
            >
              {/* Image */}
              <img
                src={imgs[currentIndex]}
                alt="HomeImage"
                className="slideshow-image"
                style={{
                  height: "300px",
                  width: "300px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />

              {/* Video */}
              <video
                src={vid1}
                style={{
                  height: "300px",
                  width: "500px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                autoPlay
                controls
              />
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        {showFilter && (
          <div className="row">
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
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Display */}
        <div className="row mt-4">
          <h1 className="text-center">All Products ({total})</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {prods?.map((p) => (
              <div
                className="card m-2"
                style={{
                  width: "300px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "transform 0.2s ease-in-out",
                  height: "450px"
                }}
                key={p._id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={p.photo || `${import.meta.env.VITE_APP_API}/api/v1/product/getOneproduct/${p.slug}`}
                  className="card-img-top"
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                  alt={p.name}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x250?text=No+Image';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text fw-bold">${p.price.toFixed(2)}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/ProductDetails/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Item Added to cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-4">
          {prods && prods.length < total && (
            <button
              className="btn btn-warning"
              onClick={(e) => {
                e.preventDefault();
                setPage((prevPage) => prevPage + 1);
              }}
            >
              {loading ? "...loading" : "Load More"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;