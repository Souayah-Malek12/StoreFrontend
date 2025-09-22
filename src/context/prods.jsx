import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

// Create the products context
const ProdsContext = createContext();

// Provider component
// eslint-disable-next-line react/prop-types
const ProdsProvider = ({ children }) => {
  const [prodsList, setProdsList] = useState([]);

  // Function to fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/getProducts`
      );
      if (data?.success) {
        setProdsList(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  // Provide the product list, the setter function, and the fetch function
  return (
    <ProdsContext.Provider value={{ prodsList, setProdsList, getAllProducts }}>
      {children}
    </ProdsContext.Provider>
  );
};

// Custom hook to use the products context
const useProds = () => useContext(ProdsContext);

export { useProds, ProdsProvider };
