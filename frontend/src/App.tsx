// src/App.tsx – BẢN HOÀN HẢO NHẤT, CHẠY NGON NGAY!
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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

import type { Product, CartItem, User, Order, OrderFromBackend } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

// Khôi phục giỏ hàng 
useEffect(() => {
  if (!user) {
    setCart([]);
    return;
  }

  const CART_KEY = `techstore_cart_${user.user_id}`;
  const saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try {
      setCart(JSON.parse(saved));
    } catch {
      localStorage.removeItem(CART_KEY);
    }
  }
}, [user]); // ← quan trọng: chạy lại khi user thay đổi

// Lưu giỏ hàng
useEffect(() => {
  if (!user) return;

  const CART_KEY = `techstore_cart_${user.user_id}`;
  if (cart.length > 0) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } else {
    localStorage.removeItem(CART_KEY);
  }
}, [cart, user]);

  // Khôi phục user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const u = JSON.parse(savedUser);
        setUser({
          user_id: u.user_id,
          username: u.username,
          email: u.email,
          full_name: u.full_name,
          phone: u.phone,
          address: u.address,
          role: u.role,
        });
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

const handleLogout = () => {
  // Xóa giỏ hàng của user hiện tại
  if (user) {
    const CART_KEY = `techstore_cart_${user.user_id}`;
    localStorage.removeItem(CART_KEY);
  }

  localStorage.removeItem('user');
  localStorage.removeItem('token');
  setUser(null);
  setCart([]); // ← xóa luôn trong state
  setCurrentPage('home');
  toast.success('Đăng xuất thành công!');
};

  const addToCart = (product: Product) => {
  const productId = product.product_id.toString(); // luôn có id string

  setCart(prev => {
    const existing = prev.find(item => item.product.id === productId);

    if (existing) {
      return prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        product: {
          ...product,
          id: productId, // BẮT BUỘC: thêm id dạng string
        },
        quantity: 1,
      }
    ];
  });
};


  const updateCartQuantity = (productId: string, quantity: number) => {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  setCart(prev =>
    prev.map(i => {
      if (!i.product || !i.product.product_id) return i;
      return i.product.product_id.toString() === productId 
        ? { ...i, quantity }
        : i;
    })
  );
};


  const removeFromCart = (productId: string) => {
    setCart(prev =>
    prev.filter(i => {
      if (!i.product || !i.product.product_id) return false;
      return i.product.product_id.toString() !== productId;
    })
  );
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

  // ĐẶT HÀNG THẬT – DÙNG ID THẬT TỪ BACKEND
 const placeOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
  try {
    // 1. KIỂM TRA TOKEN NGAY TỪ ĐẦU – BẮT BUỘC!
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
      setCurrentPage('login');
      return;
    }

    // Hiện đơn tạm
    const tempId = `TEMP-${Date.now()}`;
    const tempOrder: Order = {
      ...orderData,
      id: tempId,
      date: new Date().toISOString(),
      userId: user!.user_id,
    };
    setOrders(prev => [...prev, tempOrder]);
    clearCart();
    setCurrentPage('order-history');
    toast.loading('Đang gửi đơn hàng...', { id: 'placing' });

    // GỬI TOKEN ĐÚNG ĐỊNH DẠNG – LOẠI BỎ || '' HOÀN TOÀN!
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ← ĐÚNG 100% – KHÔNG CÓ || ''!
      },
      body: JSON.stringify({
        totalAmount: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map(i => ({
          productId: i.product.product_id || i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        phone: orderData.phone,
        fullName: orderData.fullName,
        notes: orderData.notes,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Đặt hàng thất bại');
    }

    const realOrder = await res.json();

    const finalOrder: Order = {
      id: String(realOrder.order?.order_id || realOrder.orderId || realOrder.id || 'unknown'),
      userId: user!.user_id,
      date: realOrder.order?.order_date || realOrder.created_at || new Date().toISOString(),
      total: realOrder.order?.total_amount || orderData.total,
      status: (realOrder.order?.status || 'Pending') as Order['status'],
      paymentMethod: realOrder.order?.payment_method || orderData.paymentMethod,
      shippingAddress: realOrder.order?.shipping_address || orderData.shippingAddress,
      items: orderData.items,
      phone: orderData.phone,
      fullName: orderData.fullName,
      notes: orderData.notes,
    };

    setOrders(prev => prev.map(o => (o.id === tempId ? finalOrder : o)));
    toast.success('Đặt hàng thành công! Đơn #' + finalOrder.id, { id: 'placing' });

  } catch (err: any) {
    console.error('Lỗi đặt hàng:', err);
    toast.error(err.message || 'Đặt hàng thất bại. Vui lòng thử lại', { id: 'placing' });
    setOrders(prev => prev.filter(o => !o.id.startsWith('TEMP-')));
  }
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
        return (
          <Cart
            cart={cart}
            
            onNavigate={setCurrentPage}
            updateQuantity={updateCartQuantity}
            removeItem={removeFromCart}
          />
        );
      case 'checkout':
        return <Checkout 
      cart={cart} 
      user={user} 
      onNavigate={setCurrentPage} 
      placeOrder={placeOrder}
      onOrderSuccess={() => {
        setCurrentPage('order-history'); // Chuyển sang lịch sử đơn
        toast.success('Đặt hàng thành công!');
      }}
    />;
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
      {currentPage !== 'login' && currentPage !== 'register' && (
        <Header
          onNavigate={setCurrentPage}
          cartCount={cartCount}
          user={user}
          onLogout={handleLogout}
          setUser={setUser}        
          />
      )}

      <main className={currentPage === 'login' || currentPage === 'register' ? '' : 'pt-16'}>
        {renderPage()}
      </main>
    </div>
  );
}