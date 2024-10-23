import { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/Cart";
import {  useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";


export const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalPrice = () => {
        return cart.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2);
    };

    const removeItemFromCart = (pid) => {
        const existingItem = cart.find(p => p._id === pid);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                const updatedCart = cart.map((p) => 
                    p._id === pid ? { ...p, quantity: p.quantity - 1 } : p
                );
                setCart(updatedCart);
            } else {
                const updatedCart = cart.filter(p => p._id !== pid);
                setCart(updatedCart);
            }
        }
    };

    const getToken = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.response?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handlePaymentDelivery = async()=>{
        try{
            const {data} = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/product/payOnDeliver`,{
                cart , 
            } ,{
                headers : {
                    authorization : auth?.token
                }
            })
            if(data?.success){
                toast.success("order accepted");
            }
        }catch(error){
            console.log(error);
        }
    }

    const handlePayment = async () => {
        if (!instance) {
            console.log("DropIn instance is not initialized.");
            return;
        }

        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(
                `${import.meta.env.VITE_APP_API}/api/v1/product/braintree/payment`,
                { cart, nonce }
            );
            setLoading(false);
            if (data.success) {
                console.log("Payment successful!");
                setCart([])
                localStorage.removeItem('cart')
                navigate("/dashboard/user/orders"); 
                toast.success("Payment comlpleted Successfully ")
            } else {
                console.log("Payment failed:", data.message);
                // Handle failure
            }
        } catch (error) {
            console.log("Error during payment:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    return (
        <Layout title={"Your Cart"}>
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1 className="bg-light p-3 mb-4">
                            {auth?.user ? `Hello ${auth?.user?.email.split('@')[0]}` : "Welcome User"}
                        </h1>
                        <h4 className="mb-4">
                            {cart.length > 0 ? `You have ${cart.length} unique items` : `Your cart is empty`}
                            {auth?.token ? "" : " - Please Login"}
                        </h4>
                    </div>

                    <div className="col-md-8">
                        <h4 className="mb-3">Cart Items</h4>
                        {cart.length === 0 ? (
                            <p>Your cart is currently empty.</p>
                        ) : (
                            cart.map((p) => (
                                <div key={p._id} className="row p-1 mb-2">
                                    <div className="col-md-4">
                                        <img
                                            src={p.photo}
                                            height={"100px"}
                                            width={"80px"}
                                            className="card-img-top"
                                            loading="lazy"
                                            alt={`${p.name} picture`}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{p.name}</h5>
                                        <p>{p.description.substring(0, 30)}...</p>
                                        <h6 className="text-success">{p.price.toFixed(2)} dt</h6>
                                        <p>Quantity: {p.quantity}</p>
                                        <button className="btn btn-danger" onClick={() => removeItemFromCart(p._id)}>
                                            Remove Item
                                        </button>
                                    </div>
                                    <hr className="mt-2" />
                                </div>
                            ))
                        )}
                    </div>

                    <div className="col-md-4">
                        <h4 className="mb-3">Cart Summary</h4>
                        <div className="card border shadow-sm p-3">
                            <p className="font-weight-bold">Total Checkout Payment:</p>
                            <h5 className="text-danger">{totalPrice()} dt</h5>
                            {auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className="btn btn-primary" onClick={() => navigate('/dashboard/user/profile')}>
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => navigate('/login')}>Please Login To Checkout</button>
                            )}

                            {clientToken ? (
                                <div className="mt-2">
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: { flow: "vault" },
                                            
                                        }}
                                        onInstance={instance => setInstance(instance)}
                                    />
                                    <button
                                        className="btn btn-secondary"
                                        disabled={loading || !instance} // Disable if loading or instance is null
                                        onClick={handlePayment}
                                    >
                                        {loading ? "Processing..." : "Make Payment"}
                                    </button>
                                </div>
                            ) : (
                                <h1>Loading payment ...</h1>
                            )}
                            <button
                                        className="btn btn-primary mt-2 border-3"
                                        disabled={loading || !instance} // Disable if loading or instance is null
                                        onClick={handlePaymentDelivery}
                                    >
                                        {loading ? "Processing..." : "Pay On delivery"}
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
