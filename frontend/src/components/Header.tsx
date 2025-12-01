// src/components/Header.tsx
import { ShoppingCart, Search, LogOut, User as UserIcon, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import type { User } from '../types';

type HeaderProps = {
  user: User | null;
  onNavigate: (page: string) => void;
  cartCount: number;
  setUser: (user: User | null) => void;
};

export function Header({ user, onNavigate, cartCount, setUser }: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    onNavigate('home');
  };

  const goToProfile = () => {
    onNavigate('profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Monitor className="h-9 w-9 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TechStore</span>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="flex-1 max-w-3xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm laptop, PC, linh kiện, phụ kiện..."
                className="w-full pl-10 pr-4 py-2.5 "
              />
            </div>
          </div>

          {/* Bên phải: Giỏ hàng + User + Nút Đăng xuất */}
          <div className="flex items-center gap-4">
            {/* Giỏ hàng */}
            <Button variant="ghost" className="relative hover:bg-gray-100 p-3 rounded-full" onClick={() => onNavigate('cart')}>
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* KHU VỰC USER – CLICK VÀO ĐI ĐẾN PROFILE */}
            {user ? (
              <>
                {/* Avatar + Tên – Click vào nhảy sang Profile */}
                <button
                  onClick={goToProfile}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-full px-4 py-2 transition-all group cursor-pointer"
                >
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">Trang cá nhân</p>
                  </div>
                </button>

                {/* NÚT ĐĂNG XUẤT RIÊNG BIỆT – ĐỎ CHÓT */}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-full px-6 transition-all flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:block">Đăng xuất</span>
                </Button>
              </>
            ) : (
              <Button onClick={() => onNavigate('login')} size="lg" className="bg-blue-600 hover:bg-blue-700  ">
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}