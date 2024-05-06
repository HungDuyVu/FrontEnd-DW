import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs'; // Import biểu tượng tìm kiếm từ thư viện React Icons
import axios from 'axios';

const ITEMS_PER_PAGE = 15;

const generateFakeData = () => {
  const data = [];
  for (let i = 1; i <= 100; i++) {
    const newItem = {
      id: i,
      customerName: `Customer ${i}`,
      productName: `Product ${String.fromCharCode(65 + (i % 26))}`,
      city: `City ${i % 10 + 1}`,
      month: `Month ${(i % 12) + 1}`,
      quantity: Math.floor(Math.random() * 1000) + 1,
      revenue: Math.floor(Math.random() * 10000) + 1000
    };
    data.push(newItem);
  }
  return data;
};

const fetchDataFromBackend = async () => {
  try {
    const response = await axios.get('API_URL'); // Thay 'API_URL' bằng URL API thực tế từ backend
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DoanhThu = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCityList, setShowCityList] = useState(false); // State to control visibility of city list
  const [cityList, setCityList] = useState([]); // State to store city list
  const [selectedCity, setSelectedCity] = useState(null); // State to store selected city

  useEffect(() => {
    // Thực hiện fetch dữ liệu từ backend hoặc sử dụng dữ liệu giả mạo
    const fetchData = async () => {
      try {
        // Sử dụng dữ liệu từ API backend nếu có
        const apiData = await fetchDataFromBackend();
        if (apiData.length > 0) {
          setData(apiData);
        } else {
          // Sử dụng dữ liệu giả mạo nếu không có dữ liệu từ API backend
          const fakeData = generateFakeData();
          setData(fakeData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Tính toán vị trí bắt đầu và kết thúc của dữ liệu hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = selectedCity ? data.filter(item => item.city === selectedCity).slice(indexOfFirstItem, indexOfLastItem) : data.slice(indexOfFirstItem, indexOfLastItem);

  // Xác định tổng số trang
  const totalPages = Math.ceil((selectedCity ? data.filter(item => item.city === selectedCity).length : data.length) / ITEMS_PER_PAGE);

  // Handler khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle search button click
  const handleSearchClick = async () => {
    try {
      // Fetch city list from backend (replace 'API_URL' with actual URL)
      const response = await axios.get('API_URL/cities');
      const data = response.data;
      const uniqueCities = Array.from(new Set(data)); // Remove duplicates
      setCityList(uniqueCities); // Update city list state with unique city names
    } catch (error) {
      console.error('Error fetching city list:', error);
      // If fetching from backend fails, use fake data instead
      const fakeCityList = generateFakeData().map(item => item.city);
      const uniqueFakeCities = Array.from(new Set(fakeCityList)); // Remove duplicates
      setCityList(uniqueFakeCities);
    }
    setShowCityList(!showCityList); // Toggle visibility of city list
  };

  // Function to handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityList(false); // Hide city list after selection
    setCurrentPage(1); // Reset current page to 1 when selecting a city
  };

  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Doanh Thu</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          {/* Header */}
          <thead className="bg-gray-200">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 border-r border-gray-300">Tên khách hàng</th>
              <th className="px-4 py-2 border-r border-gray-300">Tên mặt hàng</th>
               <th className="px-4 py-2 border-r border-gray-300 relative">
                Thành Phố
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
              <th className="px-4 py-2 border-r border-gray-300">Tháng</th>
              <th className="px-4 py-2 border-r border-gray-300">Số lượng đặt</th>
              <th className="px-4 py-2">Doanh thu</th>
            </tr>
          </thead>
          {/* Dữ liệu */}
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
      {/* Phân trang */}
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
      {/* Ô nhập trang */}
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

export default DoanhThu;