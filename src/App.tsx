import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { StockAlerts } from './components/StockAlerts';
import { Transactions } from './components/Transactions';
import { Reports } from './components/Reports';
import { Package, LayoutDashboard, AlertTriangle, Plus, ArrowLeftRight, FileText } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: 'medicine' | 'supplement';
  type: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  supplier: string;
  expiryDate: string;
  batchNumber: string;
  storageType: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'incoming' | 'outgoing';
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  date: string;
  reference: string;
  notes: string;
  supplier?: string;
  customer?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'alerts' | 'add' | 'transactions' | 'reports'>('dashboard');
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'medicine',
      type: 'Tablet',
      quantity: 500,
      unit: 'tablets',
      minStock: 100,
      price: 5000,
      supplier: 'PT Kimia Farma',
      expiryDate: '2025-12-31',
      batchNumber: 'PARA-2024-001',
      storageType: 'Room Temperature'
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      category: 'medicine',
      type: 'Capsule',
      quantity: 300,
      unit: 'capsules',
      minStock: 150,
      price: 8000,
      supplier: 'PT Kalbe Farma',
      expiryDate: '2025-08-15',
      batchNumber: 'AMOX-2024-012',
      storageType: 'Room Temperature'
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      category: 'supplement',
      type: 'Tablet',
      quantity: 80,
      unit: 'tablets',
      minStock: 100,
      price: 15000,
      supplier: 'PT Natura',
      expiryDate: '2026-03-20',
      batchNumber: 'VITC-2024-005',
      storageType: 'Room Temperature'
    },
    {
      id: '4',
      name: 'Ibuprofen 400mg',
      category: 'medicine',
      type: 'Tablet',
      quantity: 250,
      unit: 'tablets',
      minStock: 100,
      price: 6500,
      supplier: 'PT Kimia Farma',
      expiryDate: '2025-10-10',
      batchNumber: 'IBU-2024-003',
      storageType: 'Room Temperature'
    },
    {
      id: '5',
      name: 'Multivitamin Complex',
      category: 'supplement',
      type: 'Capsule',
      quantity: 45,
      unit: 'capsules',
      minStock: 50,
      price: 25000,
      supplier: 'PT Wellness Indo',
      expiryDate: '2026-01-15',
      batchNumber: 'MULTI-2024-008',
      storageType: 'Cool Place'
    },
    {
      id: '6',
      name: 'Omeprazole 20mg',
      category: 'medicine',
      type: 'Capsule',
      quantity: 180,
      unit: 'capsules',
      minStock: 80,
      price: 12000,
      supplier: 'PT Kalbe Farma',
      expiryDate: '2025-09-30',
      batchNumber: 'OMEP-2024-006',
      storageType: 'Room Temperature'
    },
    {
      id: '7',
      name: 'Fish Oil Omega 3',
      category: 'supplement',
      type: 'Softgel',
      quantity: 30,
      unit: 'softgels',
      minStock: 60,
      price: 35000,
      supplier: 'PT Natura',
      expiryDate: '2026-06-30',
      batchNumber: 'FISH-2024-011',
      storageType: 'Cool Place'
    },
    {
      id: '8',
      name: 'Cetirizine 10mg',
      category: 'medicine',
      type: 'Tablet',
      quantity: 400,
      unit: 'tablets',
      minStock: 120,
      price: 4500,
      supplier: 'PT Dexa Medica',
      expiryDate: '2025-11-20',
      batchNumber: 'CETI-2024-009',
      storageType: 'Room Temperature'
    },
    {
      id: '9',
      name: 'Insulin Glargine',
      category: 'medicine',
      type: 'Injection',
      quantity: 15,
      unit: 'vials',
      minStock: 20,
      price: 450000,
      supplier: 'PT Sanofi Indonesia',
      expiryDate: '2025-03-15',
      batchNumber: 'INS-2024-007',
      storageType: 'Refrigerated'
    }
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX-001',
      productId: '1',
      productName: 'Paracetamol 500mg',
      type: 'incoming',
      quantity: 200,
      unit: 'tablets',
      price: 5000,
      totalAmount: 1000000,
      date: '2024-12-01',
      reference: 'PO-2024-001',
      notes: 'Regular stock replenishment',
      supplier: 'PT Kimia Farma'
    },
    {
      id: 'TRX-002',
      productId: '1',
      productName: 'Paracetamol 500mg',
      type: 'outgoing',
      quantity: 50,
      unit: 'tablets',
      price: 5000,
      totalAmount: 250000,
      date: '2024-12-02',
      reference: 'INV-2024-045',
      notes: 'Customer purchase',
      customer: 'Walk-in Customer'
    },
    {
      id: 'TRX-003',
      productId: '3',
      productName: 'Vitamin C 1000mg',
      type: 'outgoing',
      quantity: 20,
      unit: 'tablets',
      price: 15000,
      totalAmount: 300000,
      date: '2024-12-03',
      reference: 'INV-2024-046',
      notes: 'Customer purchase',
      customer: 'Walk-in Customer'
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
    setActiveTab('inventory');
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
    setActiveTab('inventory');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add');
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `TRX-${String(transactions.length + 1).padStart(3, '0')}`
    };
    setTransactions([newTransaction, ...transactions]);

    // Automatically update stock (REQ-006)
    const product = products.find(p => p.id === transaction.productId);
    if (product) {
      const updatedQuantity = transaction.type === 'incoming'
        ? product.quantity + transaction.quantity
        : product.quantity - transaction.quantity;
      
      setProducts(products.map(p =>
        p.id === transaction.productId
          ? { ...p, quantity: Math.max(0, updatedQuantity) }
          : p
      ));
    }
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const expiredProducts = products.filter(p => new Date(p.expiryDate) < new Date());
  const expiringProducts = products.filter(p => {
    const expiry = new Date(p.expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiry > today && expiry <= threeMonthsFromNow;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-gray-900">Apotek Pasti Sehat</h1>
                <p className="text-sm text-gray-600">Inventory Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Badges */}
              {lowStockProducts.length > 0 && (
                <div className="bg-orange-50 px-3 py-2 rounded-lg">
                  <p className="text-xs text-orange-600">Low Stock: {lowStockProducts.length}</p>
                </div>
              )}
              {expiredProducts.length > 0 && (
                <div className="bg-red-50 px-3 py-2 rounded-lg">
                  <p className="text-xs text-red-600">Expired: {expiredProducts.length}</p>
                </div>
              )}
              {expiringProducts.length > 0 && (
                <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                  <p className="text-xs text-yellow-600">Expiring Soon: {expiringProducts.length}</p>
                </div>
              )}
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'inventory'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package size={20} />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeftRight size={20} />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors relative ${
                activeTab === 'alerts'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle size={20} />
              Stock Alerts
              {(lowStockProducts.length + expiredProducts.length + expiringProducts.length) > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {lowStockProducts.length + expiredProducts.length + expiringProducts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={20} />
              Reports
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('add');
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'add'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              products={products}
              transactions={transactions}
              lowStockProducts={lowStockProducts}
              expiredProducts={expiredProducts}
              expiringProducts={expiringProducts}
            />
          )}
          {activeTab === 'inventory' && (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          {activeTab === 'transactions' && (
            <Transactions
              products={products}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
            />
          )}
          {activeTab === 'alerts' && (
            <StockAlerts
              products={lowStockProducts}
              expiredProducts={expiredProducts}
              expiringProducts={expiringProducts}
            />
          )}
          {activeTab === 'reports' && (
            <Reports
              products={products}
              transactions={transactions}
              lowStockProducts={lowStockProducts}
              expiredProducts={expiredProducts}
              expiringProducts={expiringProducts}
            />
          )}
          {activeTab === 'add' && (
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('inventory');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
