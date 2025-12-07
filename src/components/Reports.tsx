import { useState } from 'react';
import { Product, Transaction } from '../App';
import { FileText, Download, Printer, Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';

interface ReportsProps {
  products: Product[];
  transactions: Transaction[];
  lowStockProducts: Product[];
  expiredProducts: Product[];
  expiringProducts: Product[];
}

export function Reports({ products, transactions, lowStockProducts, expiredProducts, expiringProducts }: ReportsProps) {
  const [reportType, setReportType] = useState<'stock' | 'expired' | 'expiring' | 'transactions' | 'lowstock'>('stock');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleExportCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'stock') {
      filename = 'stock_report.csv';
      csvContent = 'Product Name,Category,Type,Quantity,Unit,Price,Supplier,Expiry Date,Batch Number,Storage\n';
      products.forEach(p => {
        csvContent += `"${p.name}","${p.category}","${p.type}",${p.quantity},"${p.unit}",${p.price},"${p.supplier}","${p.expiryDate}","${p.batchNumber}","${p.storageType}"\n`;
      });
    } else if (reportType === 'expired') {
      filename = 'expired_products_report.csv';
      csvContent = 'Product Name,Category,Quantity,Unit,Expiry Date,Supplier,Batch Number\n';
      expiredProducts.forEach(p => {
        csvContent += `"${p.name}","${p.category}",${p.quantity},"${p.unit}","${p.expiryDate}","${p.supplier}","${p.batchNumber}"\n`;
      });
    } else if (reportType === 'expiring') {
      filename = 'expiring_products_report.csv';
      csvContent = 'Product Name,Category,Quantity,Unit,Expiry Date,Supplier,Batch Number\n';
      expiringProducts.forEach(p => {
        csvContent += `"${p.name}","${p.category}",${p.quantity},"${p.unit}","${p.expiryDate}","${p.supplier}","${p.batchNumber}"\n`;
      });
    } else if (reportType === 'lowstock') {
      filename = 'low_stock_report.csv';
      csvContent = 'Product Name,Category,Current Stock,Minimum Stock,Shortage,Supplier\n';
      lowStockProducts.forEach(p => {
        const shortage = Math.max(0, p.minStock - p.quantity);
        csvContent += `"${p.name}","${p.category}",${p.quantity},${p.minStock},${shortage},"${p.supplier}"\n`;
      });
    } else if (reportType === 'transactions') {
      filename = 'transactions_report.csv';
      csvContent = 'Date,Reference,Product,Type,Quantity,Unit,Total Amount,Partner\n';
      transactions.forEach(t => {
        const partner = t.supplier || t.customer || '-';
        csvContent += `"${t.date}","${t.reference}","${t.productName}","${t.type}",${t.quantity},"${t.unit}",${t.totalAmount},"${partner}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter(t => {
      const transDate = new Date(t.date);
      
      switch (dateFilter) {
        case 'today':
          return transDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Reports & Analytics</h2>
          <p className="text-gray-600">Generate and export inventory reports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer size={20} />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => setReportType('stock')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'stock'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Package className={reportType === 'stock' ? 'text-green-600' : 'text-gray-400'} size={24} />
            <p className="mt-2 text-sm text-gray-900">Stock Report</p>
          </button>

          <button
            onClick={() => setReportType('lowstock')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'lowstock'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlertTriangle className={reportType === 'lowstock' ? 'text-green-600' : 'text-gray-400'} size={24} />
            <p className="mt-2 text-sm text-gray-900">Low Stock</p>
          </button>

          <button
            onClick={() => setReportType('expired')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'expired'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlertTriangle className={reportType === 'expired' ? 'text-green-600' : 'text-gray-400'} size={24} />
            <p className="mt-2 text-sm text-gray-900">Expired</p>
          </button>

          <button
            onClick={() => setReportType('expiring')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'expiring'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Calendar className={reportType === 'expiring' ? 'text-green-600' : 'text-gray-400'} size={24} />
            <p className="mt-2 text-sm text-gray-900">Expiring Soon</p>
          </button>

          <button
            onClick={() => setReportType('transactions')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'transactions'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TrendingUp className={reportType === 'transactions' ? 'text-green-600' : 'text-gray-400'} size={24} />
            <p className="mt-2 text-sm text-gray-900">Transactions</p>
          </button>
        </div>
      </div>

      {/* Date Filter for Transactions */}
      {reportType === 'transactions' && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-4 py-2 rounded-lg ${
                dateFilter === 'today'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-4 py-2 rounded-lg ${
                dateFilter === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-4 py-2 rounded-lg ${
                dateFilter === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                dateFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      )}

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print:shadow-none">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <h3 className="text-gray-900">
                {reportType === 'stock' && 'Complete Stock Report'}
                {reportType === 'lowstock' && 'Low Stock Products Report'}
                {reportType === 'expired' && 'Expired Products Report'}
                {reportType === 'expiring' && 'Products Expiring Soon Report'}
                {reportType === 'transactions' && 'Transaction History Report'}
              </h3>
              <p className="text-sm text-gray-600">
                Generated on {new Date().toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stock Report */}
          {reportType === 'stock' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-900">Product</th>
                    <th className="px-4 py-3 text-left text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left text-gray-900">Stock</th>
                    <th className="px-4 py-3 text-left text-gray-900">Value</th>
                    <th className="px-4 py-3 text-left text-gray-900">Supplier</th>
                    <th className="px-4 py-3 text-left text-gray-900">Expiry</th>
                    <th className="px-4 py-3 text-left text-gray-900">Storage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.type}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.category === 'medicine'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {product.quantity} {product.unit}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {formatCurrency(product.quantity * product.price)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.supplier}</td>
                      <td className="px-4 py-3 text-gray-600">{product.expiryDate}</td>
                      <td className="px-4 py-3 text-gray-600">{product.storageType}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-4 py-3 text-gray-900">Total Stock Value</td>
                    <td colSpan={4} className="px-4 py-3 text-gray-900">
                      {formatCurrency(products.reduce((sum, p) => sum + (p.quantity * p.price), 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Low Stock Report */}
          {reportType === 'lowstock' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-900">Product</th>
                    <th className="px-4 py-3 text-left text-gray-900">Current</th>
                    <th className="px-4 py-3 text-left text-gray-900">Minimum</th>
                    <th className="px-4 py-3 text-left text-gray-900">Shortage</th>
                    <th className="px-4 py-3 text-left text-gray-900">Reorder Cost</th>
                    <th className="px-4 py-3 text-left text-gray-900">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockProducts.map(product => {
                    const shortage = Math.max(0, product.minStock - product.quantity);
                    return (
                      <tr key={product.id}>
                        <td className="px-4 py-3 text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {product.quantity} {product.unit}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {product.minStock} {product.unit}
                        </td>
                        <td className="px-4 py-3 text-red-600">
                          {shortage} {product.unit}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {formatCurrency(shortage * product.price)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{product.supplier}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Expired Products Report */}
          {reportType === 'expired' && (
            <div className="overflow-x-auto">
              {expiredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No expired products found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-900">Product</th>
                      <th className="px-4 py-3 text-left text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-gray-900">Quantity</th>
                      <th className="px-4 py-3 text-left text-gray-900">Expired Date</th>
                      <th className="px-4 py-3 text-left text-gray-900">Batch</th>
                      <th className="px-4 py-3 text-left text-gray-900">Value Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expiredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{product.category}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {product.quantity} {product.unit}
                        </td>
                        <td className="px-4 py-3 text-red-600">{product.expiryDate}</td>
                        <td className="px-4 py-3 text-gray-600">{product.batchNumber}</td>
                        <td className="px-4 py-3 text-red-600">
                          {formatCurrency(product.quantity * product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Expiring Soon Report */}
          {reportType === 'expiring' && (
            <div className="overflow-x-auto">
              {expiringProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No products expiring in the next 3 months</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-900">Product</th>
                      <th className="px-4 py-3 text-left text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-gray-900">Quantity</th>
                      <th className="px-4 py-3 text-left text-gray-900">Expiry Date</th>
                      <th className="px-4 py-3 text-left text-gray-900">Days Until Expiry</th>
                      <th className="px-4 py-3 text-left text-gray-900">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expiringProducts.map(product => {
                      const today = new Date();
                      const expiryDate = new Date(product.expiryDate);
                      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                      
                      return (
                        <tr key={product.id}>
                          <td className="px-4 py-3 text-gray-900">{product.name}</td>
                          <td className="px-4 py-3 text-gray-600">{product.category}</td>
                          <td className="px-4 py-3 text-gray-900">
                            {product.quantity} {product.unit}
                          </td>
                          <td className="px-4 py-3 text-yellow-600">{product.expiryDate}</td>
                          <td className="px-4 py-3 text-yellow-600">{daysUntilExpiry} days</td>
                          <td className="px-4 py-3 text-gray-600">{product.supplier}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Transactions Report */}
          {reportType === 'transactions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-gray-900">{filteredTransactions.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Incoming Value</p>
                  <p className="text-gray-900">
                    {formatCurrency(filteredTransactions.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.totalAmount, 0))}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Outgoing Value</p>
                  <p className="text-gray-900">
                    {formatCurrency(filteredTransactions.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.totalAmount, 0))}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left text-gray-900">Reference</th>
                      <th className="px-4 py-3 text-left text-gray-900">Product</th>
                      <th className="px-4 py-3 text-left text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-gray-900">Quantity</th>
                      <th className="px-4 py-3 text-left text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 text-gray-600">{transaction.date}</td>
                        <td className="px-4 py-3 text-gray-900">{transaction.reference}</td>
                        <td className="px-4 py-3 text-gray-900">{transaction.productName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'incoming'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {transaction.quantity} {transaction.unit}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {formatCurrency(transaction.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
