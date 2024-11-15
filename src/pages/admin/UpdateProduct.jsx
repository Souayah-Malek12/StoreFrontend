import { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select, Button } from 'antd'; 
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export const UpdateProduct = () => {
  const [details, setDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");
  const [Id, setId] = useState("");
  const params = useParams()
  const navigate = useNavigate()
  const [auth] = useAuth()
  const [color, setColor]=useState('')
  const [size, setSize]=useState('')
  const [quantities, setQuantities]=useState('')
  const [Newdetails , setNewDetails] = useState([])

  


  
  const deleteProduct = async()=> {
    let answer = window.prompt('Are you sure want delete this product ')
    if(answer === "yes") {
      const response = await axios.delete(`${import.meta.env.VITE_APP_API}/api/v1/product/delete/${Id}`,{
        headers: {
        Authorization: auth?.token // Ensure token is passed here
        }
      })
      const data = response.data
    
      if(data?.success){
        toast.success('Product deleted successfully')
        navigate('/dashboard/admin/Products');
      }
        }else{
        toast.error('Product does  not deleted ')

      }
  }

  const handleSubmit = async(e)=> {
    try{
        e.preventDefault();
        const updatedDetails = [ { color, size, quantities }];


        const response = await axios.put(`${import.meta.env.VITE_APP_API}/api/v1/product/updateProduct/${Id}`, {
            name, description, price, category, quantity, photo, Newdetails  :updatedDetails
        }, {
          headers: {
          Authorization: auth?.token // Ensure token is passed here
          }
        })
        
        const data  = response.data
        if(data?.success){
          toast.success(`${data.updatedProduct.name} updated Successfully`)
          navigate('/dashboard/admin/Products');
        }
    }catch(error){
      console.log(error);
      toast.error('Something went wrong while updating the product');
    }
    }

    const handleAddDetail = () => {
      if (color.trim() && size.trim() && quantities.trim() && !isNaN(quantities)) {
        const newDetail = { color, size, quantities: parseInt(quantities) }; 
  
  
        // Add new detail to the details array
        setDetails((prevDetails) => [...prevDetails, newDetail]);
  
        // Clear input fields after adding the detail
       
        toast.success('Detail added successfully');
      }
    };
  
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
      setDetails(data.product.details);
      

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
                  <input type="text" className="form-control" onChange={(e) => setPhoto(e.target.value)} value={photo}/>
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

              <h4>Product Details</h4>
               <div>
                  {details?.map((d, index) => (
                  <ul key={index}>
                  <li>
                       {`color : ${d.color}, size : ${d.size}, quantities : ${d.quantities}`}
                   </li>
                  </ul>
                    ))}
              </div>

                            <div className="detail-inputs" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input type="text" placeholder="Color" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
                                <input type="text" placeholder="Size" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
                                <input type="number" placeholder="Quantity" className="form-control" value={quantities} onChange={(e) => setQuantities(e.target.value)} />
                                <Button onClick={handleAddDetail}>Add Detail</Button>
                            </div>

              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleSubmit}
                  className='btn btn-primary'
                  style={{ width: '40%', padding: '10px', fontSize: '16px' ,margin: '10px'}}
                >
                  Update Product
                </button>
                <button
                  onClick={deleteProduct}
                  className='btn btn-danger'
                  style={{ width: '40%', padding: '10px', fontSize: '16px' ,margin: '10px'}}
                >
                  Delete Product
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