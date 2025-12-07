import { useState } from 'react';
import { Product, Transaction } from '../App';
import { ArrowDownLeft, ArrowUpRight, Plus, Calendar, Search } from 'lucide-react';

interface TransactionsProps {
  products: Product[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function Transactions({ products, transactions, onAddTransaction }: TransactionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    type: 'incoming' as 'incoming' | 'outgoing',
    quantity: 0,
    reference: '',
    notes: '',
    supplier: '',
    customer: ''
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    const transaction: Omit<Transaction, 'id'> = {
      productId: formData.productId,
      productName: product.name,
      type: formData.type,
      quantity: formData.quantity,
      unit: product.unit,
      price: product.price,
      totalAmount: formData.quantity * product.price,
      date: new Date().toISOString().split('T')[0],
      reference: formData.reference,
      notes: formData.notes,
      supplier: formData.type === 'incoming' ? formData.supplier : undefined,
      customer: formData.type === 'outgoing' ? formData.customer : undefined
    };

    onAddTransaction(transaction);
    setFormData({
      productId: '',
      type: 'incoming',
      quantity: 0,
      reference: '',
      notes: '',
      supplier: '',
      customer: ''
    });
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalIncoming = transactions
    .filter(t => t.type === 'incoming')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalOutgoing = transactions
    .filter(t => t.type === 'outgoing')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Transaction Management</h2>
          <p className="text-gray-600">Record incoming and outgoing inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incoming</p>
              <p className="text-gray-900">{formatCurrency(totalIncoming)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {transactions.filter(t => t.type === 'incoming').length} transactions
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ArrowDownLeft className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Outgoing</p>
              <p className="text-gray-900">{formatCurrency(totalOutgoing)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {transactions.filter(t => t.type === 'outgoing').length} transactions
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ArrowUpRight className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Value</p>
              <p className="text-gray-900">{formatCurrency(totalIncoming - totalOutgoing)}</p>
              <p className="text-xs text-gray-500 mt-2">Incoming - Outgoing</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-4">Add New Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 mb-2">
                  Transaction Type <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="incoming">Incoming (Purchase/Delivery)</option>
                  <option value="outgoing">Outgoing (Sale/Withdrawal)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Product <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock: {product.quantity} {product.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Quantity <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Reference Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="e.g., PO-2024-001 or INV-2024-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {formData.type === 'incoming' && (
                <div>
                  <label className="block text-gray-900 mb-2">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}

              {formData.type === 'outgoing' && (
                <div>
                  <label className="block text-gray-900 mb-2">Customer</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Customer name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-gray-900 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Transaction
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All Transactions</option>
            <option value="incoming">Incoming Only</option>
            <option value="outgoing">Outgoing Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-gray-900">Reference</th>
                <th className="px-6 py-3 text-left text-gray-900">Product</th>
                <th className="px-6 py-3 text-left text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-gray-900">Quantity</th>
                <th className="px-6 py-3 text-left text-gray-900">Total Amount</th>
                <th className="px-6 py-3 text-left text-gray-900">Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                  <td className="px-6 py-4 text-gray-900">{transaction.reference}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{transaction.productName}</p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-500">{transaction.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'incoming' ? (
                        <>
                          <ArrowDownLeft className="text-green-600" size={16} />
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            Incoming
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="text-blue-600" size={16} />
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Outgoing
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {transaction.quantity} {transaction.unit}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {transaction.supplier || transaction.customer || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
