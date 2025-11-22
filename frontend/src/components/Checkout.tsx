import { useState } from 'react';
import { Navbar } from './Navbar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { ChevronLeft } from 'lucide-react';
import type { CartItem, User, Order } from '../App';

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
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const shippingCost = shippingMethod === 'express' ? 50000 : 20000;
  const total = subtotal + tax + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Giỏ hàng trống rỗng! Vui lòng thêm sản phẩm trước khi đặt hàng.');
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
    alert('Đã đặt hàng thành công! Vui lòng thanh toán.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={onNavigate} cartItemCount={cart.length} user={null} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl mb-4 text-gray-900">Vui lòng đăng nhập trước</h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để tiến hành thanh toán
          </p>
          <Button onClick={() => onNavigate('login')}>
           Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onNavigate} cartItemCount={cart.length} user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => onNavigate('cart')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Button>

        <h1 className="text-4xl mb-8 text-gray-900">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin vận chuyển</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Tên đầy đủ</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ đầy đủ</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Mã bưu chính</Label>
                      <Input
                        id="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú (Tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức vận chuyển</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular" className="cursor-pointer">
                          <div>
                            <p className="text-gray-900">Giao hàng thường xuyên</p>
                            <p className="text-sm text-gray-600">3-5 ngày làm việc</p>
                          </div>
                        </Label>
                      </div>
                      <span className="text-gray-900">20.000</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div>
                            <p className="text-gray-900">Chuyển phát nhanh</p>
                            <p className="text-sm text-gray-600">1-2 ngày làm việc</p>
                          </div>
                        </Label>
                      </div>
                      <span className="text-gray-900">50.000</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg mb-3">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="cursor-pointer">
                        <div>
                          <p className="text-gray-900">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-600">
                            BCA, Mandiri, BNI, BRI
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg mb-3">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet" className="cursor-pointer">
                        <div>
                          <p className="text-gray-900">E-Wallet</p>
                          <p className="text-sm text-gray-600">
                            GoPay, OVO, DANA, ShopeePay
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">
                        <div>
                          <p className="text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-sm text-gray-600">
                            Thanh toán khi nhận được hàng
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tổng phụ</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Thuế (PPN 11%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Vận chuyển</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between text-gray-900">
                        <span>Tổng</span>
                        <span className="text-2xl text-blue-600">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Đặt hàng
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
