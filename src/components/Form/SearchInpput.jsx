import { useSearch } from "../../context/search"
import axios from "axios"
import { useNavigate} from "react-router-dom"

export const SearchInput = () => {

    const [values, setValues] = useSearch( )
    const navigate = useNavigate()

    const handleSubmit = async (e)=> {
        e.preventDefault();

        const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/search/${values.keyword}`)
        setValues({...values, results : data})
        navigate('/search')
    }
  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
        value={values.keyword} 
        onChange={(e)=>setValues({...values, keyword :e.target.value})}
        />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>  
      )
}




