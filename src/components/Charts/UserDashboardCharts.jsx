import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../../context/Auth';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboardCharts = () => {
  const [auth] = useAuth();
  const [userData, setUserData] = useState({
    spending: [],
    categories: {},
    recentOrders: []
  });

  useEffect(() => {
    if (auth?.token) {
      fetchUserStats();
    }
  }, [auth?.token]);

  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/v1/users/stats`,
        {
          headers: {
            Authorization: auth?.token
          }
        }
      );
      if (data?.success) {
        setUserData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Spending History Line Chart
  const spendingChartData = {
    labels: userData.spending.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: userData.spending.map(item => item.total),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const spendingChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Monthly Spending',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value,
        },
      },
    },
  };

  // Purchase Categories Pie Chart
  const categoryChartData = {
    labels: Object.keys(userData.categories),
    datasets: [
      {
        data: Object.values(userData.categories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Your Purchase Categories',
      },
    },
  };

  // Recent Orders Bar Chart
  const recentOrdersData = {
    labels: userData.recentOrders.map(order => new Date(order.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Order Amount',
        data: userData.recentOrders.map(order => order.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const recentOrdersOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recent Orders',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value,
        },
      },
    },
  };

  return (
    <div className="user-dashboard-charts">
      <div className="chart-grid">
        {/* Spending History */}
        <div className="chart-container">
          <Line data={spendingChartData} options={spendingChartOptions} />
        </div>

        {/* Purchase Categories */}
        <div className="chart-container">
          <Pie data={categoryChartData} options={categoryChartOptions} />
        </div>

        {/* Recent Orders */}
        <div className="chart-container">
          <Bar data={recentOrdersData} options={recentOrdersOptions} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total-spent">
          <h3>Total Spent</h3>
          <p>${userData.spending.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}</p>
        </div>
        <div className="summary-card order-count">
          <h3>Total Orders</h3>
          <p>{userData.recentOrders.length}</p>
        </div>
        <div className="summary-card avg-order">
          <h3>Average Order</h3>
          <p>${(userData.spending.reduce((acc, curr) => acc + curr.total, 0) / 
                (userData.recentOrders.length || 1)).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCharts;
