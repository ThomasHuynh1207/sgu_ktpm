import { ImageWithFallback } from './figma/ImageWithFallback';
import { Navbar } from './Navbar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Monitor, Laptop, ShoppingBag, Headphones, Keyboard, Mouse } from 'lucide-react';
import { products, categories } from '../data/products';
import type { Product } from '../App';

type HomeProps = {
  onNavigate: (page: string) => void;
  onViewProduct: (productId: string) => void;
  onNavigateToProducts: (category?: string) => void;
  addToCart: (product: Product, quantity: number) => void;
};

export function Home({ onNavigate, onViewProduct, onNavigateToProducts, addToCart }: HomeProps) {
  const featuredProducts = products.slice(0, 6);

  const categoryIcons: { [key: string]: any } = {
    'Desktop PC': Monitor,
    'Laptop': Laptop,
    'Monitor': Monitor,
    'Keyboard': Keyboard,
    'Mouse': Mouse,
    'Headset': Headphones,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onNavigate} cartItemCount={0} user={null} />

      {/* Hero Section */}
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
              const Icon = categoryIcons[category];
              return (
                <Card
                  key={category}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onNavigateToProducts(category)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <Icon className="h-12 w-12 text-blue-600" />
                    </div>
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
              Xem Tất Cả
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div onClick={() => onViewProduct(product.id)}>
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <span className="text-sm text-blue-600">{product.category}</span>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-blue-600">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500">Tồn : {product.stock}</span>
                    </div>
                  </CardContent>
                </div>
                <div className="px-6 pb-6">
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Mua sắm dễ dàng</h3>
              <p className="text-gray-600">
                Quy trình mua hàng nhanh chóng và dễ dàng với nhiều phương thức thanh toán khác nhau
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Sản phẩm chất lượng</h3>
              <p className="text-gray-600">
                Tất cả sản phẩm đều là hàng chính hãng và được bảo hành chính thức từ nhà phân phối.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Hỗ trợ khách hàng</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 về các câu hỏi liên quan đến sản phẩm.
              </p>
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
                <span className="text-xl">TechStore</span>
              </div>
              <p className="text-gray-400">
                Cửa hàng máy tính và phụ kiện uy tín từ năm 2020
              </p>
            </div>
            <div>
              <h4 className="mb-4">Loại</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-white">Desktop PC</li>
                <li className="cursor-pointer hover:text-white">Laptop</li>
                <li className="cursor-pointer hover:text-white">Phụ kiện</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Giúp đỡ</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-white">Mua sắm</li>
                <li className="cursor-pointer hover:text-white">Chi phí</li>
                <li className="cursor-pointer hover:text-white">Vận chuyển</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@techstore.com</li>
                <li>Telp: (021) 1234-5678</li>
                <li>WA: 0812-3456-7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
