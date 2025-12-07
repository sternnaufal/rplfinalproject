import { Product } from '../App';
import { AlertTriangle, Package, Calendar, TrendingDown, XCircle } from 'lucide-react';

interface StockAlertsProps {
  products: Product[];
  expiredProducts: Product[];
  expiringProducts: Product[];
}

export function StockAlerts({ products, expiredProducts, expiringProducts }: StockAlertsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStockPercentage = (product: Product) => {
    return (product.quantity / product.minStock) * 100;
  };

  const getCriticalityLevel = (product: Product) => {
    const percentage = getStockPercentage(product);
    if (percentage <= 50) return 'critical';
    if (percentage <= 100) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Stock Alerts</h2>
        <p className="text-gray-600">Monitor low stock and expiring products</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Stock</p>
              <p className="text-gray-900">
                {products.filter(p => getCriticalityLevel(p) === 'critical').length}
              </p>
              <p className="text-xs text-red-600 mt-2">&lt; 50% of minimum</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock</p>
              <p className="text-gray-900">
                {products.filter(p => getCriticalityLevel(p) === 'warning').length}
              </p>
              <p className="text-xs text-orange-600 mt-2">Below minimum level</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingDown className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-gray-900">{expiringProducts.length}</p>
              <p className="text-xs text-yellow-600 mt-2">Within 6 months</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900">Low Stock Products</h3>
          <p className="text-sm text-gray-600">Products that need to be reordered</p>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto text-green-500 mb-2" size={48} />
            <p className="text-gray-900 mb-1">All Products Well Stocked</p>
            <p className="text-sm text-gray-600">No low stock alerts at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => {
              const criticalityLevel = getCriticalityLevel(product);
              const stockPercentage = getStockPercentage(product);
              const shortage = Math.max(0, product.minStock - product.quantity);

              return (
                <div key={product.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{product.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          criticalityLevel === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {criticalityLevel === 'critical' ? 'Critical' : 'Low Stock'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Type: {product.type}</span>
                        <span>Category: {product.category === 'medicine' ? 'Medicine' : 'Supplement'}</span>
                        <span>Supplier: {product.supplier}</span>
                        <span>Batch: {product.batchNumber}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      criticalityLevel === 'critical' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <AlertTriangle className={
                        criticalityLevel === 'critical' ? 'text-red-600' : 'text-orange-600'
                      } size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                      <p className="text-gray-900">{product.quantity} {product.unit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Minimum Required</p>
                      <p className="text-gray-900">{product.minStock} {product.unit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Shortage</p>
                      <p className="text-red-600">{shortage} {product.unit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Reorder Cost</p>
                      <p className="text-gray-900">{formatCurrency(shortage * product.price)}</p>
                    </div>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Stock Level</span>
                      <span className={`text-sm ${
                        criticalityLevel === 'critical' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {stockPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          criticalityLevel === 'critical' ? 'bg-red-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${Math.min(100, stockPercentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {isExpiringSoon(product.expiryDate) && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                      <Calendar className="text-yellow-600" size={16} />
                      <p className="text-sm text-yellow-700">
                        Also expiring soon: {product.expiryDate}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expired Products */}
      {expiredProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900">Expired Products</h3>
                <p className="text-sm text-gray-600">Products that have passed expiry date</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {expiredProducts.map(product => (
              <div key={product.id} className="p-6 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900">{product.name}</h4>
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                        Expired
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-gray-900">{product.quantity} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expired Date</p>
                        <p className="text-red-600">{product.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Batch Number</p>
                        <p className="text-gray-900">{product.batchNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Value Loss</p>
                        <p className="text-red-600">{formatCurrency(product.quantity * product.price)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiring Soon Products */}
      {expiringProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-yellow-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Calendar className="text-yellow-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900">Products Expiring Soon</h3>
                <p className="text-sm text-gray-600">Within the next 3 months</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {expiringProducts.map(product => {
              const today = new Date();
              const expiryDate = new Date(product.expiryDate);
              const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
              
              return (
                <div key={product.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{product.name}</h4>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          {daysUntilExpiry} days left
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="text-gray-900">{product.quantity} {product.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expiry Date</p>
                          <p className="text-yellow-600">{product.expiryDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Supplier</p>
                          <p className="text-gray-900">{product.supplier}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Batch Number</p>
                          <p className="text-gray-900">{product.batchNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  function isExpiringSoon(expiryDate: string) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiry > today && expiry <= threeMonthsFromNow;
  }
}