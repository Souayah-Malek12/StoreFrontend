import { useState } from "react";
import Layout from "../../components/Layouts/Layout";
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Styles/Registre.css"; // Importing the CSS file

const Registre = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setPasswordConfirm] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
          const res = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/auth/registre`, 
            { name, email, password, confirmPassword,phone, address });

        console.log(res.data);

            if (res.data.success) {
                toast.success(res.data.message, {
                    duration: 2000,
                });
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error); // Log the actual error for better debugging
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout title="Register - Ecommer App">
      <div className="form-container ">
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail0"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
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
          <div className="mb-3">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="form-control"
              id="exampleInputPassword2"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail3"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail4"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
    );
};

export default Registre;
