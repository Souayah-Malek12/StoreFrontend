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

  const handleCommande = async (orderId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API}/api/v1/product/treatOrder`,
        { id: orderId },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (response.data?.success) {
        toast.success('Order status updated successfully');
        getAllOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Error updating order:', error.message);
      toast.error(error.response?.data?.message || 'Error updating order status');
    }
  };

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/product/all-orders`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      
      if (data?.success) {
        setOrders(data.orders);
        toast.success('Orders loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      toast.error('Error fetching orders');
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllOrders();
    }
  }, [auth?.token]);

  useEffect(() => {
    if (id) handleCommande(id);
  }, [id]);

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
                    <td>
                      <button onClick={() => setId(order._id)}>
                        {order._id}
                      </button>
                    </td>
                    <td>{order?.buyer || order?.buyer?.buyer}</td>
                    <td>{order?.addresse || order?.buyer?.address}</td>
                    <td>{order?.buyerPhone || order?.buyer?.phone}</td>
                    <td>{order?.payment || 'N/A'}</td>
                    <td>
                      <span style={{ color: 'red' }}>
                        {order?.status || 'N/A'}
                      </span>
                    </td>
                    <td>{product?._id || 'N/A'}</td>
                    <td>{product?.name || 'N/A'}</td>
                    <td>{product?.color || 'N/A'}</td>
                    <td>{product?.size || 'N/A'}</td>
                    <td>
                      {new Date(order?.createdAt).toLocaleDateString() || 'N/A'}
                    </td>
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
