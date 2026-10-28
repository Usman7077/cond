import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerMenu } from './components/CustomerMenu';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  MenuItem,
  CartItem,
  Order,
  CustomerDetails,
  ShopkeeperSettings,
} from './types';
import {
  getMenuItems,
  getOrders,
  getSettings,
  saveOrder,
} from './services/storageService';
import { UtensilsCrossed, Phone, Mail, MessageSquare, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<ShopkeeperSettings>(getSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Google Maps Quota exceeded state listener (Case A Demo Key requirement)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Data reload helper
  const reloadData = useCallback(() => {
    setMenuItems(getMenuItems());
    setOrders(getOrders());
    setSettings(getSettings());
  }, []);

  // Initial load & storage sync listener
  useEffect(() => {
    reloadData();

    const handleStorageUpdate = () => {
      reloadData();
    };

    window.addEventListener('quickorder-storage-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('quickorder-storage-update', handleStorageUpdate);
    };
  }, [reloadData]);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((ci) => ci.item.id !== itemId);
      }
      return prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity: newQty } : ci
      );
    });
  };

  const handleUpdateInstructions = (itemId: string, instructions: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, specialInstructions: instructions } : ci
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const cartSubtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const cartTotal = cart.length > 0 ? cartSubtotal + settings.deliveryFee : 0;

  // Checkout submission
  const handleSubmitOrder = (customer: CustomerDetails) => {
    const newOrderNumber = `QO-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: now,
      updatedAt: now,
      customer,
      items: cart.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        specialInstructions: ci.specialInstructions,
        category: ci.item.category,
      })),
      subtotal: cartSubtotal,
      deliveryFee: settings.deliveryFee,
      total: cartTotal,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Customer placed order online',
        },
      ],
    };

    saveOrder(newOrder);
    reloadData();
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setConfirmedOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Quota Exceeded Sticky Notice (Case A Demo Key Quota Requirement) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        settings={settings}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
      />

      {/* Main View: Customer Storefront OR Shopkeeper Admin Portal */}
      {isAdminMode ? (
        <AdminDashboard
          orders={orders}
          menuItems={menuItems}
          settings={settings}
          onRefreshData={reloadData}
          onCloseAdmin={() => setIsAdminMode(false)}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <CustomerMenu
            menuItems={menuItems}
            cartItems={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            settings={settings}
          />
        </main>
      )}

      {/* Floating Cart Button for Mobile when items exist and cart is closed */}
      {!isAdminMode && cartCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="fixed bottom-5 left-0 right-0 z-30 px-4 max-w-md mx-auto pointer-events-none sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-between pointer-events-auto transition-transform active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {cartCount}
              </span>
              <span>View Order Basket</span>
            </div>
            <span className="font-mono">
              {settings.currency}
              {cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Footer */}
      {!isAdminMode && (
        <footer className="mt-auto bg-white border-t border-stone-200 py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="font-black text-stone-900 text-base">{settings.storeName}</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
                  {settings.storeTagline}
                </p>
                <p className="text-xs text-stone-400">
                  {settings.storeAddress}
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-stone-600">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Shopkeeper Direct Contact
                </h4>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d+]/g, '').replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    WhatsApp: {settings.whatsappNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>Call: {settings.phone}</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-600">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Order Dispatch & Tracking
                </h4>
                <p className="text-stone-500 leading-relaxed">
                  Every order is stored in the database and generates an instant delivery receipt with customer contact info & Google Map coordinates for quick dispatch.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Shopkeeper / Kitchen Order Management Login</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
              <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
              <p className="flex items-center gap-1">
                <span>Fast checkout &bull; Google Maps pin delivery &bull; Real-time status</span>
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateInstructions={handleUpdateInstructions}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        settings={settings}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        settings={settings}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Order Confirmation Modal with WhatsApp & Email direct dispatch */}
      <OrderConfirmationModal
        order={confirmedOrder}
        settings={settings}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  );
}
