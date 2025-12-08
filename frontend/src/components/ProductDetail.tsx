// src/components/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import { toast } from 'sonner';

type ProductDetailProps = {
  productId: string | null;
  onNavigate: (page: string) => void;
  addToCart: (product: Product, quantity? : number) => void;
};

export function ProductDetail({ productId, onNavigate, addToCart }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);          // ĐÃ SỬA
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Không tải được sản phẩm');

        const data = await res.json();
        const normalized: Product[] = data.map((p: any) => ({
          id: p.product_id?.toString() || p.id,
          product_name: p.product_name,
          name: p.product_name,
          category: p.category_name || p.category || 'Chưa phân loại',
          category_id: Number(p.category_id) || 0,
          price: Number(p.price),
          description: p.description || 'Không có mô tả',
          image: p.image || 'https://via.placeholder.com/600',
          specs: Array.isArray(p.specs) ? p.specs : [],
          stock: Number(p.stock) || 0,
        }));

        const currentProduct = normalized.find(p => p.id === productId);
        if (!currentProduct) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(currentProduct);

        const related = normalized
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);

      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
  if (!product) return;

  // Thêm vào giỏ
  addToCart(product, quantity);

  // Hiệu ứng nút chuyển thành "Đã thêm"
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);

  // TOAST ĐẸP LUNG LINH
  toast.success(
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <ShoppingCart className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <p className="font-semibold text-base">Đã thêm vào giỏ hàng!</p>
        <p className="text-sm text-gray-600">
          {product.product_name} × {quantity}
        </p>
      </div>
    </div>,
    {
      duration: 3000,
      position: "top-center",
      style: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    }
  );
};

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl mb-6 text-gray-900">Không tìm thấy sản phẩm</h2>
          <Button size="lg" onClick={() => onNavigate('products')}>
            Quay lại danh mục
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Button
          variant="ghost"
          className="mb-8 text-lg"
          onClick={() => onNavigate('products')}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Quay lại danh mục
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Ảnh */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Thông tin */}
          <div className="flex flex-col justify-center">
            <Badge className="mb-4 w-fit text-lg px-4 py-2">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">{product.product_name}</h1>
            <p className="text-4xl font-bold text-blue-600 mb-8">
              {formatPrice(product.price)}
            </p>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-gray-600">Tình trạng:</span>
              <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-base px-4 py-2">
                {product.stock > 0 ? `${product.stock} sản phẩm có sẵn` : 'Hết hàng'}
              </Badge>
            </div>

            {product.specs.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Thông số kỹ thuật</h3>
                <ul className="space-y-4">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Số lượng + Thêm giỏ */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl px-6 py-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 text-lg py-8 font-semibold"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || added}
              >
                {added ? (
                  <>
                    <Check className="mr-3 h-6 w-6" />
                    Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
            </div>

            <p className="mt-6 text-xl font-semibold text-gray-800">
              Thành tiền: {formatPrice(product.price * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}