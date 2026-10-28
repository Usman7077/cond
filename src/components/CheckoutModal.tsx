import React, { useState } from 'react';
import { X, MapPin, Phone, MessageSquare, Mail, User, Home, CreditCard, Banknote, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem, CustomerDetails, MapCoordinates, ShopkeeperSettings } from '../types';
import { GoogleDeliveryMap } from './GoogleDeliveryMap';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: ShopkeeperSettings;
  onSubmitOrder: (customer: CustomerDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_on_delivery' | 'bank_transfer_upi'>('cash_on_delivery');
  const [mapLocation, setMapLocation] = useState<MapCoordinates | null>(null);
  const [showMap, setShowMap] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const total = subtotal + settings.deliveryFee;

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsapp(phone);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Contact number is required';
    const effectiveWhatsapp = sameAsPhone ? phone : whatsapp;
    if (!effectiveWhatsapp.trim()) errs.whatsapp = 'WhatsApp number is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!address.trim()) errs.address = 'Street address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const finalCustomer: CustomerDetails = {
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: sameAsPhone ? phone.trim() : whatsapp.trim(),
      email: email.trim(),
      address: address.trim(),
      mapLocation,
      notes: notes.trim(),
      paymentMethod,
    };

    setTimeout(() => {
      onSubmitOrder(finalCustomer);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Complete Your Delivery Details</h3>
              <p className="text-xs text-stone-500">Provide contact information & optional map pin for precise delivery</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Customer Personal Details */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              1. Customer Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zain Hassan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-stone-200'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.email ? 'border-rose-300 bg-rose-50/50' : 'border-stone-200'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact / Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.phone ? 'border-rose-300 bg-rose-50/50' : 'border-stone-200'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-600">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Same as phone</span>
                  </label>
                </div>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="tel"
                    required
                    disabled={sameAsPhone}
                    placeholder="e.g. +1 (555) 019-2834"
                    value={sameAsPhone ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.whatsapp ? 'border-rose-300 bg-rose-50/50' : 'border-stone-200'
                    } ${sameAsPhone ? 'bg-stone-100 text-stone-500 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                  />
                </div>
                {errors.whatsapp && <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3.5 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-600" />
              2. Delivery Address & Google Map Pin
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Street Address / Flat / Building <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. House #12, Rose Avenue, Greenfield Heights, Flat 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl border ${
                  errors.address ? 'border-rose-300 bg-rose-50/50' : 'border-stone-200'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
              />
              {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
            </div>

            {/* Optional Google Map Picker Accordion */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      Select Optional Address on Google Map
                    </span>
                    <span className="ml-2 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {mapLocation ? 'Pin Active ✓' : 'Optional'}
                    </span>
                  </div>
                </div>
                <div className="text-stone-400">
                  {showMap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {showMap && (
                <div className="p-3 border-t border-stone-200 bg-white">
                  <GoogleDeliveryMap
                    selectedLocation={mapLocation}
                    onLocationSelect={(loc) => setMapLocation(loc)}
                  />
                </div>
              )}
            </div>

            {/* Delivery instructions */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Gate code #1234, call before approaching, leave with concierge"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-600" />
              3. Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-semibold ring-1 ring-amber-500/40'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <Banknote className="w-4 h-4 text-amber-600" />
                <span className="text-xs">Cash on Delivery</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  paymentMethod === 'card_on_delivery'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-semibold ring-1 ring-amber-500/40'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card_on_delivery'}
                  onChange={() => setPaymentMethod('card_on_delivery')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span className="text-xs">Card on Delivery</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer_upi'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-semibold ring-1 ring-amber-500/40'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer_upi'}
                  onChange={() => setPaymentMethod('bank_transfer_upi')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-xs">Transfer / UPI</span>
              </label>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-2">
            <div className="font-bold text-stone-800 flex justify-between">
              <span>Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span>{settings.currency}{total.toFixed(2)}</span>
            </div>
            <div className="text-stone-500 text-[11px] divide-y divide-stone-200/50">
              {items.map((ci) => (
                <div key={ci.item.id} className="py-1 flex justify-between">
                  <span>{ci.quantity}x {ci.item.name}</span>
                  <span className="font-mono">{settings.currency}{(ci.item.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-600 text-xs">
              <span>Delivery Fee</span>
              <span>{settings.deliveryFee > 0 ? `${settings.currency}${settings.deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order ({settings.currency}{total.toFixed(2)})</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-400 mt-2">
              Your order will be stored and transmitted directly to the shopkeeper with your delivery address & Google Map location.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
