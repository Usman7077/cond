import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Mail, MapPin, ExternalLink, Copy, Check, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Order, ShopkeeperSettings } from '../types';
import { generateWhatsAppUrl, generateMailtoUrl } from '../services/storageService';

interface OrderConfirmationModalProps {
  order: Order | null;
  settings: ShopkeeperSettings;
  onClose: () => void;
  onViewOrderDetails?: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  settings,
  onClose,
  onViewOrderDetails,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  if (!order) return null;

  const whatsappUrl = generateWhatsAppUrl(order, settings);
  const mailtoUrl = generateMailtoUrl(order, settings);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateEmailSend = () => {
    setEmailSentAlert(true);
    // Also trigger mailto in case browser allows it
    window.location.href = mailtoUrl;
    setTimeout(() => setEmailSentAlert(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-7 text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <PackageCheck className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Order Placed Successfully!</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your order has been recorded in the store database and queued for preparation.
          </p>

          {/* Order ID Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-xs font-mono">
            <span>Order #{order.orderNumber}</span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="text-emerald-200 hover:text-white transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Shopkeeper Notification Action Section */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Notify Shopkeeper Directly
                </h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  Send your order details & delivery map location directly to the shopkeeper via WhatsApp or Email:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-98 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Send via WhatsApp</span>
              </a>

              {/* Email Button */}
              <button
                type="button"
                onClick={handleSimulateEmailSend}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20 active:scale-98 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email to Shopkeeper</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-800/80 text-center">
              Shopkeeper: <span className="font-semibold">{settings.email}</span> &bull; {settings.whatsappNumber}
            </p>
          </div>

          {emailSentAlert && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Opening email client with pre-filled order receipt & delivery location.</span>
            </div>
          )}

          {/* Delivery & Customer Details */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2.5 text-xs text-stone-700">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-stone-900">Delivery Information</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                Status: {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block">Recipient</span>
                <span className="font-semibold text-stone-800">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Contact Phone</span>
                <span className="font-semibold text-stone-800">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block">WhatsApp</span>
                <span className="font-semibold text-stone-800">{order.customer.whatsapp}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Email</span>
                <span className="font-semibold text-stone-800">{order.customer.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <span className="text-stone-400 block text-[11px]">Delivery Address</span>
              <p className="font-medium text-stone-800 mt-0.5">{order.customer.address}</p>
            </div>

            {/* Google Map Pin Highlight */}
            {order.customer.mapLocation && (
              <div className="p-2.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-950 block">Google Maps Delivery Pin</span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      {order.customer.mapLocation.lat.toFixed(5)}, {order.customer.mapLocation.lng.toFixed(5)}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${order.customer.mapLocation.lat},${order.customer.mapLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Open Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Items Breakdown */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-900 block">Items in this Order</span>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-3 bg-white">
              {order.items.map((i) => (
                <div key={i.id} className="py-1.5 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-stone-800">
                      {i.quantity}x {i.name}
                    </span>
                    {i.specialInstructions && (
                      <p className="text-[11px] text-stone-400 italic">Note: {i.specialInstructions}</p>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-stone-800">
                    {settings.currency}
                    {(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-1 flex justify-between font-bold text-sm text-stone-900 border-t border-stone-200">
                <span>Total Paid / Due</span>
                <span className="text-amber-600">
                  {settings.currency}
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Done & Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
