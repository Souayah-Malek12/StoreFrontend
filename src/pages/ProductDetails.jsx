import axios from "axios";
import Layout from "../components/Layouts/Layout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Don't forget to import useNavigate
import toast from "react-hot-toast";
import "./ProductDetails.css"; // Import the CSS file for additional styles
import { useCart } from "../context/Cart";
import { useProds } from "../context/prods";

const ProductDetails = () => {
    const [prod, setProd] = useState(null);
    const [relatedProd, setRelatedProd] = useState([]);
    const params = useParams();
    const navigate = useNavigate(); // Use useNavigate hook
    const [cart, setCart] = useCart([]);
    const { prodsList } = useProds();

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/getOneproduct/${params.slug}`);
            setProd(data?.product);
            if (data?.product) {
                const pid = data.product._id;
                const cid = data.product.category ? data.product.category._id : null;
                getRelatedProducts(pid, cid);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load product");
        }
    };

    const getRelatedProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/relatedProducts/${pid}/${cid}`);
            if (data?.success) {
                setRelatedProd(data?.relatedProds);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load related products");
        }
    };

    const AddToChart = (pid) => {
        const existingItem = cart.find(p => p._id === pid);
        

        if (existingItem) {
            // If the item exists, update the quantity
            const updatedCart = cart.map(p =>
                p._id === pid ? { ...p, quantity: p.quantity + 1 } : p
            );
            setCart(updatedCart); // Set the updated cart with increased quantity
        } else {
            // If the item does not exist, find the product and add it to the cart
            const productToAdd = prodsList.find(p => p._id === pid);
            if (productToAdd) {
                setCart([...cart, { ...productToAdd, quantity: 1 }]); // Add new product with quantity 1
            } else {
                console.error("Product not found in prodsList.");
            }
        }
    };

    useEffect(() => {
            getProduct();
       
    }, [params.slug]);

    return (
        <Layout title={'Product Details'}>
            <div className="container mt-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="product-image-wrapper text-center p-3 bg-light shadow-sm rounded">
                            <img 
                                src={prod?.photo} 
                                alt={prod?.name} 
                                className="img-fluid" 
                                style={{ width: "100%", maxWidth: "400px", height: "auto", objectFit: "cover" }} 
                            />
                        </div>
                    </div>
                    <div className="col-md-6 text-center text-md-start">
                        <div className="product-details p-4 bg-white shadow-sm rounded">
                            <h1 className="mb-3">{prod?.name}</h1>
                            <p className="text-muted mb-4">{prod?.description}</p>
                            <h4 className="text-primary mb-3">Price: ${prod?.price}</h4>
                            <h5 className="text-secondary mb-4">Category: {prod?.category?.name ? prod.category.name : "No category"}</h5>
                            <div>
                                <div>
                                    {prod?.details.map((d, i)=>(
                                        <h1 key={i}>{d.color}</h1>
                                    ))}
                                </div>
                                <div>
                                     {prod?.details.map((d, i)=>(
                                        <h1 key={i}>{d.size}</h1>
                                    ))}
                                </div>
                            </div>
                            
                            <button className="btn btn-secondary btn-lg" 
                                onClick={() => AddToChart(prod?._id)} // Pass the product ID
                            >Add to Cart</button>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="mb-4">Similar Products</h2>
                    <div className="row">
                        {relatedProd.map((p) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" key={p._id}>
                                <div className="card h-100 shadow-sm similar-product-card animate__animated animate__fadeIn">
                                    <img
                                        src={p.photo}
                                        className="card-img-top"
                                        loading="lazy"
                                        alt={`${p.name} picture`}
                                        style={{ height: "150px", objectFit: "cover" }} // Adjust height for uniformity
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        <p className="card-text">${p.price.toFixed(2)}</p>
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" onClick={() => navigate(`/ProductDetails/${p.slug}`)}>More details</button>
                                            <button className="btn btn-secondary" onClick={() => AddToChart(p?._id)}>Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
