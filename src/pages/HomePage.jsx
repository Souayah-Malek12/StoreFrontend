import { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices"; // Ensure Prices is an array

const HomePage = () => {
  const [prods, setProds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/getProducts`
      );
      if (data?.success) {
        setProds(data.products);
        toast.success("Products loaded successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  

  

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
  }, []);
 

  // Handle category filtering
  const handleChecked = (checkedValue, categoryId) => {
    setChecked((prevChecked) => {
      if (checkedValue) {
        // Add categoryId if checkedValue is true
        return [...prevChecked, categoryId];
      } else {
        // Remove categoryId if checkedValue is false
        return prevChecked.filter((c) => c !== categoryId);
      }
    });
  };
  

  const filterProduits = async() =>{
    try{
          const {data} = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/product/filterProducts`,
            {checked , radio }
          )
          if(data?.success){
            setProds(data?.products)
          }else{
            setProds([])
          }
    }catch(error){
      toast.error("Something went wrong when filtering products");
      console.log(error);
      console.log("filetr");

    }
  }

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduits();
    } else {
      getAllProducts(); 
    }
  }, [checked,radio]);

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
              <button className="btn btn-primary" onClick={()=>window.location.reload()}>Réinitialiser les filtres</button>
          </div>
        </div>

        {/* Product Display */}
        <div className="col-md-9">
          <h1 className="text-center">All products</h1>
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
                    <p className="card-text">{p.description.substring(0,30)}</p>
                    <p className="card-text">${p.price.toFixed(3)}</p>
                    <button className="btn btn-primary">More details</button>
                    <button className="btn btn-secondary">Add To Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
