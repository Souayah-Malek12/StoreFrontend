import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../../components/Layouts/AdminMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import moment from 'moment';
import './AllOrders.css';

const AllOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0
  });

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/orders/all`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      setOrders(data);
      
      // Calculate stats
      const stats = data.reduce((acc, order) => {
        acc.total += order.payment.transaction.amount;
        switch(order.status.toLowerCase()) {
          case 'processing':
            acc.processing++;
            break;
          case 'delivered':
            acc.delivered++;
            break;
          case 'cancelled':
            acc.cancelled++;
            break;
        }
        return acc;
      }, { total: 0, processing: 0, delivered: 0, cancelled: 0 });
      
      setStats(stats);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getAllOrders();
  }, [auth?.token]);

  const handleStatusUpdate = async (orderId, value) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API}/api/v1/orders/status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      getAllOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <Layout title={"All Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="orders-container">
              <div className="orders-header">
                <h1>All Orders</h1>
                <p>Manage and track all customer orders</p>
              </div>

              <div className="orders-stats">
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <div className="value">${stats.total.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                  <h3>Processing</h3>
                  <div className="value">{stats.processing}</div>
                </div>
                <div className="stat-card">
                  <h3>Delivered</h3>
                  <div className="value">{stats.delivered}</div>
                </div>
                <div className="stat-card">
                  <h3>Cancelled</h3>
                  <div className="value">{stats.cancelled}</div>
                </div>
              </div>

              {loading ? (
                <div className="text-center">Loading orders...</div>
              ) : (
                <div className="orders-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((o, i) => (
                        <tr key={o._id}>
                          <td>
                            <span className="order-id">{o._id.substring(0, 8)}</span>
                          </td>
                          <td>
                            <select
                              className={`status-badge ${getStatusClass(o?.status)}`}
                              onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                              defaultValue={o?.status}
                            >
                              {status.map((s, i) => (
                                <option key={i} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <div className="customer-info">
                              <div className="customer-avatar">
                                {o?.buyer?.name?.charAt(0)}
                              </div>
                              <div>
                                <div>{o?.buyer?.name}</div>
                                <small className="text-muted">{o?.buyer?.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{moment(o?.createAt).format("MMM Do YY")}</td>
                          <td>
                            <span className={o?.payment?.success ? "text-success" : "text-danger"}>
                              {o?.payment?.success ? "Success" : "Failed"}
                            </span>
                          </td>
                          <td>{o?.products?.length}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-action btn-view">
                                View
                              </button>
                              <button className="btn btn-action btn-edit">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
