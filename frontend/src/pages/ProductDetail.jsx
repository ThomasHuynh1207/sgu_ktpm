import React from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams(); // Lấy id sản phẩm từ URL

  // ⚠️ Ở đây bạn có thể fetch dữ liệu thật từ API — tạm thời mock cứng
  const product = {
    id,
    name: "Laptop Gaming Asus ROG",
    price: 29990000,
    description: "Laptop cấu hình cao, hiệu năng mạnh mẽ dành cho game thủ.",
    image:
      "https://dlcdnwebimgs.asus.com/gain/23b8f3f3-08c1-4a21-82cc-7724e7a2ef20/",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
      />
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        Giá: {product.price.toLocaleString()} VNĐ
      </p>
      <p>{product.description}</p>
      <button
        onClick={() => alert("Đã thêm vào giỏ hàng 🛒")}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}

export default ProductDetail;
