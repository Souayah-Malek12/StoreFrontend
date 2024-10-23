import { useEffect, useState } from 'react';
import UserMenu from '../../components/Layouts/UserMenu';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import Layout from '../../components/Layouts/Layout';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [auth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_APP_API}/api/v1/auth/profil`, 
        { name, email, NewPassword, phone, address },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message, {
          duration: 2000,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    setName(auth?.user.userName);
    setEmail(auth?.user.email);
    setPhone(auth?.user.phone);
    setAddress(auth?.user.address);
  }, [auth?.user]);

  return (
    <Layout title={"Your Profile"}>
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <div className="form-container ">
            <form onSubmit={handleSubmit}>
              <h4 className="title">USER PROFILE</h4>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Name"
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
                  disabled
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Enter Your Password"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Phone"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Address"
                />
              </div>

              <button type="handleSubmit" className="btn btn-primary">
                UPDATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);
};

export default Profile;
