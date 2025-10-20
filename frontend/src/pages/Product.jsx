import "../styles/Products.css"

export default function Products() {
  return (
    <div className="products-page">
      <div className="products-container">
        <h1 className="products-title">Danh sách sản phẩm</h1>
        <p className="products-desc">
          Trang này sẽ hiển thị tất cả sản phẩm lấy từ backend.
        </p>

        <div className="product-grid">
          <div className="product-card">
            <img src="https://via.placeholder.com/150" alt="Sản phẩm 1" />
            <h3>Tên sản phẩm 1</h3>
            <p>Giá: 5.000.000₫</p>
            <button>Xem chi tiết</button>
          </div>

          <div className="product-card">
            <img src="https://via.placeholder.com/150" alt="Sản phẩm 2" />
            <h3>Tên sản phẩm 2</h3>
            <p>Giá: 7.000.000₫</p>
            <button>Xem chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  )
}
