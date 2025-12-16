import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Package } from 'lucide-react';


type Product = {
  product_id: string;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  Category?: { category_name?: string };
};

type SearchResultsProps = {
  onViewProduct: (productId: string) => void;
  addToCart: (product: Product) => void;
  searchQuery: string;
};

export function SearchResults({ onViewProduct, addToCart }: SearchResultsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || ''; // Lấy từ URL

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) return setResults([]);

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (!res.ok) throw new Error('Lỗi server');
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tìm kiếm. Vui lòng thử lại!');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(searchQuery); // Tự động fetch khi vào trang hoặc query thay đổi
  }, [searchQuery]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Kết quả tìm kiếm: <span className="text-blue-600">"{searchQuery}"</span>
      </h1>

      {loading ? (
        <p className="text-center text-xl">Đang tìm kiếm...</p>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <p className="text-2xl text-gray-500 mb-4">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map((product) => (
            <div
              key={product.product_id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => onViewProduct(product.product_id)}
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
                  <h3 className="font-semibold text-lg mb-2">{product.product_name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(product.price)}</p>
                  <p className="text-sm text-gray-500 mb-2">Còn {product.stock || 0} sản phẩm</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Danh mục: {product.Category?.category_name || 'Chưa có'}
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
  );
}

