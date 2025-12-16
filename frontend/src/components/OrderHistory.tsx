// src/components/OrderHistory.tsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Package, Calendar, CreditCard, Truck, MapPin } from 'lucide-react';
import type { User, Order } from '../types';

type OrderHistoryProps = {
  onNavigate: (page: string) => void;
  orders: Order[];
  user: User | null;
};

export function OrderHistory({ onNavigate, orders, user }: OrderHistoryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      Pending: { label: 'Chờ xử lý', variant: 'secondary' },
      Processing: { label: 'Đang xử lý', variant: 'default' },
      Shipped: { label: 'Đã gửi hàng', variant: 'default' },
      Delivered: { label: 'Đã giao', variant: 'outline' },
      Cancelled: { label: 'Đã hủy', variant: 'destructive' },
    };

    const { label, variant } = config[status] || { label: status, variant: 'secondary' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-16">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
          <Button size="lg" onClick={() => onNavigate('login')}>
            Đăng nhập ngay
          </Button>
        </Card>
      </div>
    );
  }

  // SỬA CHỖ NÀY – ĐÚNG 100%
  const userOrders = orders;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
        </div>

        {userOrders.length === 0 ? (
          <Card className="text-center py-16">
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-8">Hãy mua sắm để có lịch sử đơn hàng nhé!</p>
            <Button size="lg" onClick={() => onNavigate('products')}>
              Bắt đầu mua sắm
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {userOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">Đơn hàng #{order.id}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-blue-100">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(order.date)}</span>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                    <div className="space-y-3">
                      {(order.items || [])  .map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div className="flex items-center gap-4">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.product_name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/300';
                                }}
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16" />
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {item.product.product_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Số lượng: {item.quantity} × {formatPrice(item.product.price)}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-blue-600">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Thanh toán</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Giao hàng</p>
                        <p className="font-medium">Giao hàng tiêu chuẩn</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Tổng tiền</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-4 border-t">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Giao đến</p>
                      <p className="font-medium">{order.shippingAddress}</p>
                      {order.phone && <p className="text-sm text-gray-600 mt-1">ĐT: {order.phone}</p>}
                    </div>
                  </div>

                  {order.status === 'Pending' && (
                    <Button className="w-full sm:w-auto">Thanh toán ngay</Button>
                  )}
                  {order.status === 'Delivered' && (
                    <Button variant="outline" className="w-full sm:w-auto">
                      Đánh giá 
                    </Button>
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