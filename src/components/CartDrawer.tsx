import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { CartItem, ShopkeeperSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onUpdateInstructions: (itemId: string, instructions: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  settings: ShopkeeperSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateInstructions,
  onClearCart,
  onProceedToCheckout,
  settings,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const deliveryFee = items.length > 0 ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;
  const isMinOrderMet = subtotal >= settings.minOrderAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Your Order Basket</h2>
                <p className="text-xs text-stone-500">{items.reduce((acc, i) => acc + i.quantity, 0)} items selected</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                  title="Empty cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-stone-900 font-semibold text-base">Your basket is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover our chef-crafted menu items and add your favorites to place an order.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => {
                const { item, quantity, specialInstructions } = cartItem;
                const itemTotal = item.price * quantity;

                return (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100 bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-sm font-bold text-stone-900 shrink-0">
                            {settings.currency}
                            {itemTotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {settings.currency}
                          {item.price.toFixed(2)} each
                        </p>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-stone-800">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 0)}
                            className="text-stone-400 hover:text-rose-600 text-xs transition-colors cursor-pointer p-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Special instruction notes */}
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Note for chef (e.g. no pickles, spicy)..."
                        value={specialInstructions || ''}
                        onChange={(e) => onUpdateInstructions(item.id, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-700 placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/80 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-800">
                    {settings.currency}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-stone-800">
                    {deliveryFee > 0 ? `${settings.currency}${deliveryFee.toFixed(2)}` : 'FREE'}
                  </span>
                </div>
                <div className="border-t border-stone-200/80 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-amber-600">
                    {settings.currency}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {!isMinOrderMet && (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  Minimum order amount is {settings.currency}
                  {settings.minOrderAmount.toFixed(2)}. Add {settings.currency}
                  {(settings.minOrderAmount - subtotal).toFixed(2)} more to proceed.
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 justify-center">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Estimated prep & delivery: 30-45 mins</span>
              </div>

              <button
                type="button"
                disabled={!isMinOrderMet}
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
