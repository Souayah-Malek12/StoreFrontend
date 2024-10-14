import { useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/Cart";

export const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();

    const totalPrice = () => {
        // Calculate the total price by multiplying each product's price with its quantity
        return cart.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2); // Keep 2 decimal places
    };

    const removeItemFromCart = (pid) => {
        // Check if the product exists in the cart
        const existingItem = cart.find(p => p._id === pid);
        if (existingItem) {
            // If the quantity is greater than 1, decrease it
            if (existingItem.quantity > 1) {
                const updatedCart = cart.map((p) => 
                    p._id === pid ? { ...p, quantity: p.quantity - 1 } : p
                );
                setCart(updatedCart);
            } else {
                // If the quantity is 1, remove the item from the cart
                const updatedCart = cart.filter(p => p._id !== pid);
                setCart(updatedCart);
            }
        }
    };

    useEffect(() => {
        // No need to call totalPrice in useEffect; it can be called directly when needed
    }, [cart]);

    return (
        <Layout title={"Your Cart"}>
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1 className="bg-light p-3 mb-4">{`Hello ${auth?.user?.email.split('@')[0]}`}</h1>
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
                                <div key={p._id} className="row card flex-row mb-3 p-3 border shadow-sm">
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
                                        <button className="btn btn-danger" onClick={() => removeItemFromCart(p._id)}>Remove Item</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="col-md-4">
                        <h4 className="mb-3">Cart Summary</h4>
                        <div className="card border shadow-sm p-3">
                            <p className="font-weight-bold">Total Checkout Payment:</p>
                            <h5 className="text-danger">{totalPrice()} dt</h5>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
