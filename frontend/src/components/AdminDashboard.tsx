import { useState } from 'react';
import { Navbar } from './Navbar';
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
} from 'lucide-react';
import { products as initialProducts, categories as initialCategories } from '../data/products';
import type { Order, User, Product } from '../App';

type AdminDashboardProps = {
  onNavigate: (page: string) => void;
  user: User | null;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
};

export function AdminDashboard({ onNavigate, user, orders, setOrders }: AdminDashboardProps) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  // === SẢN PHẨM ===
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: `temp-${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string || 'https://via.placeholder.com/300',
      specs: [],
      stock: Number(formData.get('stock')),
    };
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    const formData = new FormData(e.currentTarget);
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string || editingProduct.image,
      stock: Number(formData.get('stock')),
    };
    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // === DANH MỤC ===
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;
    const newName = editCategoryName.trim();
    if (categories.includes(newName)) {
      alert('Danh mục đã tồn tại!');
      return;
    }
    setCategories(categories.map(cat => cat === editingCategory ? newName : cat));
    setProducts(products.map(p => p.category === editingCategory ? { ...p, category: newName } : p));
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Xóa danh mục "${category}"? Tất cả sản phẩm sẽ bị chuyển sang "Uncategorized"`)) {
      setCategories(categories.filter(cat => cat !== category));
      setProducts(products.map(p => p.category === category ? { ...p, category: 'Uncategorized' } : p));
    }
  };

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

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Quản lý sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Quản lý đơn hàng</TabsTrigger>
            <TabsTrigger value="categories">Quản lý danh mục</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-900">Danh sách sản phẩm</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>

            {/* FORM THÊM SẢN PHẨM */}
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
                            <option key={cat} value={cat}>{cat}</option>
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

            {/* FORM CHỈNH SỬA SẢN PHẨM */}
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
                        <Input id="edit-name" name="name" defaultValue={editingProduct.name} required />
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
                            <option key={cat} value={cat}>{cat}</option>
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
                        <Textarea id="edit-desc" name="description" rows={3} defaultValue={editingProduct.description} required />
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

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-1">{product.name}</h3>
                          <Badge variant="secondary" className="mb-2">
                            {product.category}
                          </Badge>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
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

          {/* Orders Tab */}
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
                        {order.status === 'pending' && 'Chưa xử lý'}
                        {order.status === 'processing' && 'Đang xử lý'}
                        {order.status === 'shipped' && 'Đã gửi'}
                        {order.status === 'delivered' && 'Hoàn thành'}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Sản phẩm:</p>
                      {order.items.map((item) => (
                        <p key={item.product.id} className="text-sm text-gray-900">
                          {item.product.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Tổng cộng</p>
                        <p className="text-xl text-blue-600">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}>
                            Xử lý
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                            Gửi hàng
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-900">Danh sách danh mục</h2>
              <Button onClick={() => setIsAddingCategory(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Button>
            </div>

            {/* FORM THÊM DANH MỤC */}
            {isAddingCategory && (
              <Card className="mb-6 border-green-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Thêm danh mục mới</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingCategory(false)}>
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

            {/* FORM CHỈNH SỬA DANH MỤC */}
            {editingCategory && (
              <Card className="mb-6 border-amber-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Chỉnh sửa danh mục</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditCategory} className="flex gap-2">
                    <Input
                      placeholder="Tên mới"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      required
                    />
                    <Button type="submit">Cập nhật</Button>
                    <Button type="button" variant="outline" onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}>
                      Hủy
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* DANH SÁCH DANH MỤC */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const productCount = products.filter(p => p.category === category).length;
                return (
                  <Card key={category}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg text-gray-900 mb-1">{category}</h3>
                          <p className="text-sm text-gray-600">{productCount} sản phẩm</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setEditCategoryName(category);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteCategory(category)}
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