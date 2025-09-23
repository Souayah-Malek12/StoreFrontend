import { useSearch } from "../../context/search"
import { useNavigate } from "react-router-dom"

export const SearchInput = () => {
    const { keyword, updateSearchKeyword, searchProducts } = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!keyword?.trim()) return;
        
        try {
            await searchProducts(keyword);
            navigate(`/search?q=${encodeURIComponent(keyword)}`);
        } catch (error) {
            console.error("Search error:", error);
        }
    };
    
    const handleChange = (e) => {
        updateSearchKeyword(e.target.value);
    };
  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input 
            className="form-control me-2" 
            type="search" 
            placeholder="Search" 
            aria-label="Search"
            value={keyword || ''}
            onChange={handleChange}
        />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>  
      )
}




