export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  badge?: string;
  prepTime?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapLocation?: MapCoordinates | null;
  notes?: string;
  paymentMethod: 'cash_on_delivery' | 'card_on_delivery' | 'bank_transfer_upi';
}

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  adminNotes?: string;
}

export interface ShopkeeperSettings {
  storeName: string;
  storeTagline: string;
  email: string;
  whatsappNumber: string;
  phone: string;
  currency: string;
  deliveryFee: number;
  minOrderAmount: number;
  storeAddress: string;
  storeLocation?: MapCoordinates;
}
