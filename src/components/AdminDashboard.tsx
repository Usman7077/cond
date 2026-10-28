import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Printer,
  Settings as SettingsIcon,
  RotateCcw,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { Order, OrderStatus, MenuItem, ShopkeeperSettings } from '../types';
import { updateOrderStatus, updateOrderNotes, deleteOrder, saveMenuItem, deleteMenuItem, toggleItemAvailability, resetMenuItems, saveSettings } from '../services/storageService';
import { ItemFormModal } from './ItemFormModal';
import { OrderReceiptModal } from './OrderReceiptModal';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  settings: ShopkeeperSettings;
  onRefreshData: () => void;
  onCloseAdmin: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  Pending: { label: 'Pending', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  Confirmed: { label: 'Confirmed', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  Preparing: { label: 'Preparing', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  'Out for Delivery': { label: 'Out for Delivery', color: 'text-cyan-800', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  Delivered: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Cancelled: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  menuItems,
  settings,
  onRefreshData,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'items' | 'settings'>('orders');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Item form modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Receipt modal
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Order | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShopkeeperSettings>({ ...settings });
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Calculations for stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatusFilter === 'ALL' || o.status === selectedStatusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      o.orderNumber.toLowerCase().includes(query) ||
      o.customer.name.toLowerCase().includes(query) ||
      o.customer.phone.toLowerCase().includes(query) ||
      o.customer.whatsapp.toLowerCase().includes(query) ||
      o.customer.email.toLowerCase().includes(query) ||
      o.customer.address.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    onRefreshData();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order record?')) {
      deleteOrder(orderId);
      onRefreshData();
    }
  };

  const handleSaveItem = (item: MenuItem) => {
    saveMenuItem(item);
    onRefreshData();
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Delete this item from the customer menu?')) {
      deleteMenuItem(itemId);
      onRefreshData();
    }
  };

  const handleToggleItemStock = (itemId: string) => {
    toggleItemAvailability(itemId);
    onRefreshData();
  };

  const handleResetMenu = () => {
    if (window.confirm('Reset all menu items back to default sample items? Custom added items will be replaced.')) {
      resetMenuItems();
      onRefreshData();
    }
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settingsForm);
    onRefreshData();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const allCategories = Array.from(new Set(menuItems.map((i) => i.category)));

  return (
    <div className="min-h-screen bg-stone-100/70 pb-16">
      {/* Top Banner / Navigation for Admin */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-900">Shopkeeper Admin Portal</h1>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Manager Mode
                </span>
              </div>
              <p className="text-xs text-stone-500">Manage customer orders, status, and menu catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCloseAdmin}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 border-t border-stone-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Orders & Delivery</span>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-black rounded-full animate-pulse">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'items'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Menu Items ({menuItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'settings'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store & Notification Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">Total Orders</span>
              <Package className="w-4 h-4 text-stone-400" />
            </div>
            <p className="text-2xl font-black text-stone-900">{totalOrders}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Recorded in database</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-gradient-to-br from-white to-amber-50/50">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-xs font-semibold">Pending Action</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-900">{pendingOrders}</p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">Awaiting shopkeeper review</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">Completed Deliveries</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{deliveredOrders}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Successfully delivered</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">Total Sales</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">
              {settings.currency}
              {totalRevenue.toFixed(2)}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Excludes cancelled</p>
          </div>
        </div>

        {/* TAB 1: ORDERS & STATUS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Control Bar: Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by order #, name, phone, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              {/* Status Pill Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    selectedStatusFilter === 'ALL'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                {(['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) => {
                  const count = orders.filter((o) => o.status === status).length;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatusFilter(status)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
                        selectedStatusFilter === status
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <span>{status}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-stone-800 font-bold text-sm">No orders match criteria</h3>
                <p className="text-xs text-stone-500 mt-1">Try resetting the status filter or search query.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                  const whatsappCustomerUrl = `https://wa.me/${order.customer.whatsapp
                    .replace(/[^\d+]/g, '')
                    .replace('+', '')}?text=${encodeURIComponent(
                    `Hello ${order.customer.name}, updates regarding your order #${order.orderNumber} from ${settings.storeName}: Current status is ${order.status}.`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
                    >
                      {/* Order Card Header */}
                      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status Dropdown Controller */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-stone-500">Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color} ${cfg.border} focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer shadow-2xs`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Order Details Body */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Column 1: Customer Contact & Delivery Details */}
                        <div className="space-y-2 text-xs">
                          <h4 className="font-bold text-stone-900 text-xs flex items-center justify-between">
                            <span>Customer Information</span>
                          </h4>

                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 space-y-1.5">
                            <p className="font-semibold text-stone-900 text-sm">{order.customer.name}</p>
                            <div className="flex items-center gap-2 text-stone-600">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span>{order.customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp: {order.customer.whatsapp}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                              <Mail className="w-3.5 h-3.5 text-blue-500" />
                              <span>{order.customer.email}</span>
                            </div>
                          </div>

                          {/* Quick Action Buttons to Contact Customer */}
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={whatsappCustomerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`mailto:${order.customer.email}?subject=Your Order #${order.orderNumber}`}
                              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </a>
                          </div>
                        </div>

                        {/* Column 2: Delivery Address & Google Map Pin */}
                        <div className="space-y-2 text-xs">
                          <h4 className="font-bold text-stone-900 text-xs">Delivery Address & Map Pin</h4>

                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 space-y-2">
                            <div>
                              <span className="text-[11px] text-stone-400 block">Address Line</span>
                              <p className="font-medium text-stone-800">{order.customer.address}</p>
                            </div>

                            {order.customer.notes && (
                              <div className="pt-1.5 border-t border-stone-200/60">
                                <span className="text-[11px] text-stone-400 block">Customer Note:</span>
                                <p className="text-[11px] text-stone-600 italic">&ldquo;{order.customer.notes}&rdquo;</p>
                              </div>
                            )}

                            {/* Google Map Pin Status */}
                            {order.customer.mapLocation ? (
                              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                                  <MapPin className="w-4 h-4 text-emerald-600" />
                                  <span className="text-[11px] font-mono">
                                    {order.customer.mapLocation.lat.toFixed(5)}, {order.customer.mapLocation.lng.toFixed(5)}
                                  </span>
                                </div>
                                <a
                                  href={`https://maps.google.com/?q=${order.customer.mapLocation.lat},${order.customer.mapLocation.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                >
                                  <span>View Pin on Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ) : (
                              <div className="pt-1.5 border-t border-stone-200/60 text-[11px] text-stone-400">
                                No map pin coordinates selected
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 3: Items Ordered & Financials */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-stone-900 text-xs">
                            <span>Ordered Items</span>
                            <span className="text-amber-600 font-mono text-sm">
                              {settings.currency}
                              {order.total.toFixed(2)}
                            </span>
                          </div>

                          <div className="border border-stone-200/80 rounded-xl p-3 bg-white space-y-1.5 max-h-36 overflow-y-auto">
                            {order.items.map((i) => (
                              <div key={i.id} className="flex justify-between items-start text-[11px]">
                                <div>
                                  <span className="font-semibold text-stone-800">
                                    {i.quantity}x {i.name}
                                  </span>
                                  {i.specialInstructions && (
                                    <p className="text-[10px] text-amber-700 italic">
                                      &bull; Note: {i.specialInstructions}
                                    </p>
                                  )}
                                </div>
                                <span className="font-mono text-stone-700 font-medium shrink-0 ml-2">
                                  {settings.currency}
                                  {(i.price * i.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-stone-100 flex justify-between text-[11px] text-stone-500">
                              <span>Delivery Fee</span>
                              <span>
                                {order.deliveryFee > 0
                                  ? `${settings.currency}${order.deliveryFee.toFixed(2)}`
                                  : 'FREE'}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px] text-stone-500">
                              <span>Payment</span>
                              <span className="capitalize">{order.customer.paymentMethod.replace(/_/g, ' ')}</span>
                            </div>
                          </div>

                          {/* Order Actions: Receipt & Delete */}
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setViewingReceiptOrder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View / Print Invoice</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU ITEMS CATALOG MANAGEMENT */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Online Menu Items</h3>
                <p className="text-xs text-stone-500">
                  Add, edit, adjust prices or toggle stock availability for your customers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetMenu}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sample Menu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsItemModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-amber-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Item for Order</span>
                </button>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border ${
                    item.isAvailable ? 'border-stone-200/90' : 'border-stone-200/50 opacity-75'
                  } shadow-2xs overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    {/* Item Image */}
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                          {item.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-black rounded-lg shadow-2xs font-mono">
                        {settings.currency}
                        {item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Item Body */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {item.prepTime && (
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.prepTime}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm leading-snug">{item.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
                    {/* Stock toggle */}
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={() => handleToggleItemStock(item.id)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={`text-xs font-semibold ${item.isAvailable ? 'text-emerald-700' : 'text-stone-400'}`}>
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(item);
                          setIsItemModalOpen(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE & NOTIFICATION SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Storefront & Notification Setup</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure your shopkeeper email and WhatsApp number to receive immediate customer orders
              </p>
            </div>

            {savedSettingsNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Store settings updated and saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Store / Business Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Store Tagline / Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.storeTagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeTagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shopkeeper Notification Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Customer order copies & receipts are sent to this address.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shopkeeper WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Include country code (e.g. +1234567890).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Flat Delivery Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={settingsForm.deliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Minimum Order ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={settingsForm.minOrderAmount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, minOrderAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Store Physical Address</label>
                <input
                  type="text"
                  value={settingsForm.storeAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Storefront Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Item Form Modal */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
        categories={allCategories}
      />

      {/* Invoice Receipt Modal */}
      <OrderReceiptModal
        order={viewingReceiptOrder}
        isOpen={!!viewingReceiptOrder}
        onClose={() => setViewingReceiptOrder(null)}
        settings={settings}
      />
    </div>
  );
};
