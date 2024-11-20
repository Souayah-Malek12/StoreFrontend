import axios from 'axios';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import { useAuth } from '../../context/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AdmOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);

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
                <th>Products</th>
                <th>Details</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order?.buyerString || order?.buyer?.name}</td>
                  <td>{order?.addresse || order?.buyer?.address}</td>
                  <td>{order?.buyerPhone || order?.buyer?.phone}</td>
                  <td>{order?.payment || 'N/A'}</td>
                  <td>{order?.status || 'N/A'}</td>
                  <td>
                    <table className="table table-sm">
                      <tbody>
                        {order?.products?.map((p, index) => (
                          <tr key={index}>
                            <td>{p.name  }</td>
                            <td>{p.price || 'N/A'}</td>
                            <td>{p.quantity || 'N/A'}</td>
                            <td>{p.status || 'N/A'}</td>
                            <td>{p.buyerPhone || 'N/A'}</td>
                          </tr>
                        ))}
                        
                      </tbody>
                    </table>
                  </td>
                  <td>
                    {order?.products?.map((p, index) => (
                      <div key={index}>
                        {p?.details?.map((d, detailIndex) => (
                          <div key={detailIndex}>
                            <p>Color: {d.color || 'N/A'}</p>
                            <p>Size: {d.size || 'N/A'}</p>
                            <p>Quantities: {d.quantities || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td>{new Date(order?.createdAt).toLocaleDateString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdmOrders;
