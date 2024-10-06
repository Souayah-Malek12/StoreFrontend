import { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd'; // No need to import Option separately
import { useParams } from 'react-router-dom';

export const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");
  const [Id, setId] = useState("");
  const params = useParams()

  const handleSubmit = async()=> {
    
    }
  
  const getProduct = async () => {
    
    try {
      const  response  = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/getOneproduct/${params.slug}`);
      const data = response.data
      setName(data.product.name)
      setId(data.product._id)
      setDescription(data.product.description)
      setPrice(data.product.price)  
      setQuantity(data.product.quantity)
      setPhoto(data.product.photo)
      setCategory(data.product.category)
      

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while creating the product');
    }
  };

  useEffect(() => {
    getProduct()
    
    
  }, []);

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

  useEffect(() => {
    getAllCategories();
    
  }, []);

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div className="row">
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Update Product</h1>
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
                  <input type="text" className="form-control" onChange={(e) => setPhoto(e.target.value)} />
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Product Name</label>
                <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} value={name}/>
              </div>

              <div style={{ marginBottom: '15px' }}>
                {photo && (
                  <img
                    src={photo}
                    alt='product-img'
                    height='200px'
                    style={{ display: 'block', margin: '10px 0', border: '1px solid #ddd', padding: '5px', borderRadius: '5px' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Description</label>
                <textarea className="form-control" rows="3" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Price</label>
                <input type="number" className="form-control" onChange={(e) => setPrice(e.target.value)} value={price}/>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Quantity</label>
                <input type="number" className="form-control" onChange={(e) => setQuantity(e.target.value)}  value={quantity}/>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleSubmit}
                  className='btn btn-primary'
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
