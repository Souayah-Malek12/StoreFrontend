import { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/Cart";
import {  useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox } from "antd";


export const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [total , setTotal] = useState(0)
    const navigate = useNavigate();
    const [open , setOpen]= useState(false);
    const [name, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [adr, setAdr] = useState('')
    const [tel, setTel] = useState('')



    const handleOpenFom =()=>{
        setOpen(true);
    }
    const handleCloseForm =()=>{
        setNom('');
        setPrenom('')
        setAdr('')
        setTel('')
        setOpen(!open);
    }

    const handleFormSubmit = async(e)=>{
        try{
            e.preventDefault();
            const response = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/product/passagerCommand`,{
                name, adr ,tel , cart
            });
            const data = response.data;
            if(data?.success){
                toast.success(data?.message)
            }

           setNom('');
           setPrenom('')
           setAdr('')
           setTel('')
           toast.success(`Commande passée avec succée Montant : ${total} `);
        }catch(err){
            console.log(err);
            toast.error('Essayé une autre fois');
        }
    }

    const totalPrice = () => {
         const tot = cart.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2);
         setTotal(tot)
         
    };

    
    const removeItemFromCart = (pid) => {
    const existingItem = cart.find((p) => p._id === pid);
    if (existingItem) {
        if (existingItem.quantity > 1) {
            const updatedCart = cart.map((p) => {
                if (pid === p._id) {
                    const updatedDetails = p.details.map((detail) =>
                        detail.quantities > 0
                            ? { ...detail, quantities: detail.quantities - 1 }
                            : detail
                    );
                    return { ...p, quantity: p.quantity - 1, details: updatedDetails };
                }
                return p;
            });
            setCart(updatedCart);
            
        } else {
            const updatedCart = cart.filter((p) => p._id !== pid);
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

    useEffect(()=>{
        totalPrice()
    },[cart])
    useEffect(() => {
        getToken();
        
    }, [auth?.token]);

   return(
    <Layout title="Cart Page">
    <div className="container mt-5 mb-5">
    <div className="row">
        <div className="col-md-12 text-center">
            <h1 className="bg-light p-3 mb-4 rounded shadow-sm">
                {auth?.user ? `Hello ${auth?.user?.email.split('@')[0]}` : "Welcome User"}
            </h1>
            <h4 className="mb-4">
                {cart.length > 0 ? `You have ${cart.length}  items` : `Your cart is empty`}
                {auth?.token ? "" : " - Please Login"}
            </h4>
        </div>

        {/* Cart Items */}
        <div className="col-md-8">
            <h4 className="mb-3">Cart Items</h4>
            {cart.length === 0 ? (
                <p className="alert alert-warning">Your cart is currently empty.</p>
            ) : (
                cart.map((p) => (
                    <div
                        key={p._id}
                        className="row p-3 mb-3 shadow-sm rounded"
                        style={{ border: "1px solid #ddd", backgroundColor: "#fff" }}
                    >
                        <div className="col-md-4">
                            <img
                                src={p.photo}
                                alt={`${p.name}`}
                                className="card-img-top rounded shadow-sm"
                                style={{ width: "100px", height: "100px" }}
                                loading="lazy"
                            />
                        </div>
                        <div className="col-md-8 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="mb-1">{p.name}</h5>
                                <p className="text-muted">{p.description.substring(0, 30)}...</p>
                                <h6 className="text-success mb-1">{p.price.toFixed(2)} dt</h6>
                                <p>Quantity: {p.quantity}</p>
                                <div className="d-flex flex-wrap gap-3">
                                    {p?.details?.map((d, i) => (
                                        <div
                                            key={i}
                                            className="border rounded px-3 py-2"
                                            style={{
                                                backgroundColor: "#f9f9f9",
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <p className="mb-0">
                                                <strong>Size:</strong> {d.size}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Color:</strong> {d.color}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                className="btn btn-secondary mt-3"
                                style={{ width: "max-content" }}
                                onClick={() => removeItemFromCart(p._id)}
                            >
                                Remove Item
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Cart Summary */}
        <div className="col-md-4">
            <h4 className="mb-3">Cart Summary</h4>
            <div
                className="card border shadow-sm p-3 rounded"
                style={{ backgroundColor: "#f7f9fc" }}
            >
                <p className="font-weight-bold">Total Checkout Payment:</p>
                <h5 className="text-danger mb-3">{total} dt</h5>
                {auth?.user?.address ? (
                    <div className="mb-3">
                        <h4>Current Address</h4>
                        <h5 className="text-muted">{auth?.user?.address}</h5>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/dashboard/user/profile')}
                        >
                            Update Address
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-warning"
                        onClick={() => navigate('/login')}
                    >
                        Please Login To Checkout
                    </button>
                )}

                {clientToken ? (
                    <div className="mt-4">
                        <DropIn
                            options={{
                                authorization: clientToken,
                                paypal: { flow: "vault" },
                            }}
                            onInstance={(instance) => setInstance(instance)}
                        />
                        <button
                            className="btn btn-success w-100"
                            disabled={loading || !instance}
                            onClick={handlePayment}
                        >
                            {loading ? "Processing..." : "Make Payment"}
                        </button>
                    </div>
                ) : (
                    <h1 className="text-center">Loading payment...</h1>
                )}

                { auth?.user ? (
                <button
                    className="btn btn-primary mt-3 w-100"
                    disabled={loading || !instance}
                    onClick={handlePaymentDelivery}
                >
                    {loading ? "Processing..." : "Pay On Delivery"}
                </button>
                ):(
                    <div>
                        <button
                        className="btn btn-primary mt-3 w-100"
                        disabled={loading || !instance}
                        onClick={handleOpenFom}
                        >
                        Commander Maintenant
                        </button>
                        {
                            open &&  (
                                <div
                                className="modal fade show"
                                style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Entrer vos informations</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={handleCloseForm}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleFormSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="nom" className="form-label">
                                                        Nom
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="nom"
                                                        required
                                                        value={name}  name="nom"
                                                        onChange={(e)=>setNom(e.target.value)}

                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="prenom" className="form-label">
                                                        Prénom
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="prenom"
                                                        required
                                                        value={prenom} name="prenom"
                                                        onChange={(e)=>setPrenom(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="adresse" className="form-label">
                                                        Adresse
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse"
                                                        required
                                                        value={adr} name="adresse"
                                                        onChange={(e)=>setAdr(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="numTel" className="form-label">
                                                        Numéro de Téléphone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="numTel"
                                                        required
                                                        value={tel} name="télephone"
                                                        onChange={(e)=>setTel(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Checkbox required >
                                                        <h1 style={{ color: "gray", fontSize: "12px", fontWeight: "semi-bold", textAlign: "center", margin: "10px 0"}}
                                                        >je confirme ce monatnt ${total} dt</h1>
                                                    </Checkbox>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success w-100"
                                                >
                                                    Confirmer
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        }
                </div>
                )}
            </div>
        </div>
    </div>
</div>

</Layout> )
};
