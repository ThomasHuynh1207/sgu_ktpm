// src/components/Header.tsx
import { User } from '../App';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: string) => void;
  cartCount: number;
}

export function Header({ user, onNavigate, cartCount }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          TechStore
        </h1>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => onNavigate('home')} className="hover:underline">Trang chủ</button>
          <button onClick={() => onNavigate('products')} className="hover:underline">Sản phẩm</button>
          <button onClick={() => onNavigate('order-history')} className="hover:underline">Đơn hàng</button>
        </nav>

        {/* Right side: Cart + User */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative hover:bg-blue-700 px-3 py-1 rounded transition"
          >
            Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="bg-white text-blue-600 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block font-medium">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  onNavigate('login');
                }}
                className="hover:underline text-sm"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}