// src/types.ts
export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  category_id: number;
  category_name?: string;

  // Frontend dùng
  id: string;
  name: string;
  category: string;
  specs: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
}

// Order cho frontend hiển thị – ĐÃ THÊM userId
export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress: string;
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  phone?: string;
  fullName?: string;
  notes?: string;
  userId: number;  // ← DÒNG VÀNG ĐÃ ĐƯỢC THÊM!
}

// Order từ backend (giữ nguyên tên DB)
export interface OrderFromBackend {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_method: string;
  shipping_address: string;
  order_date: string;
  full_name?: string;
  phone?: string;
  notes?: string;
  order_details: Array<{
    quantity: number;
    price: number;
    product: {
      product_id: number;
      product_name: string;
      image?: string;
      price: number;
    };
  }>;
}