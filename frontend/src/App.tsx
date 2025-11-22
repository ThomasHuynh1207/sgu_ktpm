import { useState } from 'react';
import { Home } from './components/Home';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderHistory } from './components/OrderHistory';
import { UserProfile } from './components/UserProfile';



export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  specs: string[];
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'guest';
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingMethod: string;
  date: string;
  shippingAddress: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const viewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const navigateToProducts = (category?: string) => {
    setSelectedCategory(category || null);
    setCurrentPage('products');
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    setCurrentPage('order-history');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={setCurrentPage}
            onViewProduct={viewProductDetail}
            onNavigateToProducts={navigateToProducts}
            addToCart={addToCart}
          />
        );
      case 'products':
        return (
          <ProductCatalog
            onNavigate={setCurrentPage}
            onViewProduct={viewProductDetail}
            selectedCategory={selectedCategory}
            addToCart={addToCart}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            onNavigate={setCurrentPage}
            addToCart={addToCart}
          />
        );
      case 'cart':
        return (
          <Cart
            cart={cart}
            onNavigate={setCurrentPage}
            updateQuantity={updateCartQuantity}
            removeItem={removeFromCart}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cart={cart}
            user={user}
            onNavigate={setCurrentPage}
            placeOrder={placeOrder}
          />
        );
      case 'login':
        return (
          <Login
            onNavigate={setCurrentPage}
            setUser={setUser}
          />
        );
      case 'register':
        return (
          <Register
            onNavigate={setCurrentPage}
            setUser={setUser}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            onNavigate={setCurrentPage}
            user={user}
            orders={orders}
            setOrders={setOrders}
          />
        );
      case 'order-history':
        return (
          <OrderHistory
            onNavigate={setCurrentPage}
            orders={orders}
            user={user}
          />
        );
      case 'profile':
        return (
          <UserProfile
            onNavigate={setCurrentPage}
            user={user}
            setUser={setUser}
          />
        );
      default:
        return (
          <Home
            onNavigate={setCurrentPage}
            onViewProduct={viewProductDetail}
            onNavigateToProducts={navigateToProducts}
            addToCart={addToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}
