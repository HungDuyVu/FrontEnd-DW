import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch } from 'react-icons/bs';

const ITEMS_PER_PAGE = 15;

// Hàm tạo dữ liệu giả cho kho hàng
const generateFakeInventoryData = () => {
  const inventory = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 5; j++) {
      inventory.push({
        id: (i * 10) + j,
        store: `Cửa hàng ${i}`,
        product: `Mặt hàng ${j}`,
        quantity: Math.floor(Math.random() * 100) + 1,
      });
    }
  }
  return inventory;
};

// Hàm fetch dữ liệu từ backend
const fetchDataFromBackend = async () => {
  try {
    const response = await axios.get('API_URL/inventory'); // Gửi yêu cầu GET đến API để lấy dữ liệu kho hàng từ backend
    return response.data; // Trả về dữ liệu lấy được từ backend
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu kho hàng:', error); // Bắt và log lỗi nếu có lỗi khi lấy dữ liệu từ backend
    return []; // Trả về một mảng rỗng nếu có lỗi
  }
};

const Kho = () => {
  const [inventory, setInventory] = useState([]); // State để lưu trữ dữ liệu kho hàng
  const [currentPage, setCurrentPage] = useState(1); // State để lưu trữ trang hiện tại
  const [isLoading, setIsLoading] = useState(true); // State để kiểm soát trạng thái tải dữ liệu
  const [error, setError] = useState(null); // State để lưu trữ thông báo lỗi (nếu có)
  const [showStoreList, setShowStoreList] = useState(false); // State để kiểm soát việc hiển thị danh sách cửa hàng
  const [storeList, setStoreList] = useState([]); // State để lưu trữ danh sách cửa hàng
  const [selectedStore, setSelectedStore] = useState(null); // State để lưu trữ cửa hàng được chọn

  // Sử dụng useEffect để fetch dữ liệu từ backend khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetchDataFromBackend(); // Gọi hàm fetchDataFromBackend() để lấy dữ liệu từ backend
        setInventory(apiData.length > 0 ? apiData : generateFakeInventoryData()); // Nếu có dữ liệu từ backend thì sử dụng dữ liệu đó, nếu không sử dụng dữ liệu giả
        setIsLoading(false); // Đã tải xong dữ liệu, setIsLoading(false) để dừng hiển thị loading indicator
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu kho hàng:', error); // Log lỗi nếu có lỗi khi fetch dữ liệu từ backend
        setError('Lỗi khi lấy dữ liệu'); // Đặt thông báo lỗi
        setIsLoading(false); // Đã xảy ra lỗi, setIsLoading(false) để dừng hiển thị loading indicator
      }
    };

    fetchData(); // Gọi hàm fetchData() khi component mount
  }, []);

  // Tính chỉ số của mục cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  // Tính chỉ số của mục đầu tiên trên trang hiện tại
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  // Lọc dữ liệu để hiển thị trên trang hiện tại
  const currentItems = selectedStore ? inventory.filter(item => item.store === selectedStore).slice(indexOfFirstItem, indexOfLastItem) : inventory.slice(indexOfFirstItem, indexOfLastItem);
  // Tính tổng số trang
  const totalPages = Math.ceil((selectedStore ? inventory.filter(item => item.store === selectedStore).length : inventory.length) / ITEMS_PER_PAGE);

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm xử lý khi click vào nút hiển thị danh sách cửa hàng
  const handleSearchClick = async () => {
    try {
      const response = await axios.get('API_URL/stores'); // Gửi yêu cầu GET đến API để lấy danh sách cửa hàng từ backend
      const uniqueStores = Array.from(new Set(response.data)); // Loại bỏ các phần tử trùng lặp trong danh sách cửa hàng
      setStoreList(uniqueStores); // Cập nhật danh sách cửa hàng
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cửa hàng:', error); // Log lỗi nếu có lỗi khi lấy danh sách cửa hàng từ backend
      const uniqueFakeStores = Array.from(new Set(generateFakeInventoryData().map(item => item.store))); // Sử dụng dữ liệu giả để tạo danh sách cửa hàng
      setStoreList(uniqueFakeStores); // Cập nhật danh sách cửa hàng với dữ liệu giả
    }
    setShowStoreList(!showStoreList); // Hiển thị hoặc ẩn danh sách cửa hàng khi click vào nút
  };

  // Hàm xử lý khi chọn một cửa hàng từ danh sách
  const handleStoreSelect = (store) => {
    setSelectedStore(store); // Đặt cửa hàng được chọn
    setShowStoreList(false); // Ẩn danh sách cửa hàng
    setCurrentPage(1); // Quay về trang đầu tiên
  };

  // Trả về JSX để render
  return (
    <div className="mx-auto w-4/5">
      <h2 className="text-xl font-bold mb-4">Kho hàng</h2>
      {/* Kiểm tra trạng thái tải dữ liệu */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="mb-4">
            {/* Nút hiển thị danh sách cửa hàng */}
            <button
              onClick={handleSearchClick}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
            >
              {showStoreList ? 'Ẩn danh sách cửa hàng' : 'Hiển thị danh sách cửa hàng'}
            </button>
            {/* Hiển thị danh sách cửa hàng nếu được chọn */}
            {showStoreList && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                {storeList.map((store, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleStoreSelect(store)}>
                    {store}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Bảng hiển thị dữ liệu kho hàng */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-2 border-r border-gray-300">Cửa hàng</th>
                  <th className="px-4 py-2 border-r border-gray-300">Mặt hàng</th>
                  <th className="px-4 py-2 border-r border-gray-300">Số lượng trong kho</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* Hiển thị dữ liệu trên từng dòng của bảng */}
                {currentItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="px-4 py-2 border-r border-gray-300">{item.store}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{item.product}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phần điều hướng trang */}
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
          {/* Phần nhập số trang */}
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
      )}
    </div>
  );
};

export default Kho;
