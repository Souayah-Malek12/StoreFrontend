import { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd'; // No need to import Option separately

export const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/product/create-product`, {
        name, description, price, category, quantity, photo
      }, 
      {

      }
    );

      if (data?.success) {
        toast.success(`The product "${data.name}" has been created successfully`);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while creating the product');
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/category/findAll`);
      const data = response.data;

      if (data?.success) {
        setCategories(data?.category);

        setName(" ");
        setDescription(" ");
        setPrice("")
        setQuantity("")
        setCategory("")
        setPhoto(null)
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
            <h1>Create Product</h1>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
              <Select
                placeholder='Select Category'
                size='large'
                showSearch
                style={{ width: '100%', marginBottom: '15px' }}
                onChange={(value) => setCategory(value)}
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
                <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} />
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
                <textarea className="form-control" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Price</label>
                <input type="number" className="form-control" onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Enter Quantity</label>
                <input type="number" className="form-control" onChange={(e) => setQuantity(e.target.value)} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleSubmit}
                  className='btn btn-primary'
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
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
