import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig'; // Import axios instance
import { toast } from 'react-toastify';
import { getToken } from '../Login/app/static'; // Import getToken function
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [thisYearRevenue, setThisYearRevenue] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(new Array(12).fill(0));
  const [dailyRevenueData, setDailyRevenueData] = useState(new Array(7).fill(0));

  const fetchRevenueData = async () => {
    try {
      const token = getToken(); // Get the token
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch total, today, this month, and this year revenues
      const totalRes = await axios.get('/revenue/total', { headers });
      const todayRes = await axios.get('/revenue/today', { headers });
      const monthRes = await axios.get('/revenue/thismonth', { headers });
      const yearRes = await axios.get('/revenue/thisyear', { headers });
      
      // Fetch monthly revenue data
      const monthlyRes = await axios.get('/revenue/month', { headers });

      setTotalRevenue(totalRes.data.total);
      setTodayRevenue(todayRes.data.total);
      setThisMonthRevenue(monthRes.data.total);
      setThisYearRevenue(yearRes.data.total);

      // Set monthly revenue data from the response
      const monthlyData = monthlyRes.data.monthlyRevenue.map(item => item.total);
      setMonthlyRevenueData(monthlyData);

      // Assume APIs provide total revenue for today
      const dailyData = todayRes.data.daily || new Array(7).fill(0); // Adjust as needed
      setDailyRevenueData(dailyData);
      
    } catch (error) {
      toast.error('Failed to fetch revenue data');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const monthlyChartData = {
    labels: [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    datasets: [
      {
        label: 'Doanh Thu Tháng',
        data: monthlyRevenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const dailyChartData = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    datasets: [
      {
        label: 'Doanh Thu Ngày',
        data: dailyRevenueData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Doanh Thu</h2>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Tổng Doanh Thu</h3>
          <p className="text-xl">{totalRevenue} VNĐ</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Doanh Thu Hôm Nay</h3>
          <p className="text-xl">{todayRevenue} VNĐ</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Doanh Thu Tháng Này</h3>
          <p className="text-xl">{thisMonthRevenue} VNĐ</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Doanh Thu Năm Nay</h3>
          <p className="text-xl">{thisYearRevenue} VNĐ</p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Biểu Đồ Doanh Thu Tháng:</h3>
      <div className="w-full h-64 mb-4">
        <Bar data={monthlyChartData} options={{ maintainAspectRatio: false }} />
      </div>

      {/* <h3 className="font-semibold mb-2">Biểu Đồ Doanh Thu Ngày:</h3>
      <div className="w-full h-64 mb-4">
        <Bar data={dailyChartData} options={{ maintainAspectRatio: false }} />
      </div> */}
    </div>
  );
};

export default Revenue;
