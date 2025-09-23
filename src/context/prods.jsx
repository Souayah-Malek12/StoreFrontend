import { useState, createContext, useEffect } from "react";
import api from "../config/axios";

// Create the products context
const ProdsContext = createContext();

// Provider component
// eslint-disable-next-line react/prop-types
const ProdsProvider = ({ children }) => {
  const [prodsList, setProdsList] = useState([]);

  // Function to fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await api.get('/product/getProducts');
      if (data?.success) {
        setProdsList(data.products || []);
      } else {
        console.error('Failed to fetch products:', data?.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
