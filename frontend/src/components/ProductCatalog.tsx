import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Navbar } from './Navbar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { products, categories } from '../data/products';
import type { Product } from '../App';

type ProductCatalogProps = {
  onNavigate: (page: string) => void;
  onViewProduct: (productId: string) => void;
  selectedCategory: string | null;
  addToCart: (product: Product, quantity: number) => void;
};

export function ProductCatalog({
  onNavigate,
  onViewProduct,
  selectedCategory,
  addToCart,
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">Danh mục sản phẩm</h1>
          <p className="text-gray-600">
            Tìm sản phẩm và phụ kiện máy tính tốt nhất cho nhu cầu của bạn
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block mb-3 text-gray-900">Loại</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeCategory === null ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setActiveCategory(null)}
                >
                  Tất cả sản phẩm
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-64">
              <label className="block mb-3 text-gray-900">Phân loại</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Tên (A-Z)</option>
                <option value="price-asc">Giá (Thấp nhất)</option>
                <option value="price-desc">Giá (Cao nhất)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Đang hiển thị {sortedProducts.length} sản phẩm
            {activeCategory && ` dalam kategori "${activeCategory}"`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="cursor-pointer" onClick={() => onViewProduct(product.id)}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <h3 className="mb-2 text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl text-blue-600">{formatPrice(product.price)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Tồn kho : {product.stock > 0 ? product.stock : 'Hết hàng'}
                  </div>
                </CardContent>
              </div>
              <div className="px-4 pb-4">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              Không có sản phẩm nào trong danh mục này
            </p>
            <Button onClick={() => setActiveCategory(null)}>
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
