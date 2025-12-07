import { useState, useEffect } from 'react';
import { Product } from '../App';
import { Save, X } from 'lucide-react';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (product: any) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'medicine' as 'medicine' | 'supplement',
    type: '',
    quantity: 0,
    unit: 'tablets',
    minStock: 0,
    price: 0,
    supplier: '',
    expiryDate: '',
    batchNumber: '',
    storageType: 'Room Temperature'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        type: product.type,
        quantity: product.quantity,
        unit: product.unit,
        minStock: product.minStock,
        price: product.price,
        supplier: product.supplier,
        expiryDate: product.expiryDate,
        batchNumber: product.batchNumber,
        storageType: product.storageType
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSubmit({ ...product, ...formData });
    } else {
      onSubmit(formData);
    }
    // Reset form
    setFormData({
      name: '',
      category: 'medicine',
      type: '',
      quantity: 0,
      unit: 'tablets',
      minStock: 0,
      price: 0,
      supplier: '',
      expiryDate: '',
      batchNumber: '',
      storageType: 'Room Temperature'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-gray-600">
          {product ? 'Update product information' : 'Enter product details to add to inventory'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-900 mb-2">
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Paracetamol 500mg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-900 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="medicine">Medicine</option>
                <option value="supplement">Supplement</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-900 mb-2">
                Type <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Tablet, Capsule, Syrup"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-900 mb-2">
                Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-gray-900 mb-2">
                Unit <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="bottles">Bottles</option>
                <option value="boxes">Boxes</option>
                <option value="softgels">Softgels</option>
                <option value="sachets">Sachets</option>
                <option value="ml">ML</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-gray-900 mb-2">
                Minimum Stock Level <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-900 mb-2">
                Price (IDR) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-gray-900 mb-2">
                Supplier <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., PT Kimia Farma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-gray-900 mb-2">
                Expiry Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Batch Number */}
            <div>
              <label className="block text-gray-900 mb-2">
                Batch Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g., BATCH-2024-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Storage Type */}
            <div>
              <label className="block text-gray-900 mb-2">
                Storage Type <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.storageType}
                onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="Room Temperature">Room Temperature</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Freezer">Freezer</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}