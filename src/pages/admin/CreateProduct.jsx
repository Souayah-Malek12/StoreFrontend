import axios from 'axios';
import Layout from '../../components/Layouts/Layout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Select, Button, Input } from 'antd';
import AdminMenu from '../../components/Layouts/AdminMenu';

const CreateProduct = () => {
    const [auth] = useAuth();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [photo, setPhoto] = useState("");
    const [details, setDetails] = useState([]);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [quantities, setQuantities] = useState('');

    const getAllCategories = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/category/findAll`);
          const data = response.data;
    
          if (data?.success) {
            setCategories(data?.category);
    
            
          } else {
            toast.error("Failed to fetch categories");
          }
        } catch (error) {
          toast.error('Something went wrong while fetching categories');
          console.log(error);
        }
      };

    const handleAddDetail = () => {
        if (color && size && quantities) {
            setDetails([...details, { color, size, quantities: parseInt(quantities) }]);
            setColor('');
            setSize('');
            setQuantities('');
        } else {
            toast.error("Please enter color, size, and quantity for the detail");
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(
                'http://localhost:3000/api/v1/product/create-product',
                { name, description, price, category, quantity, photo, details },
                { headers:
                     { 
                        Authorization: auth?.token
                     } }
            );
            // eslint-disable-next-line no-unused-vars
            const data = response.data;
            toast.success("Product Created Successfully");
        } catch (error) {
            console.log(error);
            toast.error('Error while creating product');
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <Layout title={"Create product"}>
            <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <div className="row">
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Create Product</h1>
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            <Select
                                placeholder='Select Category'
                                size='large'
                                showSearch
                                style={{ width: '100%', marginBottom: '15px' }}
                                onChange={(value) => setCategory(value)}
                                value={category}
                            >
                                {categories.map((c) => (
                                    <Select.Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Select.Option>
                                ))}
                            </Select>

                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor='photo-Link' className='btn btn-outline-secondary' style={{ width: '100%' }}>
                                    {photo ? <></> : 'Enter Photo Link'}
                                    <input type="text" className="form-control" onChange={(e) => setPhoto(e.target.value)} value={photo} />
                                </label>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>Enter Product Name</label>
                                <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} value={name} />
                            </div>

                            {photo && (
                                <div style={{ marginBottom: '15px' }}>
                                    <img
                                        src={photo}
                                        alt='product-img'
                                        height='200px'
                                        style={{ display: 'block', margin: '10px 0', border: '1px solid #ddd', padding: '5px', borderRadius: '5px' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '15px' }}>
                                <label>Enter Description</label>
                                <textarea className="form-control" rows="3" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>Enter Price</label>
                                <input type="number" className="form-control" onChange={(e) => setPrice(e.target.value)} value={price} />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>Enter Quantity</label>
                                <input type="number" className="form-control" onChange={(e) => setQuantity(e.target.value)} value={quantity} />
                            </div>

                            <h4>Product Details</h4>
                            <div className="detail-inputs" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input type="text" placeholder="Color" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
                                <input type="text" placeholder="Size" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
                                <input type="number" placeholder="Quantity" className="form-control" value={quantities} onChange={(e) => setQuantities(e.target.value)} />
                                <Button onClick={handleAddDetail}>Add Detail</Button>
                            </div>
                            <div>
                                <ul>
                                    {details.map((detail, i) => (
                                        <li key={i}>
                                            {`Color: ${detail.color}, Size: ${detail.size}, Quantity: ${detail.quantities}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <button
                                    onClick={handleSubmit}
                                    className='btn btn-primary'
                                    style={{ width: '40%', padding: '10px', fontSize: '16px', margin: '10px' }}
                                >
                                    Create Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProduct;
