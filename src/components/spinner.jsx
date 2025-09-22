import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Spinner = () => {
    const navigate  = useNavigate();
    const location = useLocation();
    const [count, setCount] = useState(3)

    useEffect(()=>{
        const intervall = setInterval(()=> {
            setCount((prevValue)=> --prevValue)
        },1000)

        return ()=> clearInterval(intervall)

    },[])

    
    useEffect(()=>{
        if(count < 0) {
            navigate('/login', {
                state: location.pathname
            })
        }
},[count, navigate, location])

  return (
        <div>
    <h1>Redirecting you in {count}</h1>
    <div 
      className="spinner-border text-primary d-flex align-items-center justify-content-center" 
      role="status"
    >
        
      <span className="visually-hidden"></span>
    </div>
        </div>
  );
};

export default Spinner;
