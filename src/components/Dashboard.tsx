import { Product } from '../App';
import { Package, AlertTriangle, TrendingUp, DollarSign, Pill, Heart, Calendar, XCircle } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  transactions?: any[];
  lowStockProducts?: Product[];
  expiredProducts?: Product[];
  expiringProducts?: Product[];
}

export function Dashboard({ products, transactions = [], lowStockProducts = [], expiredProducts = [], expiringProducts = [] }: DashboardProps) {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;
  const medicines = products.filter(p => p.category === 'medicine');
  const supplements = products.filter(p => p.category === 'supplement');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time inventory statistics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-gray-900">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-2">Active items in stock</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Units</p>
              <p className="text-gray-900">{totalQuantity.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Items in inventory</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-gray-900">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-500 mt-2">Current stock worth</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
              <p className="text-gray-900">{lowStockCount}</p>
              <p className="text-xs text-red-500 mt-2">Requires attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Pill className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-gray-900">Medicines</h3>
              <p className="text-sm text-gray-600">Pharmaceutical products</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Products</span>
              <span className="text-gray-900">{medicines.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Units</span>
              <span className="text-gray-900">
                {medicines.reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stock Value</span>
              <span className="text-gray-900">
                {formatCurrency(medicines.reduce((sum, p) => sum + (p.quantity * p.price), 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Heart className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-gray-900">Supplements</h3>
              <p className="text-sm text-gray-600">Health supplements</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Products</span>
              <span className="text-gray-900">{supplements.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Units</span>
              <span className="text-gray-900">
                {supplements.reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stock Value</span>
              <span className="text-gray-900">
                {formatCurrency(supplements.reduce((sum, p) => sum + (p.quantity * p.price), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Low Stock Items */}
      {lowStockCount > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-gray-900">Low Stock Warning</h3>
              <p className="text-sm text-gray-600">Products requiring reorder</p>
            </div>
          </div>
          <div className="space-y-2">
            {products
              .filter(p => p.quantity <= p.minStock)
              .slice(0, 5)
              .map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {product.quantity} {product.unit} | Min: {product.minStock}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                    Low Stock
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}