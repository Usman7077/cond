import { MenuItem, Order, OrderStatus, ShopkeeperSettings } from '../types';
import { DEFAULT_SETTINGS, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/initialData';

const STORAGE_KEYS = {
  MENU_ITEMS: 'quickorder_menu_items_v1',
  ORDERS: 'quickorder_orders_v1',
  SETTINGS: 'quickorder_settings_v1',
};

// Dispatch helper for reactivity across tabs & views
function dispatchStorageEvent(key: string) {
  window.dispatchEvent(new CustomEvent('quickorder-storage-update', { detail: { key } }));
}

// ==================== MENU ITEMS ====================

export function getMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading menu items from storage', err);
    return INITIAL_MENU_ITEMS;
  }
}

export function saveMenuItem(item: MenuItem): void {
  const current = getMenuItems();
  const index = current.findIndex((i) => i.id === item.id);
  let updated: MenuItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));
  dispatchStorageEvent(STORAGE_KEYS.MENU_ITEMS);
}

export function toggleItemAvailability(id: string): void {
  const current = getMenuItems();
  const updated = current.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));
  dispatchStorageEvent(STORAGE_KEYS.MENU_ITEMS);
}

export function deleteMenuItem(id: string): void {
  const current = getMenuItems();
  const updated = current.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));
  dispatchStorageEvent(STORAGE_KEYS.MENU_ITEMS);
}

export function resetMenuItems(): void {
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(INITIAL_MENU_ITEMS));
  dispatchStorageEvent(STORAGE_KEYS.MENU_ITEMS);
}

// ==================== ORDERS ====================

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading orders from storage', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrder(order: Order): void {
  const current = getOrders();
  const index = current.findIndex((o) => o.id === order.id);
  let updated: Order[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = order;
  } else {
    updated = [order, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  dispatchStorageEvent(STORAGE_KEYS.ORDERS);
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
  const current = getOrders();
  const index = current.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const target = current[index];
  const updated: Order = {
    ...target,
    status,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      ...target.statusHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status changed to ${status}`,
      },
    ],
  };

  current[index] = updated;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(current));
  dispatchStorageEvent(STORAGE_KEYS.ORDERS);
  return updated;
}

export function updateOrderNotes(orderId: string, adminNotes: string): void {
  const current = getOrders();
  const index = current.findIndex((o) => o.id === orderId);
  if (index === -1) return;
  current[index] = { ...current[index], adminNotes };
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(current));
  dispatchStorageEvent(STORAGE_KEYS.ORDERS);
}

export function deleteOrder(orderId: string): void {
  const current = getOrders();
  const updated = current.filter((o) => o.id !== orderId);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  dispatchStorageEvent(STORAGE_KEYS.ORDERS);
}

// ==================== SETTINGS ====================

export function getSettings(): ShopkeeperSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed reading settings from storage', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ShopkeeperSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  dispatchStorageEvent(STORAGE_KEYS.SETTINGS);
}

// ==================== COMMUNICATORS (WHATSAPP & EMAIL) ====================

export function generateWhatsAppMessage(order: Order, settings: ShopkeeperSettings): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} (${settings.currency}${(item.price * item.quantity).toFixed(2)})${
          item.specialInstructions ? ` _[Note: ${item.specialInstructions}]_` : ''
        }`
    )
    .join('\n');

  const mapLink = order.customer.mapLocation
    ? `\n🗺️ *Map Location:* https://maps.google.com/?q=${order.customer.mapLocation.lat},${order.customer.mapLocation.lng}`
    : '';

  return `🛎️ *NEW ORDER: #${order.orderNumber}*
📅 *Date:* ${new Date(order.createdAt).toLocaleString()}

👤 *Customer Details:*
• *Name:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
• *WhatsApp:* ${order.customer.whatsapp}
• *Email:* ${order.customer.email}
• *Address:* ${order.customer.address}${mapLink}
${order.customer.notes ? `• *Special Delivery Notes:* ${order.customer.notes}` : ''}

🛒 *Ordered Items:*
${itemsText}

💵 *Payment Summary:*
• Subtotal: ${settings.currency}${order.subtotal.toFixed(2)}
• Delivery Fee: ${settings.currency}${order.deliveryFee.toFixed(2)}
• *TOTAL:* ${settings.currency}${order.total.toFixed(2)}
• *Method:* ${order.customer.paymentMethod.replace(/_/g, ' ').toUpperCase()}
• *Status:* ${order.status}

Thank you for choosing ${settings.storeName}!`;
}

export function generateWhatsAppUrl(order: Order, settings: ShopkeeperSettings, targetPhone?: string): string {
  const phone = (targetPhone || settings.whatsappNumber).replace(/[^\d+]/g, '').replace('+', '');
  const message = generateWhatsAppMessage(order, settings);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateMailtoUrl(order: Order, settings: ShopkeeperSettings, recipientEmail?: string): string {
  const targetEmail = recipientEmail || settings.email;
  const subject = `[New Order #${order.orderNumber}] ${order.customer.name} - ${settings.currency}${order.total.toFixed(2)}`;

  const itemsList = order.items
    .map(
      (i) =>
        `- ${i.quantity}x ${i.name} (${settings.currency}${(i.price * i.quantity).toFixed(2)})${
          i.specialInstructions ? ` (Note: ${i.specialInstructions})` : ''
        }`
    )
    .join('\n');

  const mapLink = order.customer.mapLocation
    ? `\nGoogle Maps Delivery Location Pin:\nhttps://maps.google.com/?q=${order.customer.mapLocation.lat},${order.customer.mapLocation.lng}`
    : '\n(No map pin was placed for this order)';

  const body = `Hello ${settings.storeName},

A new order has been placed on your website!

ORDER SUMMARY:
---------------------------------------------
Order Number: #${order.orderNumber}
Placed At: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status}
Payment Method: ${order.customer.paymentMethod.replace(/_/g, ' ').toUpperCase()}

CUSTOMER DETAILS:
---------------------------------------------
Name: ${order.customer.name}
Phone: ${order.customer.phone}
WhatsApp: ${order.customer.whatsapp}
Email: ${order.customer.email}
Address: ${order.customer.address}
${order.customer.notes ? `Delivery Instructions: ${order.customer.notes}` : ''}
${mapLink}

ITEMS ORDERED:
---------------------------------------------
${itemsList}

FINANCIALS:
---------------------------------------------
Subtotal: ${settings.currency}${order.subtotal.toFixed(2)}
Delivery Fee: ${settings.currency}${order.deliveryFee.toFixed(2)}
Total Amount: ${settings.currency}${order.total.toFixed(2)}

---------------------------------------------
You can manage this order status and contact the customer directly via the Shopkeeper Portal.
`;

  return `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
