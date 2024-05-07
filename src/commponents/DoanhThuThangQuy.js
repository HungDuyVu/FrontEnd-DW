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
      month: `Quý ${(Math.floor(i / 25) % 4) + 1}`, // Chỉ có 4 quý
      quantity: Math.floor(Math.random() * 1000) + 1,
      revenue: Math.floor(Math.random() * 10000) + 1000
    };
    data.push(newItem);
  }
  return data;
};

const fetchDataFromBackend = async () => {
  try {
    const response = await axios.get('API_URL');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DoanhThuBangQuy = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCityList, setShowCityList] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedQuy, setSelectedQuy] = useState(null); // Thêm state mới để lưu trữ quý được chọn
  const navigate = useNavigate();

  const handleSwitchToBang = () => {
    navigate('/doanh-thu-bang');
  };

  const handleSwitchToBangNam = () => {
    navigate('/doanh-thu-tp-nam');
  };

  const handleSwitchToThanhPho = () => {
    navigate('/doanh-thu');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetchDataFromBackend();
        setData(apiData.length > 0 ? apiData : generateFakeData());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentItems = selectedCity
    ? data.filter(item => item.city === selectedCity && (!selectedQuy || item.month === `Quý ${selectedQuy}`)).slice(indexOfFirstItem, indexOfLastItem)
    : data.filter(item => !selectedQuy || item.month === `Quý ${selectedQuy}`).slice(indexOfFirstItem, indexOfLastItem); // Lọc dữ liệu để chỉ hiển thị các mục có quý tương ứng với quý được chọn

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
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityList(false);
    setCurrentPage(1);
  };

  const handleQuySelect = (quy) => {
    setSelectedQuy(quy);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Doanh Thu theo THÀNG Quý</h2>
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
            onClick={handleSwitchToBangNam}
            className="ml-2 flex items-center"
          >
            <BsArrowRight />
          </button>
          <select
            value={selectedQuy}
            onChange={(e) => handleQuySelect(e.target.value)} // Use handleQuySelect
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none"
          >
            <option value="">Tất cả</option>
            {[...Array(4).keys()].map(quy => (
              <option key={quy + 1} value={quy + 1}>Quý {quy + 1}</option>
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
              <th className="px-4 py-2 border-r border-gray-300">Quý</th>
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

export default DoanhThuBangQuy;
