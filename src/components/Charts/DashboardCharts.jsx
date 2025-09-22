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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

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

const DashboardCharts = () => {
  const [orderData, setOrderData] = useState({
    monthly: [],
    status: {},
    categories: {},
  });

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/orders/stats`);
      if (data?.success) {
        setOrderData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  // Monthly Orders Line Chart
  const monthlyChartData = {
    labels: orderData.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Orders',
        data: orderData.monthly.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Order Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Order Status Doughnut Chart
  const statusChartData = {
    labels: Object.keys(orderData.status),
    datasets: [
      {
        data: Object.values(orderData.status),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
      },
    },
  };

  // Category Sales Bar Chart
  const categoryChartData = {
    labels: Object.keys(orderData.categories),
    datasets: [
      {
        label: 'Sales by Category',
        data: Object.values(orderData.categories),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="dashboard-charts">
      <div className="chart-grid">
        {/* Monthly Orders Trend */}
        <div className="chart-container">
          <Line data={monthlyChartData} options={monthlyChartOptions} />
        </div>

        {/* Order Status Distribution */}
        <div className="chart-container">
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>

        {/* Category Sales */}
        <div className="chart-container">
          <Bar data={categoryChartData} options={categoryChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
