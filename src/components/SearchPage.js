// src/components/Search.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  // Fetch products with optional search term
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: searchTerm ? { search: searchTerm } : {},
      });
      setProducts(res.data);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu sản phẩm');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(); // Load ban đầu
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProducts();
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-10">
        <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>
          🛍️ MyShop
        </div>
        <div className="space-x-4">
          <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-500">Sản phẩm</button>
          <button onClick={() => navigate('/search')} className="text-gray-700 hover:text-blue-500">Tìm kiếm</button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="text-red-500 font-semibold"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Nội dung chính */}
      <div className="p-4">
        <h2 className="text-2xl mb-4">Tìm kiếm sản phẩm</h2>
        <input
          type="text"
          placeholder="Tìm sản phẩm theo tên..."
          className="p-2 mb-4 border rounded w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProducts.length > 0 ? (
            currentProducts.map((prod) => (
              <div key={prod._id} className="border p-3 rounded shadow">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
                <h5 className="font-bold">{prod.name}</h5>
                <p>{prod.description}</p>
                <p><strong>Nhu cầu:</strong> {prod.nhu_cau}</p>
                <p><strong>Giá:</strong> {prod.price?.toLocaleString()} VND</p>
                <button className="btn btn-warning me-2" onClick={() => navigate(`/edit/${prod._id}`)}>Sửa</button>
                <button className="btn btn-danger" onClick={() => handleDelete(prod._id)}>Xóa</button>
              </div>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm nào.</p>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
