// src/components/Checkout.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Loader2, ChevronLeft, Truck, CreditCard, Wallet, Home, CheckCircle } from 'lucide-react';
import type { CartItem, Order, User } from '../types';

type CheckoutProps = {
  cart: CartItem[];
  user: User | null;
  onNavigate: (page: string) => void;
  onOrderSuccess: () => void; // gọi khi đặt hàng thành công để clear cart + chuyển trang
  placeOrder: (orderData: Omit<Order, 'id' | 'date'>) => Promise<void>;
};

export function Checkout({ cart, user, onNavigate, onOrderSuccess }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('transfer');
  const [shippingMethod, setShippingMethod] = useState<'regular' | 'express'>('regular');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.full_name || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 50000 : 20000;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (cart.length === 0) {
      setError('Giỏ hàng trống!');
      setIsLoading(false);
      return;
    }

    if (!user) {
      setError('Bạn cần đăng nhập để đặt hàng');
      setIsLoading(false);
      return;
    }

    try {
      const orderData = {
        userId: user.user_id,
        totalAmount: total,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`.trim(),
        shippingMethod: shippingMethod === 'express' ? 'Express' : 'Standard',
        paymentMethod: paymentMethod.toUpperCase(),
        notes: formData.notes,
        phone: formData.phone,
        fullName: formData.fullName,
        status: 'Pending',
        items: cart.map(item => ({
          productId: item.product.product_id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // nếu mày dùng JWT
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }

      onNavigate('order-history');
      // Thông báo thành công + chuyển trang
      alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-16">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu đăng nhập</h2>
            <p className="text-gray-600">Bạn cần đăng nhập để tiến hành thanh toán</p>
          </div>
          <Button size="lg" onClick={() => onNavigate('login')}>
            Đăng nhập ngay
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-white/80"
          onClick={() => onNavigate('cart')}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Quay lại giỏ hàng
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Thanh toán đơn hàng</h1>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thông tin giao hàng */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ nhận hàng *</Label>
                    <Textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="TP. Hồ Chí Minh"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Mã bưu điện</Label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="700000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Vận chuyển & Thanh toán - giữ nguyên như cũ */}
              {/* ... (giữ nguyên phần RadioGroup như cũ) */}
              {/* (t để ngắn gọn tao giữ nguyên phần cũ của mày nhé) */}

              {/* ... phần vận chuyển & thanh toán giữ nguyên như code cũ của mày ... */}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="text-xl">Tóm tắt đơn hàng ({cart.length} sản phẩm)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.product_id} className="flex justify-between items-start pb-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.product.product_name || item.product.product_name}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <p className="font-semibold text-blue-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 pt-5 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Tổng tiền hàng</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Phí vận chuyển</span>
                      <span className="text-green-600">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-blue-600 pt-4 border-t-2">
                      <span>Tổng thanh toán</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Xác nhận đặt hàng
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}