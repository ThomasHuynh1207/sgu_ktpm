export type Product = {
  id: string;
  product_name: string;
  name: string;
  category: string;
  category_id: number ;
  price: number;
  description: string;
  image?: string;
  specs?: string[];
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer' ;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingMethod: string;
  date: string;
  shippingAddress: string;
};