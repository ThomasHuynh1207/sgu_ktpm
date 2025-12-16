// src/components/SearchResults.tsx – SIÊU PHẨM, CHẠY NGON NGAY!
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, Search, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

type SearchResultsProps = {
  onViewProduct: (productId: string) => void;
  addToCart: (product: any, quantity?: number) => void;
  onNavigate: (page: string) => void;
};

export function SearchResults({ onViewProduct, addToCart, onNavigate }: SearchResultsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    console.log('Đang tìm kiếm:', searchTerm);
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/products/search?q=${encodeURIComponent(searchTerm.trim())}`
      );

      if (!res.ok) throw new Error('Lỗi server');
      const data = await res.json();
      console.log('Kết quả:', data);
      setResults(data || []);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      toast.error('Không thể tìm kiếm. Vui lòng thử lại!');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm lần đầu khi vào trang
  useEffect(() => {
    fetchResults(initialQuery);
  }, [initialQuery]);

  // Tìm lại khi nhấn Enter hoặc nút tìm
  const handleSearch = () => {
    if (query.trim()) {
      onNavigate(`search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* THANH TÌM KIẾM LẠI – ĐỂ KHÁCH DỄ TÌM TIẾP */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 max-w-3xl mx-auto">
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Kết quả cho: <span className="text-blue-600">"{initialQuery || 'trống'}"</span>
        </h1>
        <p className="text-center text-xl text-gray-600 mb-12">
          Tìm thấy <strong>{results.length}</strong> sản phẩm
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
            <p className="text-xl">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Không có kết quả */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-500 mb-4">Không tìm thấy sản phẩm nào</p>
            <p className="text-lg text-gray-400 mb-8">
              Thử tìm: "laptop", "rog", "samsung", "màn hình"...
            </p>
            <Button size="lg" onClick={() => onNavigate('products')}>
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}

        {/* Có kết quả */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((product: any) => (
              <div
                key={product.product_id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => onViewProduct(product.product_id.toString())}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image || 'https://via.placeholder.com/400'}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.product_name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Còn {product.stock || 0} sản phẩm
                    </p>
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}