import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { products } from '../data/products';
import type { Product } from '../types';

type ProductDetailProps = {
  productId: string | null;
  onNavigate: (page: string) => void;
  addToCart: (product: Product, quantity: number) => void;
};

export function ProductDetail({ productId, onNavigate, addToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl mb-4 text-gray-900">Không tìm thấy sản phẩm</h2>
          <Button onClick={() => onNavigate('products')}>
            Quay lại danh mục
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => onNavigate('products')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh mục
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <Badge className="mb-4">{product.category}</Badge>
            <h1 className="text-4xl mb-4 text-gray-900">{product.name}</h1>
            <p className="text-3xl text-blue-600 mb-6">{formatPrice(product.price)}</p>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Stok:</span>
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  {product.stock > 0 ? `${product.stock} unit tersedia` : 'Stok Habis'}
                </Badge>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="mb-4 text-gray-900">Đặc điểm kỹ thuật</h3>
              <ul className="space-y-2">
                {product.specs.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-gray-900">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || added}
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Đã thêm
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">Total: {formatPrice(product.price * quantity)}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl mb-6 text-gray-900">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    onNavigate('product-detail');
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-gray-900 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg text-blue-600">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
