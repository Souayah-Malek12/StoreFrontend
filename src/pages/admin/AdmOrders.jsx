import axios from 'axios';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import { useAuth } from '../../context/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AdmOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [id, setId] = useState(null);
  console.log(id)

  const handleCommande =async()=>{
    try{
      const response = await axios.put(`${import.meta.env.VITE_APP_API}/api/v1/product/treatOrder/`,{id} ,{
        headers: {
          authorization: auth?.token,
        },
      });
      const data = response.data;
      
      if (data?.success) {
        toast.success('Order Treated');
    }}catch(err){
      console.error(err.message);
      toast.error('Error while treating  order');
    }
  }
  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/auth/AllOrders`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      const data = response.data;
      
      if (data?.success) {
        setOrders(data.orders);
        toast.success('All Orders Loaded');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Error while getting orders');
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [auth?.token]);

  useEffect(()=>{
    handleCommande()
  },[id])
  return (
    <Layout title={'Orders'}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>All Orders</h1>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Color</th> 
                <th>Size</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                // Loop through each order
                order?.products?.map((product, index) => (
                  <tr key={`${order._id}-${product._id}`}>
                    <td ><button onClick={()=>setId(order._id)}>{order._id}</button></td>
                    <td>{order?.buyer || order?.buyer?.buyer}</td>
                    <td>{order?.addresse || order?.buyer?.address}</td>
                    <td>{order?.buyerPhone || order?.buyer?.phone}</td>
                    <td>{order?.payment || 'N/A'}</td>
                    <td ><span style={{color: "red"}}>{order?.status || 'N/A'}</span></td>
                    <td>{product?._id || 'N/A'}</td>
                    <td>{product?.name || 'N/A'}</td>
                    <td>{product?.color || 'N/A'}</td>
                    <td>{product?.size || 'N/A'}</td>
                    <td>{new Date(order?.createdAt).toLocaleDateString() || 'N/A'}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdmOrders;
