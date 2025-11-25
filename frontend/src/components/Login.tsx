import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Monitor } from 'lucide-react';
import type { User } from '../App';

type LoginProps = {
  onNavigate: (page: string) => void;
  setUser: (user: User | null) => void;
};

export function Login({ onNavigate, setUser }: LoginProps) {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      
      const response = await fetch('http://localhost:5000/api/user/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Frontend gửi cả username và password lên server
        body: JSON.stringify({ username, password }), 
      });

      // Luôn cố gắng parse data thành JSON, dù thành công hay thất bại
      const data = await response.json();

      if (!response.ok) {
        // Ném lỗi để khối catch xử lý, sử dụng message từ server
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // ĐĂNG NHẬP THÀNH CÔNG → LƯU TOKEN + USER
      localStorage.setItem('token', data.token);        // ← LƯU TOKEN
      localStorage.setItem('user', JSON.stringify(data.user)); // ← LƯU USER
      // --- CHỈ KHI ĐĂNG NHẬP THÀNH CÔNG THÌ CODE MỚI ĐẾN ĐƯỢC ĐÂY ---

      setUser(data.user); 

      // Kiểm tra vai trò để chuyển hướng
      if (data.user.role === 'admin') {
        onNavigate('admin'); 
      } else {
        onNavigate('Home'); 
      }
      
      // -----------------------------------------------------------

    } catch (err) {
      console.error(err);
      // Lỗi mạng hoặc lỗi trả về từ API (ví dụ: "User not found" hoặc "Invalid credentials")
      setError((err as Error).message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Monitor className="h-12 w-12 text-blue-600" />
            <span className="text-3xl text-gray-900">TechStore</span>
          </div>
          <p className="text-gray-600">Chào mừng trở lại!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="text"
                  // 🌟🌟🌟 ĐÃ SỬA: Đổi placeholder để hướng dẫn nhập username 🌟🌟🌟
                  placeholder="Nhập username của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Login'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Bạn chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-blue-600 hover:underline"
                >
                  Đăng ký ngay bây giờ
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
          >
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
