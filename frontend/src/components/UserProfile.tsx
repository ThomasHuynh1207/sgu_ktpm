import { useState } from 'react';
import { Navbar } from './Navbar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User as UserIcon, Mail, LogOut } from 'lucide-react';
import type { User } from '../App';

type UserProfileProps = {
  onNavigate: (page: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export function UserProfile({ onNavigate, user, setUser }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    onNavigate('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={onNavigate} cartItemCount={0} user={null} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl mb-4 text-gray-900">Vui lòng đăng nhập</h2>
          <Button onClick={() => onNavigate('login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onNavigate} cartItemCount={0} user={user} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl mb-8 text-gray-900">Hồ sơ của tôi</h1>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Thông tin tài khoản</CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên đầy đủ</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <div className="py-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave}>Lưu</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                      });
                    }}
                  >
                    Huỷ
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('order-history')}
              >
                Xem lịch sử đặt hàng
              </Button>
              {user.role === 'admin' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate('admin')}
                >
                  Dashboard Admin
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
