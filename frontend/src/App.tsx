import { useState, useEffect } from 'react';
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
import { Header } from './components/Header';

import type { Product, CartItem, User, Order } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. KHÔI PHỤC giỏ hàng từ localStorage khi mở trang
  useEffect(() => {
    const savedCart = localStorage.getItem('techstore_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('techstore_cart');
      }
    }
  }, []);

  // 2. LƯU giỏ hàng mỗi khi thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('techstore_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('techstore_cart');
    }
  }, [cart]);

  // Khôi phục user khi reload
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          id: parsed.user_id || parsed.id,
          username: parsed.username,
          email: parsed.email,
          role: parsed.role,
        });
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // TÍNH TỔNG SỐ LƯỢNG trong giỏ hàng (đúng 100%)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ĐĂNG XUẤT: XÓA USER + GIỎ HÀNG + TOKEN
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('techstore_cart'); // xóa giỏ hàng khi logout
    setUser(null);
    setCart([]);
    setCurrentPage('home');
    alert('Đã đăng xuất thành công!');
  };

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
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

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
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    setCurrentPage('order-history');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} onViewProduct={viewProductDetail} onNavigateToProducts={navigateToProducts} addToCart={addToCart} />;
      case 'products':
        return <ProductCatalog onNavigate={setCurrentPage} onViewProduct={viewProductDetail} selectedCategory={selectedCategory} addToCart={addToCart} />;
      case 'product-detail':
        return <ProductDetail productId={selectedProductId} onNavigate={setCurrentPage} addToCart={addToCart} />;
      case 'cart':
        return <Cart cart={cart} onNavigate={setCurrentPage} updateQuantity={updateCartQuantity} removeItem={removeFromCart} />;
      case 'checkout':
        return <Checkout cart={cart} user={user} onNavigate={setCurrentPage} placeOrder={placeOrder} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} setUser={setUser} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} setUser={setUser} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} user={user} orders={orders} setOrders={setOrders} />;
      case 'order-history':
        return <OrderHistory onNavigate={setCurrentPage} orders={orders} user={user} />;
      case 'profile':
        return <UserProfile onNavigate={setCurrentPage} user={user} setUser={setUser} />;
      default:
        return <Home onNavigate={setCurrentPage} onViewProduct={viewProductDetail} onNavigateToProducts={navigateToProducts} addToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header – ẩn khi login/register */}
      {currentPage !== 'login' && currentPage !== 'register' && (
        <Header
          onNavigate={setCurrentPage}
          cartCount={cartCount}
          user={user}
          setUser={setUser}
        />
      )}

      <main className={currentPage === 'login' || currentPage === 'register' ? 'pt-0' : 'pt-16'}>
        {renderPage()}
      </main>
    </div>
  );
}