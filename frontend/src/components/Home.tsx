import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Monitor, Laptop, ShoppingBag, Headphones, Keyboard, Mouse } from 'lucide-react';
import { categories } from '../data/products'; // giữ lại để hiển thị icon
import type { Product } from '../types';
import { Badge } from './ui/badge';
import { Package }  from 'lucide-react';

type HomeProps = {
  onNavigate: (page: string) => void;
  onViewProduct: (productId: string) => void;
  onNavigateToProducts: (category?: string) => void;
  addToCart: (product: Product, quantity: number) => void;
};

export function Home({ onNavigate, onViewProduct, onNavigateToProducts, addToCart }: HomeProps) {
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Không tải được sản phẩm');
        return res.json();
      })
      .then(data => {
        const normalized: Product[] = data.map((p: any) => ({
          product_id: p.product_id,
          id: p.product_id.toString(), // quan trọng: tạo id string cho frontend
          product_name: p.product_name,
          name: p.product_name,
          category: p.category_name || 'Chưa phân loại',
          category_id: Number(p.category_id) || 0,
          price: Number(p.price),
          description: p.description || 'Không có mô tả',
          image: p.image || 'https://via.placeholder.com/400',
          specs: Array.isArray(p.specs) ? p.specs : [],
          stock: Number(p.stock) || 0,
        }));
        setRealProducts(normalized);
      })
      .catch(err => {
        console.error(err);
        setRealProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredProducts = realProducts.slice(0, 6);

  const categoryIcons: Record<string, any> = {
    'Desktop PC': Monitor,
    'Laptop': Laptop,
    'Monitor': Monitor,
    'Keyboard': Keyboard,
    'Mouse': Mouse,
    'Headset': Headphones,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl mb-6">Cửa hàng máy tính và phụ kiện đầy đủ nhất</h1>
            <p className="text-xl mb-8 text-blue-100">
              Nhận các sản phẩm máy tính và phụ kiện chơi game tốt nhất với giá cả phải chăng.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => onNavigateToProducts()}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Mua ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Package;
              return (
                <Card
                  key={category}
                  className="cursor-pointer hover:shadow-lg transition-shadow text-center"
                  onClick={() => onNavigateToProducts(category)}
                >
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-900">{category}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl text-gray-900">Sản phẩm nổi bật</h2>
            <Button variant="outline" onClick={() => onNavigateToProducts()}>
              Xem tất cả
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Chưa có sản phẩm nào</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card
                  key={product.product_id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Click vào ảnh hoặc nội dung → xem chi tiết */}
                  <div onClick={() => onViewProduct(product.id)}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-2">{product.category}</Badge>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                        {product.product_name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                        </span>
                      </div>
                    </CardContent>
                  </div>

                  {/* Nút thêm giỏ hàng */}
                  <div className="px-6 pb-6">
                    <Button
                      className="w-full"
                      disabled={product.stock === 0}
                      onClick={(e) => {
                        e.stopPropagation(); // ngăn click lan ra card
                        addToCart(product, 1);
                      }}
                    >
                      {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3 ô cam kết */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Mua sắm dễ dàng</h3>
              <p className="text-gray-600">Quy trình mua hàng nhanh chóng và dễ dàng</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Sản phẩm chất lượng</h3>
              <p className="text-gray-600">Hàng chính hãng, bảo hành đầy đủ</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">TechStore</span>
              </div>
              <p className="text-gray-400">Cửa hàng máy tính uy tín từ 2020</p>
            </div>
            <div>
              <h4 className="mb-4">Danh mục</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 3).map(cat => (
                  <li key={cat} className="hover:text-white cursor-pointer">{cat}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Hướng dẫn mua hàng</li>
                <li className="hover:text-white cursor-pointer">Chính sách bảo hành</li>
                <li className="hover:text-white cursor-pointer">Vận chuyển</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@techstore.com</li>
                <li>Hotline: 1900 1234</li>
                <li>Facebook: fb.com/techstore</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}