import ProductCard from "../components/ProductCard"
import "../styles/Home.css";

export default function Home() {
  const products = [
    { name: "Laptop ASUS TUF", price: 25000000, image: "/asus.jpg" },
    { name: "PC Gaming RTX 4060", price: 32000000, image: "/pc.jpg" },
     { name: "Laptop ASUS TUF", price: 25000000, image: "/asus.jpg" },
    
 
  ]

  return (
    <div className="home-container">
      <h1 className="home-title">Chào mừng đến SGU Computer Store 💻</h1>
      <div className="product-list">
        {products.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </div>
  )
}
