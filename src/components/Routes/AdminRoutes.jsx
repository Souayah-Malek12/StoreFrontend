/* eslint-disable no-unused-vars */
import  { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Spinner from '../spinner';

export const AdminRoute = () => {

    const [ok , setOk] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [auth, setAuth] = useAuth()
    // console.log(import.meta.env.VITE_APP_API)

    useEffect(()=> {

        
        const checkAuth = async() => {
            try{

        const res = await axios.get('http://localhost:3000/api/v1/auth/admin-auth',{
            headers: {
                Authorization: auth?.token 
            }
        })

        

        if(res.data.success === true){
            setOk(true)
        }else{
            setOk(false)
        }

    }catch(error){
        console.log("error in private")
    }

    }

    if(auth?.token){
        checkAuth()
    }

    }, [auth?.token])

  return (
    ok ?
    <Outlet /> 
    : <Spinner />
  )
}

export default AdminRoute;
