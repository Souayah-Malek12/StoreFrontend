import axios from "axios";
import UserMenu from "../../components/Layouts/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import Layout from "../../components/Layouts/Layout";
import { useEffect, useState } from "react";

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
                { name, email, NewPassword, phone, address }, {
                    headers: {
                        Authorization: auth?.token
                    }
                });

            if (res.data.success) {
                toast.success(res.data.message, {
                    duration: 2000,
                });
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error); // Log the actual error for better debugging
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
        <Layout title={"Manage Profile"}>
            <div style={{ margin: '15rem auto', padding: '3rem', maxWidth: '800px', display: 'flex' }}>
                <div style={{ flex: '1', marginRight: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <UserMenu />
                </div>
                <div style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Profile</h1>
                    <div className="form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <h4 className="title" style={{ textAlign: 'center', marginBottom: '2rem' }}>UPDATE YOUR PROFILE</h4>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control"
                                    id="exampleInputEmail0"
                                    placeholder="Enter Your Name"
                                    autoFocus
                                    style={{ padding: '0.75rem', marginBottom: '1rem' }}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    placeholder="Enter Your Email"
                                    style={{ padding: '0.75rem', marginBottom: '1rem' }}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-control"
                                    id="exampleInputPassword2"
                                    placeholder="Enter Your New Password"
                                    style={{ padding: '0.75rem', marginBottom: '1rem' }}
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
                                    style={{ padding: '0.75rem', marginBottom: '1rem' }}
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
                                    style={{ padding: '0.75rem', marginBottom: '1rem' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '1rem', width: '100%' }}>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
