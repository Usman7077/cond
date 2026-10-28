import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check, Clock, Sparkles, MapPin, Truck, ShieldCheck, Heart } from 'lucide-react';
import { MenuItem, CartItem, ShopkeeperSettings } from '../types';

interface CustomerMenuProps {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  settings: ShopkeeperSettings;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  menuItems,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((i) => i.category)));
    return ['ALL', ...cats];
  }, [menuItems]);

  // Cart quantity lookup helper
  const cartQtyMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((ci) => {
      map[ci.item.id] = ci.quantity;
    });
    return map;
  }, [cartItems]);

  // Filter & sort
  const displayedItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Banner with Store Perks */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Home & Office Delivery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Craving Handcrafted Flavors Delivered Fresh?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            Select your favorite gourmet items, pinpoint your exact address on Google Maps, and submit your order directly to our kitchen via WhatsApp or email.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Google Maps Pinpoint Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>{settings.currency}{settings.deliveryFee.toFixed(2)} Flat Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Pay on Delivery</span>
            </div>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Filter Bar: Categories, Search & Sort */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search dishes, drinks, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs cursor-pointer text-stone-800"
            >
              <option value="default">Chef's Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'ALL'
                ? menuItems.length
                : menuItems.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{cat === 'ALL' ? 'All Dishes' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu Items Grid */}
      <section>
        {displayedItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-stone-900 font-bold text-base">No items found</h3>
            <p className="text-xs text-stone-500 mt-1">
              We couldn't find any dish matching your search or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {displayedItems.map((item) => {
              const currentQty = cartQtyMap[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl sm:rounded-3xl border ${
                    item.isAvailable ? 'border-stone-200/80 hover:border-amber-400' : 'border-stone-200/50 opacity-70'
                  } shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden`}
                >
                  <div>
                    {/* Food Photo Container */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge if available */}
                      {item.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-600/95 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
                          {item.badge}
                        </span>
                      )}

                      {/* Sold Out Banner */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
                          <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md">
                            Sold Out Today
                          </span>
                        </div>
                      )}

                      {/* Price Pill */}
                      <span className="absolute bottom-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-md text-stone-900 text-xs sm:text-sm font-black rounded-xl shadow-md font-mono">
                        {settings.currency}
                        {item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {item.prepTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {item.prepTime}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Add to Basket Action */}
                  <div className="p-4 sm:p-5 pt-0">
                    {!item.isAvailable ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 text-xs font-bold text-stone-400 bg-stone-100 rounded-xl cursor-not-allowed"
                      >
                        Currently Unavailable
                      </button>
                    ) : currentQty > 0 ? (
                      <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, currentQty - 1)}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs text-amber-950 font-mono">
                          {currentQty} in basket
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, currentQty + 1)}
                          className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-amber-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-stone-900/10 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>Add to Order</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
