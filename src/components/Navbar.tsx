import React from 'react';
import { ShoppingBag, Store, ShieldCheck, UtensilsCrossed, Phone } from 'lucide-react';
import { ShopkeeperSettings } from '../types';

interface NavbarProps {
  settings: ShopkeeperSettings;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  cartTotal,
  onOpenCart,
  isAdminMode,
  onToggleAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-900 leading-tight">
                {settings.storeName}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-full">
                Open for Orders
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block truncate max-w-sm">
              {settings.storeTagline}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shopkeeper portal toggle button */}
          <button
            type="button"
            onClick={onToggleAdmin}
            className={`px-3 py-2 sm:px-3.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              isAdminMode
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25 ring-2 ring-amber-600/30'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">
              {isAdminMode ? 'Storefront View' : 'Shopkeeper Portal'}
            </span>
            <span className="sm:hidden">
              {isAdminMode ? 'Store' : 'Admin'}
            </span>
          </button>

          {/* Cart Trigger */}
          {!isAdminMode && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative px-3.5 py-2 sm:px-4 sm:py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-stone-900/15 flex items-center gap-2.5 transition-all active:scale-98 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">
                {settings.currency}
                {cartTotal.toFixed(2)}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
