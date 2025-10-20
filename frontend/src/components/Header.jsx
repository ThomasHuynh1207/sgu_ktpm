import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";


function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          🖥️ <span>SGU Computer Store</span>
        </div>
        <nav className="nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/product">Sản phẩm</Link>
          <Link to="/cart">Giỏ hàng</Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
