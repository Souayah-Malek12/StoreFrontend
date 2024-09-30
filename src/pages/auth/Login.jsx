import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import {useAuth} from "../../context/auth";

export const Login = () => {

    const [email , setEmail] = useState("");
    const [password, setPassword] = useState(" ");
    const [auth, setAuth]= useState()
    const location = useLocation();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the form from submitting the traditional way
    
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/auth/login`, {
                email, 
                password
            });
    
            if (res.data.success) {
                // Show success toast
                toast.success(res.data.message, {
                    duration: 2000, // Toast duration
                });
    
                // Update global auth state
                setAuth({
                    user: res.data.user,
                    token: res.data.token
                });
    
                // Save auth data to localStorage for persistence
                localStorage.setItem("auth", JSON.stringify(res.data));
    
                // Navigate to home or another page
                navigate(location.state || '/');
            } else {
                // Show error toast if login fails
                toast.error(res.data.message);
            }
    
        } catch (error) {
            console.log(error); // Log any errors for debugging
            toast.error('Something went wrong');  // Show error toast
        }
    };
    

    
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container ">
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  )
}
