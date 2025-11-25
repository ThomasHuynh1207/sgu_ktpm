import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Monitor } from 'lucide-react';
import type { User } from '../App';

type RegisterProps = {
  onNavigate: (page: string) => void;
  setUser: (user: User | null) => void;
};

export function Register({ onNavigate, setUser }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('❌ Mật khẩu không khớp! Vui lòng thử lại.');
      return;
    }

    setLoading(true);
    try {
      // Gửi request thật tới backend
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, // dùng email làm username
          password: formData.password,
          email: formData.email,
          full_name: formData.name,
          phone: '',
          address: '',
          role: 'customer',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Đăng ký thất bại');
      }

      const newUser = await response.json();

      alert('✅ Đăng ký thành công!');
      setUser({
        id: newUser.user_id,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      });
      onNavigate('home');
    } catch (error: any) {
      alert(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Đăng ký tài khoản mới</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và Tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-blue-600 hover:underline"
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
