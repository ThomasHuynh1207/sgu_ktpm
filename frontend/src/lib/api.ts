// frontend/src/lib/api.ts
const API_BASE = 'http://localhost:5000/api';

// LẤY TẤT CẢ SẢN PHẨM
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Không tải được sản phẩm');
  return res.json();
};

// LẤY TẤT CẢ DANH MỤC
export const fetchCategories = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Không tải được danh mục');
  return res.json();
};

// LẤY 1 SẢN PHẨM THEO ID    
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
  return res.json();
};