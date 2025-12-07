import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';

import type { Order, User, Product } from '../types';

type AdminDashboardProps = {
  onNavigate: (page: string) => void;
  user: User | null;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
};

export function AdminDashboard({ onNavigate, user, orders, setOrders }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    if (user?.role !== 'admin') return;

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      console.log("TOKEN FROM LOCAL STORAGE =", token);



      const [prodRes, catRes, orderRes] = await Promise.all([
        fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        }),

        fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        }),

        fetch("http://localhost:5000/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      

      // KIỂM TRA TẤT CẢ – HOÀN HẢO!
      if (!prodRes.ok || !catRes.ok || !orderRes.ok) {
        if (!orderRes.ok) {
          const err = await orderRes.json().catch(() => ({}));
          toast.error(err.message || 'Không có quyền xem đơn hàng');
        }
        if (!prodRes.ok) toast.error('Lỗi tải sản phẩm');
        if (!catRes.ok) toast.error('Lỗi tải danh mục');
        throw new Error('Lỗi tải dữ liệu admin');
      }

      const rawProducts = await prodRes.json();
      const rawCategories = await catRes.json();
      const rawOrders = await orderRes.json();

      // Xử lý sản phẩm + danh mục
      const categoryMap = Object.fromEntries(
        rawCategories.map((cat: any) => [Number(cat.category_id), cat.category_name])
      );

      const normalizedProducts = rawProducts.map((p: any) => ({
        ...p,
        id: p.product_id.toString(),
        name: p.product_name,
        category_id: Number(p.category_id),
        category: categoryMap[p.category_id] || 'Chưa phân loại',
      }));

      setProducts(normalizedProducts);
      setCategories(rawCategories);

      // Xử lý đơn hàng
      const backendOrders: any[] = rawOrders.data || rawOrders;
      const normalizedOrders: Order[] = backendOrders.map((o: any) => ({
        id: o.order_id.toString(),
        userId: o.user_id,
        date: o.order_date,
        total: Number(o.total_amount),
        status: o.status as Order['status'],
        paymentMethod: o.payment_method || 'COD',
        shippingAddress: o.shipping_address || '',
        phone: o.phone,
        fullName: o.full_name,
        notes: o.notes,
        items: (o.items  || []).map((d: any) => ({
          product: {
            product_id: d.product.product_id,
            product_name: d.product.product_name,
            price: d.product.price,
            image: d.product.image,
            id: d.product.product_id.toString(),
            name: d.product.product_name,
            category: 'Unknown',
          } as Product,
          quantity: d.quantity,
        })),
      }));

      setOrders(normalizedOrders);

    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu admin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [user, setOrders]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // ==================== SẢN PHẨM ====================
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      product_name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: (formData.get('category') as string) || 'Uncategorized',
      stock: Number(formData.get('stock')),
      image: (formData.get('image') as string)?.trim() || 'https://via.placeholder.com/300',
      description: (formData.get('description') as string)?.trim() || '',
    };

    try { 
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newProduct: Product = await res.json();
        setProducts([...products, newProduct]);
        toast.success('Thêm sản phẩm thành công!');
        setIsAddingProduct(false);
        e.currentTarget.reset();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Thêm thất bại');
      }
    } catch {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      product_name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: (formData.get('category') as string) || 'Uncategorized',
      stock: Number(formData.get('stock')),
      image: (formData.get('image') as string)?.trim() || editingProduct.image,
      description: (formData.get('description') as string)?.trim() || '',
    };

    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated: Product = await res.json();
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        toast.success('Cập nhật sản phẩm thành công!');
        setEditingProduct(null);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Cập nhật thất bại');
      }
    } catch {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Xóa sản phẩm này vĩnh viễn?')) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Xóa sản phẩm thành công!');
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  // ==================== DANH MỤC - ĐỒNG BỘ HOÀN TOÀN VỚI DB ====================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newCategory = await res.json();

        setCategories(prev => [...prev, newCategory]);
        setNewCategoryName('');
        setIsAddingCategory(false);
        toast.success('Thêm danh mục thành công');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Tên danh mục đã tồn tại');
      }
    } catch {
      toast.error('Lỗi server');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${encodeURIComponent(editingCategory)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategoryName.trim() }),
      });

      if (res.ok) {
        const updatedCategory = await res.json(); 
        
        setCategories(prev => prev.map(c => 
          c.category_id === updatedCategory.category_id ? updatedCategory : c
        ));

        // Cập nhật tên danh mục trong sản phẩm
        setProducts(prev => prev.map(p => 
          p.category_id === updatedCategory.category_id 
            ? { ...p, category: updatedCategory.category_name }
            : p
        ));
        setEditingCategory(null);
        setEditCategoryName('');
        toast.success('Cập nhật danh mục thành công');
      }
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm(`Xóa danh mục này?\nTất cả sản phẩm sẽ chuyển về "Chưa phân loại"`)) return;

    try {
      await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      const id = Number(categoryId);
      setCategories(prev => prev.filter(c => c.category_id !== id));
      setProducts(prev => prev.map(p => 
      p.category_id === id ? { ...p, category: 'Chưa phân loại', category_id: 0 } : p
    ));
    toast.success('Xóa thành công!');
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  // ==================== RENDER ====================

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl mb-4 text-gray-900">Quyền truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-6">Bạn không có quyền truy cập vào trang này</p>
          <Button onClick={() => onNavigate('home')}>Trở về trang chủ</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg">Đang tải dữ liệu admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl mb-8 text-gray-900">Dashboard Admin</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng số sản phẩm</p>
                  <p className="text-3xl text-gray-900">{products.length}</p>
                </div>
                <Package className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng số đơn hàng</p>
                  <p className="text-3xl text-gray-900">{orders.length}</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lệnh chờ xử lý</p>
                  <p className="text-3xl text-gray-900">{pendingOrders}</p>
                </div>
                <Users className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
                  <p className="text-2xl text-gray-900">{formatPrice(totalRevenue)}</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Quản lý sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Quản lý đơn hàng</TabsTrigger>
            <TabsTrigger value="categories">Quản lý danh mục</TabsTrigger>
          </TabsList>

          {/* ==================== SẢN PHẨM ==================== */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-900">Danh sách sản phẩm</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>

            {/* Form thêm sản phẩm */}
            {isAddingProduct && (
              <Card className="mb-6 border-blue-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Thêm sản phẩm mới</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingProduct(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="add-name">Tên sản phẩm</Label>
                        <Input id="add-name" name="name" placeholder="Gaming PC ROG" required />
                      </div>
                      <div>
                        <Label htmlFor="add-category">Danh mục</Label>
                        <select
                          id="add-category"
                          name="category"
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="add-price">Giá (VND)</Label>
                        <Input id="add-price" name="price" type="number" placeholder="25000000" required />
                      </div>
                      <div>
                        <Label htmlFor="add-stock">Tồn kho</Label>
                        <Input id="add-stock" name="stock" type="number" placeholder="5" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="add-image">Link ảnh (URL)</Label>
                        <Input id="add-image" name="image" placeholder="https://example.com/image.jpg" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="add-desc">Mô tả</Label>
                        <Textarea id="add-desc" name="description" rows={3} required />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                        Hủy
                      </Button>
                      <Button type="submit">Thêm sản phẩm</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Form sửa sản phẩm */}
            {editingProduct && (
              <Card className="mb-6 border-amber-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Chỉnh sửa sản phẩm</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Tên sản phẩm</Label>
                        <Input id="edit-name" name="name" defaultValue={editingProduct.product_name} required />
                      </div>
                      <div>
                        <Label htmlFor="edit-category">Danh mục</Label>
                        <select
                          id="edit-category"
                          name="category"
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          defaultValue={editingProduct.category}
                          required
                        >
                          {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="edit-price">Giá (VND)</Label>
                        <Input id="edit-price" name="price" type="number" defaultValue={editingProduct.price} required />
                      </div>
                      <div>
                        <Label htmlFor="edit-stock">Tồn kho</Label>
                        <Input id="edit-stock" name="stock" type="number" defaultValue={editingProduct.stock} required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="edit-image">Link ảnh</Label>
                        <Input id="edit-image" name="image" defaultValue={editingProduct.image} />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="edit-desc">Mô tả</Label>
                        <Textarea
                          id="edit-desc"
                          name="description"
                          rows={3}
                          defaultValue={editingProduct.description}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                        Hủy
                      </Button>
                      <Button type="submit">Cập nhật</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Danh sách sản phẩm */}
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/300';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-1">{product.product_name}</h3>
                          <Badge variant="secondary" className="mb-2">
                            {product.category}
                          </Badge>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description || 'Không có mô tả'}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-blue-600 font-medium">{formatPrice(product.price)}</span>
                            <span className="text-gray-600">Tồn: {product.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ==================== ĐƠN HÀNG ==================== */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl text-gray-900">Danh sách đơn hàng</h2>
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg text-gray-900 mb-1">Đơn hàng #{order.id}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <Badge>
                        {order.status === 'Pending' && 'Chưa xử lý'}
                        {order.status === 'Processing' && 'Đang xử lý'}
                        {order.status === 'Shipped' && 'Đã gửi'}
                        {order.status === 'Delivered' && 'Hoàn thành'}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Sản phẩm:</p>
                      {order.items.map((item) => (
                        <p key={item.product.id} className="text-sm text-gray-900">
                          {item.product.product_name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Tổng cộng</p>
                        <p className="text-xl text-blue-600">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Processing')}>
                            Xử lý
                          </Button>
                        )}
                        {order.status === 'Processing' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Shipped')}>
                            Gửi hàng
                          </Button>
                        )}
                        {order.status === 'Shipped' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                            Hoàn thành
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Chưa có đơn hàng nào
                </div>
              )}
            </div>
          </TabsContent>

          {/* ==================== DANH MỤC ==================== */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-900">Danh sách danh mục</h2>
              <Button onClick={() => setIsAddingCategory(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Button>
            </div>

            {isAddingCategory && (
              <Card className="mb-6 border-green-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Thêm danh mục mới</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategory} className="flex gap-2">
                    <Input
                      placeholder="Tên danh mục"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                    <Button type="submit">Thêm</Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)}>
                      Hủy
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {editingCategory && (
              <Card className="mb-6 border-amber-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Chỉnh sửa danh mục</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditCategory} className="flex gap-2">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      required
                    />
                    <Button type="submit">Cập nhật</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}>
                      Hủy
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const productCount = products.filter((p) => p.category_id === cat.category_id ).length;
                return (
                  <Card key={cat.category_id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg text-gray-900 mb-1">{cat.category_name}</h3>
                          <p className="text-sm text-gray-600">{productCount} sản phẩm</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(cat.category_id.toString());
                              setEditCategoryName(cat.category_name);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteCategory(cat.category_id.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}