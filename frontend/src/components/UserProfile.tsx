import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User as UserIcon, Mail, LogOut, Package, Shield } from 'lucide-react';
import type { User } from '../types'; 

type UserProfileProps = {
  onNavigate: (page: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export function UserProfile({ onNavigate, user, setUser }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Dùng username thay vì name
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        username: formData.username,
        email: formData.email,
      };
      setUser(updatedUser);

      // Cập nhật localStorage để F5 vẫn giữ thông tin mới
      localStorage.setItem('user', JSON.stringify({
        user_id: user.user_id,
        username: formData.username,
        email: formData.email,
        role: user.role,
      }));

      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    onNavigate('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl mb-6 text-gray-800">Bạn chưa đăng nhập</h2>
          <Button size="lg" onClick={() => onNavigate('login')}>
            Đăng nhập ngay
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Hồ sơ của tôi</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Avatar + Info Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarFallback className="text-4xl bg-blue-600 text-white">
                  <UserIcon className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Administrator
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Khách hàng
                    </>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chi tiết */}
          <div className="md:col-span-2 space-y-6">
            {/* Thông tin tài khoản */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Thông tin tài khoản</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>Lưu</Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            username: user.username,
                            email: user.email,
                          });
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      {user.username}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {user.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hành động nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={() => onNavigate('order-history')}
              >
                <Package className="mr-3 h-5 w-5" />
                Lịch sử đơn hàng
              </Button>

              {user.role === 'admin' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => onNavigate('admin')}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Quản trị hệ thống
                </Button>
              )}
            </div>

            {/* Nút Đăng xuất */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Đăng xuất tài khoản
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}