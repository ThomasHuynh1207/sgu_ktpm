// src/components/Checkout.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { ChevronLeft, Truck, CreditCard, Wallet, Home } from 'lucide-react';
import type { CartItem, User, Order } from '../types';

type CheckoutProps = {
  cart: CartItem[];
  user: User | null;
  onNavigate: (page: string) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'date'>) => void;
};

export function Checkout({ cart, user, onNavigate, placeOrder }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [shippingMethod, setShippingMethod] = useState('regular');

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.');
      return;
    }

    const orderData: Omit<Order, 'id' | 'date'> = {
      userId: user?.id || 'guest',
      items: cart,
      total,
      status: 'pending',
      paymentMethod,
      shippingMethod,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
    };

    placeOrder(orderData);
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại TechStore');
  };

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
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8 hover:bg-white/80"
          onClick={() => onNavigate('cart')}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Quay lại giỏ hàng
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Thanh toán đơn hàng</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thông tin người nhận */}
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
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-2"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-2"
                        placeholder="0901234567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ nhận hàng</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="mt-2"
                      placeholder="Số nhà, đường, phường/xã..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-2"
                        placeholder="TP. Hồ Chí Minh"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Mã bưu điện</Label>
                      <Input
                        id="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="mt-2"
                        placeholder="700000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      className="mt-2"
                      placeholder="Giao hàng giờ hành chính, gọi trước khi giao..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Phương thức vận chuyển */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-green-600" />
                    Phương thức vận chuyển
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all mb-3 ${
                      shippingMethod === 'regular' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular" className="cursor-pointer">
                          <p className="font-medium">Giao hàng tiêu chuẩn</p>
                          <p className="text-sm text-gray-600">3-5 ngày làm việc</p>
                        </Label>
                      </div>
                      <span className="font-semibold text-blue-600">20.000đ</span>
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      shippingMethod === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <p className="font-medium">Giao hàng nhanh</p>
                          <p className="text-sm text-gray-600">1-2 ngày làm việc</p>
                        </Label>
                      </div>
                      <span className="font-semibold text-blue-600">50.000đ</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Phương thức thanh toán */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <RadioGroupItem value="transfer" />
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            Chuyển khoản ngân hàng
                          </p>
                          <p className="text-sm text-gray-600">BCA • Mandiri • BNI • BRI</p>
                        </div>
                      </label>

                      <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <RadioGroupItem value="cod" />
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Thanh toán khi nhận hàng (COD)
                          </p>
                          <p className="text-sm text-gray-600">Phí COD: 10.000đ</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-blue-600 whitespace-nowrap ml-4">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-5 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Tổng tiền hàng</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Phí vận chuyển</span>
                      <span className="font-semibold text-green-600">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-blue-600 pt-4 border-t-2 border-blue-100">
                      <span>Tổng thanh toán</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg h-14 font-bold">
                    Xác nhận đặt hàng
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Bằng việc đặt hàng, bạn đồng ý với <span className="text-blue-600 underline">Điều khoản dịch vụ</span> của TechStore
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}