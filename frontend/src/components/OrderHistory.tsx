import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Package, Calendar, CreditCard, Truck } from 'lucide-react';
import type { Order, User } from '../App';

type OrderHistoryProps = {
  onNavigate: (page: string) => void;
  orders: Order[];
  user: User | null;
};

export function OrderHistory({ onNavigate, orders, user }: OrderHistoryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'outline',
    };

    const labels: { [key: string]: string } = {
      pending: 'Đang chờ thanh toán',
      processing: 'Đã xử lý',
      shipped: 'Đã gửi',
      delivered: 'Hoàn thành',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : [];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl mb-8 text-gray-900">Lịch sử đặt hàng</h1>

        {userOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl mb-4 text-gray-900">Chưa có đơn đặt hàng nào</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có lịch sử đặt hàng nào
            </p>
            <Button onClick={() => onNavigate('products')}>
              Bắt đầu mua sắm
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">Đặt hàng #{order.id}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="mb-3 text-gray-900">Sản phẩm</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Chi phí</p>
                        <p className="text-gray-900">
                          {order.paymentMethod === 'transfer' && 'Transfer Bank'}
                          {order.paymentMethod === 'ewallet' && 'E-Wallet'}
                          {order.paymentMethod === 'cod' && 'COD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Vận chuyển</p>
                        <p className="text-gray-900">
                          {order.shippingMethod === 'regular' && 'Regular'}
                          {order.shippingMethod === 'express' && 'Express'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tổng</p>
                        <p className="text-xl text-blue-600">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</p>
                    <p className="text-gray-900">{order.shippingAddress}</p>
                  </div>

                  {/* Action based on status */}
                  {order.status === 'pending' && (
                    <div className="pt-4">
                      <Button className="w-full sm:w-auto">
                        Thanh toán ngay
                      </Button>
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <div className="pt-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Mua thêm
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
