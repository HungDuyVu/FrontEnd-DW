import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 15;

const generateFakeData = () => {
  const data = [];
  for (let i = 1; i <= 100; i++) {
    const newItem = {
      id: i,
      customerName: `Customer ${i}`,
      productName: `Product ${String.fromCharCode(65 + (i % 26))}`,
      city: `City ${i % 10 + 1}`,
      month: `Year ${(i % 12) + 1}`,
      quantity: Math.floor(Math.random() * 1000) + 1,
      revenue: Math.floor(Math.random() * 10000) + 1000
    };
    data.push(newItem);
  }
  return data;
};

const fetchDataFromBackend = async (selectedYear) => {
  try {
    const response = await axios.get(`API_URL?year=${selectedYear}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DoanhThuThangNam = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCityList, setShowCityList] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Add selectedMonth state
  const navigate = useNavigate();

  const handleSwitchToBang = () => {
    navigate('/doanh-thu-bang');
  };

  const handleSwitchToBangQuy = () => {
    navigate('/doanh-thu-tp-quy');
  };

  const handleSwitchToThanhPho = () => {
    navigate('/doanh-thu');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetchDataFromBackend(selectedYear);
        setData(apiData.length > 0 ? apiData : generateFakeData());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = selectedCity ? data.filter(item => item.city === selectedCity).slice(indexOfFirstItem, indexOfLastItem) : data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((selectedCity ? data.filter(item => item.city === selectedCity).length : data.length) / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get('API_URL/cities');
      const uniqueCities = Array.from(new Set(response.data));
      setCityList(uniqueCities);
    } catch (error) {
      console.error('Error fetching city list:', error);
      const uniqueFakeCities = Array.from(new Set(generateFakeData().map(item => item.city)));
      setCityList(uniqueFakeCities);
    }
    setShowCityList(!showCityList);
    setSelectedYear(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityList(false);
    setCurrentPage(1);
    setSelectedYear(null);
  };

  const handleMonthSelect = (month) => { // Define handleMonthSelect
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Doanh Thu theo THÀNG NĂM</h2>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <button
            onClick={handleSearchClick}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded mr-2"
          >
            {showCityList ? 'Ẩn danh sách thành phố' : 'Hiển thị danh sách thành phố'}
          </button>
          <button
            onClick={handleSwitchToBang}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded ml-2"
          >
            <BsArrowLeft /> Đến doanh thu Bang
          </button>
          {showCityList && (
            <ul className="absolute left-0 mt-0 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
              <li
                key="all"
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCitySelect(null)}
              >
                Tháng
              </li>
              {cityList.map((city, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={handleSwitchToThanhPho}
            className="ml-2 flex items-center"
          >
            <BsArrowLeft />
          </button>
          <button
            onClick={handleSwitchToBangQuy}
            className="ml-2 flex items-center"
          >
            <BsArrowRight />
          </button>
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthSelect(e.target.value)} // Use handleMonthSelect
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none"
          >
            <option value="">Tất cả</option>
            {[...Array(12).keys()].map(month => (
              <option key={month + 1} value={month + 1}>Năm {month + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 border-r border-gray-300">Tên khách hàng</th>
              <th className="px-4 py-2 border-r border-gray-300">Tên mặt hàng</th>
              <th className="px-4 py-2 border-r border-gray-300">Thành phố</th>
              <th className="px-4 py-2 border-r border-gray-300">Năm</th>
              <th className="px-4 py-2 border-r border-gray-300">Số lượng đặt</th>
              <th className="px-4 py-2">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentItems.map(item => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="px-4 py-2 border-r border-gray-300">{item.customerName}</td>
                <td className="px-4 py-2 border-r border-gray-300">{item.productName}</td>
                <td className="px-4 py-2 border-r border-gray-300">{item.city}</td>
                <td className="px-4 py-2 border-r border-gray-300">{item.month}</td>
                <td className="px-4 py-2 border-r border-gray-300">{item.quantity}</td>
                <td className="px-4 py-2">{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => handlePageChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded text-center w-20"
        />
        <span>{` / ${totalPages}`}</span>
      </div>
    </div>
  );
};

export default DoanhThuThangNam;
