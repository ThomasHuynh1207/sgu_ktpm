// src/types.ts (hoặc src/types/index.ts)

export interface Product {
  product_id: number;           // DB dùng product_id (SERIAL)
  product_name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category_id: number;
  // Nếu frontend cần hiển thị tên category luôn thì thêm:

  id: string;                    // = product_id.toString()
  name: string;                  // = product_name
  category: string;              // = category_name
  specs: string[];               // mảng thông số kỹ thuật
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  user_id: number;              // DB trả về user_id (SERIAL), không phải string
  username: string;
  email: string;
  full_name?: string;           // có thể null
  phone?: string;               // string mới đúng (0901234567), không phải number
  address?: string;
  role: 'admin' | 'customer';
  // Nếu backend có trả thêm token thì thêm:
  // token?: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  payment_method: 'COD' | 'TRANSFER';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  order_date: string;           // hoặc Date nếu mày parse
  notes?: string;
  phone?: string;
  full_name?: string;

  // Chi tiết đơn hàng (khi lấy danh sách)
  order_details?: Array<{
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

// Dành cho giỏ hàng local (nếu dùng context hoặc zustand)
export interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}