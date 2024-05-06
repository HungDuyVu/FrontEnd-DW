import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch, BsArrowLeft, BsArrowRight } from 'react-icons/bs'; // Import các biểu tượng từ thư viện react-icons
import { useNavigate } from 'react-router-dom'; // Hook để chuyển hướng trong ứng dụng React

const ITEMS_PER_PAGE = 15; // Số mục hiển thị trên mỗi trang

// Hàm này tạo dữ liệu giả mạo
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

// Hàm này gửi yêu cầu lấy dữ liệu từ backend
const fetchDataFromBackend = async () => {
  try {
    const response = await axios.get('API_URL'); // Gửi yêu cầu GET đến API_URL
    return response.data; // Trả về dữ liệu từ phản hồi của yêu cầu
  } catch (error) {
    console.error('Error fetching data:', error); // Bắt lỗi nếu có
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

const DoanhThu = () => {
  const [data, setData] = useState([]); // State để lưu trữ dữ liệu từ backend hoặc dữ liệu giả mạo
  const [currentPage, setCurrentPage] = useState(1); // State để lưu trữ trang hiện tại
  const [showCityList, setShowCityList] = useState(false); // State để kiểm soát hiển thị danh sách thành phố
  const [cityList, setCityList] = useState([]); // State để lưu trữ danh sách thành phố
  const [selectedCity, setSelectedCity] = useState(null); // State để lưu trữ thành phố được chọn
  const [selectedMonth, setSelectedMonth] = useState(null); // State mới để lưu trữ tháng được chọn
  const navigate = useNavigate(); // Hook để chuyển hướng đến các trang khác trong ứng dụng

  // Hàm này chuyển hướng người dùng đến trang doanh thu theo bảng
  const handleSwitchToBang = () => {
    navigate('/doanh-thu-bang');
  };

  // Hàm này chuyển hướng người dùng đến trang doanh thu theo tháng và quý
  const handleSwitchToBangQuy = () => {
    navigate('/doanh-thu-tp-quy');
  };

  // Hàm này chuyển hướng người dùng đến trang doanh thu theo năm
  const handleSwitchToBangNam = () => {
    navigate('/doanh-thu-tp-nam');
  };

  // Sử dụng useEffect để gọi fetchData khi component được tạo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetchDataFromBackend(); // Gọi hàm để lấy dữ liệu từ backend
        setData(apiData.length > 0 ? apiData : generateFakeData()); // Nếu có dữ liệu từ backend, cập nhật state, ngược lại sử dụng dữ liệu giả mạo
      } catch (error) {
        console.error('Error fetching data:', error); // Bắt lỗi nếu có
      }
    };

    fetchData(); // Gọi hàm để lấy dữ liệu khi component được tạo
  }, []); // useEffect sẽ chỉ được gọi một lần sau khi component được render lần đầu tiên

  // Tính chỉ số của mục cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  // Tính chỉ số của mục đầu tiên trên trang hiện tại
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  // Lọc dữ liệu để chỉ hiển thị các mục có tháng tương ứng với tháng được chọn
  const currentItems = selectedCity
    ? data.filter(item => item.city === selectedCity && (!selectedMonth || item.month === `Month ${selectedMonth}`)).slice(indexOfFirstItem, indexOfLastItem)
    : data.filter(item => !selectedMonth || item.month === `Month ${selectedMonth}`).slice(indexOfFirstItem, indexOfLastItem);

  // Tính số trang cần hiển thị dựa trên tổng số mục và số mục trên mỗi trang
  const totalPages = Math.ceil((selectedCity ? data.filter(item => item.city === selectedCity).length : data.length) / ITEMS_PER_PAGE);

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm này gửi yêu cầu lấy danh sách thành phố từ backend
  const handleSearchClick = async () => {
    try {
      const response = await axios.get('API_URL/cities'); // Gửi yêu cầu GET để lấy danh sách thành phố từ API_URL/cities
      const uniqueCities = Array.from(new Set(response.data)); // Loại bỏ các thành phố trùng lặp và lưu vào mảng uniqueCities
      setCityList(uniqueCities); // Cập nhật state của danh sách thành phố
    } catch (error) {
      console.error('Error fetching city list:', error); // Bắt lỗi nếu có
      const uniqueFakeCities = Array.from(new Set(generateFakeData().map(item => item.city))); // Sử dụng dữ liệu giả mạo để tạo danh sách thành phố duy nhất
      setCityList(uniqueFakeCities); // Cập nhật state của danh sách thành phố
    }
    setShowCityList(!showCityList); // Hiển thị hoặc ẩn danh sách thành phố
  };

  // Hàm này xử lý khi người dùng chọn một thành phố từ danh sách
  const handleCitySelect = (city) => {
    setSelectedCity(city); // Cập nhật thành phố được chọn
    setShowCityList(false); // Ẩn danh sách thành phố
    setCurrentPage(1); // Chuyển về trang đầu tiên
  };

  // Hàm này xử lý khi người dùng chọn một tháng từ dropdown
  const handleMonthSelect = (month) => {
    setSelectedMonth(month); // Cập nhật tháng được chọn
    setCurrentPage(1); // Chuyển về trang đầu tiên
  };

  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Doanh Thu theo THÀNH PHỐ</h2>
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
                    <BsSearch /> {/* Biểu tượng tìm kiếm */}
                  </button>
                  <button
                    onClick={handleSwitchToBang}
                    className="absolute right-8 top-0 h-full px-2 flex items-center"
                  >
                    <BsArrowLeft /> {/* Biểu tượng mũi tên trái */}
                  </button>

                  <button
                    onClick={handleSearchClick}
                    className="absolute right-0 top-0 h-full px-2 flex items-center"
                  >
                    <BsSearch /> {/* Biểu tượng tìm kiếm */}
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
                Tháng
                <button
                  onClick={handleSwitchToBangQuy}
                  className="ml-2 flex items-center" // Thêm nút chuyển sang /doanh-thu-bang-nam
                >
                  <BsArrowRight /> {/* Biểu tượng mũi tên phải */}
                </button>
                <button
                  onClick={handleSwitchToBangNam}
                  className="ml-2 flex items-center" // Thêm nút chuyển sang /doanh-thu-bang
                >
                  <BsArrowLeft /> {/* Biểu tượng mũi tên trái */}
                </button>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthSelect(e.target.value)} // Xử lý khi chọn tháng
                  className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                >
                  <option value="">Tất cả</option>
                  {[...Array(12).keys()].map(month => (
                    <option key={month + 1} value={month + 1}>Tháng {month + 1}</option>
                  ))}
                </select>
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
          {'<'} {/* Nút chuyển đến trang trước */}
        </button>
        <span>{`Trang ${currentPage}/${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 px-3 py-1 bg-gray-300 text-gray-700 rounded"
        >
          {'>'} {/* Nút chuyển đến trang kế tiếp */}
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

export default DoanhThu;
