import React from 'react';
import { X, Printer, Phone, MessageSquare, Mail, MapPin, ExternalLink, Calendar, CreditCard } from 'lucide-react';
import { Order, ShopkeeperSettings } from '../types';

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  settings: ShopkeeperSettings;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappCustomerUrl = `https://wa.me/${order.customer.whatsapp.replace(/[^\d+]/g, '').replace('+', '')}?text=${encodeURIComponent(
    `Hello ${order.customer.name}, this is ${settings.storeName} regarding your order #${order.orderNumber}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-6 print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">Order Invoice / Receipt</span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-200 text-stone-800 rounded-md">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-900 bg-white">
          {/* Header */}
          <div className="text-center pb-4 border-b border-stone-200">
            <h2 className="text-xl font-black tracking-tight">{settings.storeName}</h2>
            <p className="text-xs text-stone-500 mt-0.5">{settings.storeTagline}</p>
            <p className="text-[11px] text-stone-400 mt-1">{settings.storeAddress}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Invoice Details</span>
              <p className="font-bold text-stone-800">Order #{order.orderNumber}</p>
              <p className="text-stone-500 text-[11px]">
                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                Status: {order.status}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block text-[11px]">Customer & Contact</span>
              <p className="font-bold text-stone-800">{order.customer.name}</p>
              <p className="text-stone-600 text-[11px]">📞 {order.customer.phone}</p>
              <p className="text-stone-600 text-[11px]">💬 WhatsApp: {order.customer.whatsapp}</p>
              <p className="text-stone-600 text-[11px]">✉️ {order.customer.email}</p>
            </div>
          </div>

          {/* Delivery Location & Map */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-800 font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Delivery Destination:</span>
            </div>
            <p className="text-stone-700 font-medium pl-5">{order.customer.address}</p>

            {order.customer.notes && (
              <p className="text-[11px] text-stone-500 italic pl-5">
                Note: &ldquo;{order.customer.notes}&rdquo;
              </p>
            )}

            {order.customer.mapLocation && (
              <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between pl-5">
                <span className="text-[11px] text-emerald-800 font-mono font-medium">
                  📍 Pinned: {order.customer.mapLocation.lat.toFixed(6)}, {order.customer.mapLocation.lng.toFixed(6)}
                </span>
                <a
                  href={`https://maps.google.com/?q=${order.customer.mapLocation.lat},${order.customer.mapLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-700 hover:text-amber-900 underline font-semibold inline-flex items-center gap-1 print:hidden"
                >
                  <span>Open on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 font-semibold text-center">Qty</th>
                  <th className="pb-2 font-semibold text-right">Price</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2.5">
                      <span className="font-semibold text-stone-800 block">{i.name}</span>
                      {i.specialInstructions && (
                        <span className="text-[10px] text-stone-400 italic">
                          Instruction: {i.specialInstructions}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-center text-stone-700 font-mono">{i.quantity}</td>
                    <td className="py-2.5 text-right text-stone-700 font-mono">
                      {settings.currency}
                      {i.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right text-stone-900 font-mono font-bold">
                      {settings.currency}
                      {(i.price * i.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations */}
            <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono">
                  {settings.currency}
                  {order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-mono">
                  {order.deliveryFee > 0 ? `${settings.currency}${order.deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-black text-sm text-stone-900">
                <span>Total Due / Paid</span>
                <span className="text-amber-600 font-mono">
                  {settings.currency}
                  {order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-400 pt-1">
                <span>Payment Method</span>
                <span className="capitalize">{order.customer.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Customer Contact Buttons (Hidden on print) */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap gap-2 print:hidden">
            <span className="text-xs font-bold text-stone-700 w-full mb-1">Contact Customer:</span>
            <a
              href={whatsappCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </a>
            <a
              href={`tel:${order.customer.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({order.customer.phone})</span>
            </a>
            <a
              href={`mailto:${order.customer.email}?subject=Regarding Order #${order.orderNumber}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
