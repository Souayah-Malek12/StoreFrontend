import { useState, useContext, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-hot-toast";

const SearchContext = createContext();

// eslint-disable-next-line react/prop-types
const SearchProvider = ({ children }) => {
  const [values, setValues] = useState({
    keyword: "",
    results: [],
    loading: false,
    error: null,
  });

  const searchProducts = async (keyword) => {
    if (!keyword.trim()) {
      setValues(prev => ({
        ...prev,
        results: [],
        keyword: "",
        loading: false,
        error: null
      }));
      return;
    }

    setValues(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data } = await api.get(`/product/search/${encodeURIComponent(keyword)}`);
      setValues(prev => ({
        ...prev,
        results: data || [],
        keyword,
        loading: false
      }));
    } catch (error) {
      console.error("Search error:", error);
      setValues(prev => ({
        ...prev,
        error: "Failed to fetch search results",
        loading: false
      }));
      toast.error("Failed to load search results");
    }
  };

  const updateSearchKeyword = (keyword) => {
    setValues(prev => ({
      ...prev,
      keyword,
      error: null
    }));
  };

  const contextValue = {
    ...values,
    searchProducts,
    updateSearchKeyword,
    setSearchResults: (results) => setValues(prev => ({ ...prev, results }))
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export { useSearch, SearchProvider };