import axios from "axios"
import { useEffect, useState } from "react";

export const useCategory = () => {
    
    const [result, setResult] = useState([])

    const getCategories = async()=> {
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/category/findAll`);
            setResult(data?.category)
        }catch(error){
            console.log("Error in useCategory hook", error)
        }
    }

    useEffect(()=> {
        getCategories();
    },[])
  return result;
}
