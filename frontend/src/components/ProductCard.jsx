export default function ProductCard({ name, price, image }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Giá: {price.toLocaleString()}₫</p>
      <button>Thêm vào giỏ</button>
    </div>
  )
}
