// src/components/pages/ProductCatalog.tsx
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { Product } from '../types';

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
  // Thêm state để lưu dữ liệu thật từ backend
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const [sortBy, setSortBy] = useState<string>('name');

  // LẤY DỮ LIỆU THẬT TỪ BACKEND (chỉ thêm đoạn này)
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const normalized: Product[] = data.map((p: any) => ({
          id: p.product_id?.toString() || p.id,
          product_name: p.product_name,
          name: p.product_name,
          category: p.category_name || p.category || 'Chưa phân loại',
          category_id: Number(p.category_id) || 0,
          price: Number(p.price),
          description: p.description || 'Không có mô tả',
          image: p.image || 'https://via.placeholder.com/400',
          specs: Array.isArray(p.specs) ? p.specs : [],
          stock: Number(p.stock) || 0,
        }));

        setProducts(normalized);

        // Tự động lấy danh sách danh mục từ dữ liệu thật
        const uniqueCategories = [...new Set(normalized.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);

        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải sản phẩm:', err);
        setProducts([]);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  // Lọc + sắp xếp (giữ nguyên logic cũ, chỉ dùng products thật)
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

  // Sửa định dạng tiền đúng Việt Nam
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading state đẹp
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header – giữ nguyên */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">Danh mục sản phẩm</h1>
          <p className="text-gray-600">
            Tìm sản phẩm và phụ kiện máy tính tốt nhất cho nhu cầu của bạn
          </p>
        </div>

        {/* Filters – giữ nguyên, chỉ dùng categories thật */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block mb-3 text-gray-900 font-medium">Loại sản phẩm</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeCategory === null ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setActiveCategory(null)}
                >
                  Tất cả
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

            <div className="lg:w-64">
              <label className="block mb-3 text-gray-900 font-medium">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Tên (A-Z)</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Số lượng sản phẩm */}
        <div className="mb-6">
          <p className="text-gray-600">
            Đang hiển thị {sortedProducts.length} sản phẩm
            {activeCategory && ` trong danh mục "${activeCategory}"`}
          </p>
        </div>

        {/* Grid sản phẩm – giữ nguyên giao diện, chỉ dùng dữ liệu thật */}
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
                  <h3 className="mb-2 text-gray-900 font-medium line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Tồn kho: {product.stock > 0 ? product.stock : 'Hết hàng'}
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

        {/* Không có sản phẩm */}
        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              Không tìm thấy sản phẩm nào
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