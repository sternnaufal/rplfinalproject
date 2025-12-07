import { useState } from 'react';
import { Product } from '../App';
import { Search, Edit, Trash2, AlertCircle, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'medicine' | 'supplement'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'price'>('name');

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      if (sortBy === 'price') return b.price - a.price;
      return 0;
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    return expiry <= sixMonthsFromNow;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Product Inventory</h2>
        <p className="text-gray-600">Manage your medicine and supplement stock</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products, supplier, or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All Categories</option>
            <option value="medicine">Medicines</option>
            <option value="supplement">Supplements</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      {/* Product Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-900">Product</th>
                <th className="px-6 py-3 text-left text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-gray-900">Supplier</th>
                <th className="px-6 py-3 text-left text-gray-900">Expiry</th>
                <th className="px-6 py-3 text-left text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">No products found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.type}</p>
                        <p className="text-xs text-gray-500">Batch: {product.batchNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.category === 'medicine'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.category === 'medicine' ? 'Medicine' : 'Supplement'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{product.quantity} {product.unit}</p>
                      <p className="text-sm text-gray-600">Min: {product.minStock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{formatCurrency(product.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{product.supplier}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600">{product.expiryDate}</p>
                        {isExpiringSoon(product.expiryDate) && (
                          <AlertCircle className="text-orange-500" size={16} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantity <= product.minStock ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                              onDelete(product.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
