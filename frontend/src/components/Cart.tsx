// src/components/Cart.tsx
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { CartItem } from '../types';

type CartProps = {
  cart: CartItem[];
  onNavigate: (page: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
};

export function Cart({ cart, onNavigate, updateQuantity, removeItem }: CartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  const handleRemoveItem = (productId: number) => {
    removeItem(productId.toString());
    toast.success('Đã xóa khỏi giỏ hàng!', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId.toString(), newQuantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Giỏ hàng</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-32 w-32 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Chưa có sản phẩm nào. Hãy mua sắm ngay nào!
            </p>
            <Button size="lg" onClick={() => onNavigate('products')}>
              Bắt đầu mua sắm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <Card key={item.product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Ảnh */}
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Thông tin */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.product.product_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.product.category || 'Chưa phân loại'}
                            </p>
                          </div>

                          {/* Nút xóa */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.product.product_id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Số lượng & giá */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xl font-bold w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price)} × {item.quantity}
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Cảnh báo hết hàng */}
                        {item.quantity >= item.product.stock && item.product.stock > 0 && (
                          <p className="text-sm text-orange-600 mt-3 font-medium">
                            Chỉ còn {item.product.stock} sản phẩm!
                          </p>
                        )}
                        {item.product.stock === 0 && (
                          <p className="text-sm text-red-600 mt-3 font-medium">
                            Sản phẩm đã hết hàng
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Tóm tắt đơn hàng</h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-lg">
                      <span>Tổng tiền hàng ({cart.length} sản phẩm)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Thuế VAT (11%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Tổng thanh toán</span>
                        <span className="text-3xl font-bold text-blue-600">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-lg font-semibold h-14 mb-4"
                    onClick={() => onNavigate('checkout')}
                  >
                    Tiếp tục thanh toán
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => onNavigate('products')}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}