import "../styles/Cart.css"

export default function Cart() {
  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>

        <div className="cart-empty">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty cart"
            className="cart-empty-img"
          />
          <p>Hiện chưa có sản phẩm nào trong giỏ hàng.</p>
          <button className="cart-btn">Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  )
}
