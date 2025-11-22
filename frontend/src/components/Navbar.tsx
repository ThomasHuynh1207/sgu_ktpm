import { ShoppingCart, User, Monitor, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';



type NavbarProps = {
  onNavigate: (page: string) => void;
  cartItemCount: number;
  user: any;
};

export function Navbar({ onNavigate, cartItemCount, user }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Monitor className="h-8 w-8 text-blue-600" />
            <span className="text-xl text-gray-900">TechStore</span>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm và phụ kiện máy tính..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('products')}
            >
              Sản phẩm
            </Button>

            {user && user.role === 'admin' && (
              <Button
                variant="ghost"
                onClick={() => onNavigate('admin')}
              >
                Admin
              </Button>
            )}

            {user && user.role === 'customer' && (
              <Button
                variant="ghost"
                onClick={() => onNavigate('order-history')}
              >
                Đặt hàng
              </Button>
            )}

            <Button
              variant="ghost"
              className="relative"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <Button
                variant="ghost"
                onClick={() => onNavigate('profile')}
              >
                <User className="h-5 w-5 mr-2" />
                {user.name}
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
