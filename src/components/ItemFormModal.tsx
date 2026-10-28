import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon, Tag, DollarSign, Clock, Check } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  editingItem?: MenuItem | null;
  categories: string[];
}

const PRESET_IMAGES = [
  { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Italian Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
  { label: 'Truffle Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chicken Wings', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Healthy Bowl', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coffee / Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Juice', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chocolate Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tacos Platter', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Burgers & Mains');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [isAvailable, setIsAvailable] = useState(true);
  const [badge, setBadge] = useState('');
  const [prepTime, setPrepTime] = useState('15-20 min');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
      setPrice(editingItem.price.toString());
      if (categories.includes(editingItem.category)) {
        setCategory(editingItem.category);
        setIsCustomCategory(false);
      } else {
        setIsCustomCategory(true);
        setCustomCategory(editingItem.category);
      }
      setImage(editingItem.image);
      setIsAvailable(editingItem.isAvailable);
      setBadge(editingItem.badge || '');
      setPrepTime(editingItem.prepTime || '15-20 min');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory(categories[0] || 'Burgers & Mains');
      setIsCustomCategory(false);
      setCustomCategory('');
      setImage(PRESET_IMAGES[0].url);
      setIsAvailable(true);
      setBadge('');
      setPrepTime('15-20 min');
    }
    setError('');
  }, [editingItem, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an item name');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please provide a valid price');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() || 'General' : category;

    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      category: finalCategory,
      image: image.trim() || PRESET_IMAGES[0].url,
      isAvailable,
      badge: badge.trim() || undefined,
      prepTime: prepTime.trim() || undefined,
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Item for Order'}
              </h3>
              <p className="text-xs text-stone-500">
                {editingItem ? 'Update item pricing, description & stock status' : 'Add a delicious item to your online customer menu'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Item Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Double Smash Cheeseburger"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="12.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
            <div className="flex gap-2">
              {!isCustomCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__custom__">+ Add New Category...</option>
                </select>
              ) : (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Ingredients</label>
            <textarea
              rows={2}
              placeholder="Freshly grilled ingredients, seasoning, allergy notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          {/* Badge & Prep Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Badge / Tag (Optional)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Best Seller, Vegan, New"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preparation Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. 15-20 min"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          </div>

          {/* Image Selection with Presets */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Item Image URL
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                  onError={(e) => {
                    (e.target as any).src = PRESET_IMAGES[0].url;
                  }}
                />
              )}
            </div>

            {/* Quick Presets Carousel */}
            <div>
              <p className="text-[11px] text-stone-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Or pick a preset food image:
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all cursor-pointer ${
                      image === preset.url
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Availability Toggle */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">Stock Availability</span>
              <span className="text-[11px] text-stone-500">
                {isAvailable ? 'Available for customers to order' : 'Marked as Sold Out on menu'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-amber-600/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? 'Save Changes' : 'Add Item to Menu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
