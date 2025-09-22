import { useState,  useContext, createContext} from "react";

const SearchContext = createContext();

// eslint-disable-next-line react/prop-types
const SearchProvider = ({ children }) => {


  const [values, setValues] = useState({
    keyword: "",
    results: [],
  });



  

  return (
    <SearchContext.Provider value={[values, setValues]}>
      {children}
    </SearchContext.Provider>
 
  )
}

const useSearch = () => useContext(SearchContext)

export {useSearch, SearchProvider}