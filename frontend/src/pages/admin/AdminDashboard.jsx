import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import DashboardCharts from '../../components/Charts/DashboardCharts';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import axios from 'axios';

export const AdminDashboard = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch orders
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/orders/all`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/auth/all-users`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllOrders();
      getAllProducts();
      getAllUsers();
    }
  }, [auth?.token]);

  return (
    <Layout title={"Admin Dashboard"} >
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-summary">
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Total Orders</h5>
                      <h2 className="card-text">{orders?.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Total Products</h5>
                      <h2 className="card-text">{products?.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Total Users</h5>
                      <h2 className="card-text">{users?.length}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="dashboard-charts-section">
              <DashboardCharts />
            </div>
            
            {/* Recent Orders Table */}
            <div className="recent-orders mt-4">
              <h3>Recent Orders</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}</td>
                      <td>{order.buyer.name}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>${order.payment.transaction.amount}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard;