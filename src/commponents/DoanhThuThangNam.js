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

const fetchDataFromBackend = async (selectedYear) => { // Thêm tham số selectedYear để lấy dữ liệu tương ứng với năm được chọn
  try {
    const response = await axios.get(`API_URL?year=${selectedYear}`); // Sử dụng selectedYear để lấy dữ liệu theo năm
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DoanhThuBangNam = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCityList, setShowCityList] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null); // Thêm state mới để lưu trữ năm được chọn
  const navigate = useNavigate();

  const handleSwitchToThanhPho = () => {
    navigate('/doanh-thu-bang'); // Sử dụng navigate thay vì history.push
  };

  const handleSwitchToBangQuy = () => {
    navigate('/doanh-thu-tp-quy');
  };

  const handleSwitchToBang = () => {
    navigate('/doanh-thu');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetchDataFromBackend(selectedYear); // Truyền selectedYear vào hàm fetchDataFromBackend
        setData(apiData.length > 0 ? apiData : generateFakeData());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear]); // Thêm selectedYear vào dependency array để useEffect chạy lại khi selectedYear thay đổi

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
    setSelectedYear(null); // Xóa năm được chọn khi tìm kiếm thành phố mới
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityList(false);
    setCurrentPage(1);
    setSelectedYear(null); // Xóa năm được chọn khi chọn thành phố mới
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Doanh Thu THÀNH PHỐ - NAM</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 border-r border-gray-300">Tên khách hàng</th>
              <th className="px-4 py-2 border-r border-gray-300">Tên mặt hàng</th>
              <th className="px-4 py-2 border-r border-gray-300 relative">
                Thành phố
                <button
                    onClick={() => setShowCityList(!showCityList)}
                    className="absolute right-0 top-0 h-full px-2 flex items-center"
                  >
                    <BsSearch />
                  </button>
                  <button
                    onClick={handleSwitchToThanhPho}
                    className="absolute right-8 top-0 h-full px-2 flex items-center"
                  >
                    <BsArrowLeft />
                  </button>

                  <button
                    onClick={handleSearchClick}
                    className="absolute right-0 top-0 h-full px-2 flex items-center"
                  >
                    <BsSearch />
                  </button>
                {/* Danh sách thành phố */}
                {showCityList && (
                <ul className="absolute left-0 mt-0 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto w-full">
                    {cityList.map((city, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleCitySelect(city)}>
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </th>
              <th className="px-4 py-2 border-r border-gray-300">
                Năm
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearSelect(e.target.value)}
                  className="ml-2 border border-gray-300 px-2 py-1 rounded"
                >
                  <option value="">Chọn năm</option>
                  {/* Tạo các option cho các năm */}
                  {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button
                  onClick={handleSwitchToBangQuy}
                  className="ml-2 flex items-center" // Thêm nút chuyển sang /doanh-thu-quy
                >
                  <BsArrowRight />
                </button>
                <button
                  onClick={handleSwitchToBang}
                  className="ml-2 flex items-center" // Thêm nút chuyển sang /doanh-thu-bang
                >
                  <BsArrowLeft />
                </button>
              </th>
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
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded"
        >
          {'<'}
        </button>
        <span>{`Trang ${currentPage}/${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 px-3 py-1 bg-gray-300 text-gray-700 rounded"
        >
          {'>'}
        </button>
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

export default DoanhThuBangNam;
