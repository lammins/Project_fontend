import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) return alert('Vui lòng nhập đầy đủ thông tin');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-10">
        <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>
          🛍️ MyShop
        </div>
        <div className="space-x-4">
          <button onClick={() => navigate('/add')} className="text-gray-700 hover:text-blue-500">Thêm sản phẩm</button>
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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Đăng nhập</h2>
        <input className="form-control mb-3 w-full border px-3 py-2 rounded" placeholder="Tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="form-control mb-3 w-full border px-3 py-2 rounded" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleLogin}>Đăng nhập</button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Chưa có tài khoản? <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/register')}>Đăng ký</span>
        </p>
      </div>
    </div>
  );
}
