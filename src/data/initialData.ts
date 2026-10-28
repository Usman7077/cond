import { MenuItem, Order, ShopkeeperSettings } from '../types';

export const DEFAULT_SETTINGS: ShopkeeperSettings = {
  storeName: "Artisan Kitchen & Bakery",
  storeTagline: "Handcrafted gourmet meals & fresh delights delivered to your doorstep",
  email: "zainhassan7476@gmail.com",
  whatsappNumber: "+1234567890",
  phone: "+1234567890",
  currency: "$",
  deliveryFee: 3.50,
  minOrderAmount: 10.00,
  storeAddress: "742 Evergreen Terrace, Springfield",
  storeLocation: {
    lat: 37.7749,
    lng: -122.4194,
    formattedAddress: "San Francisco, CA, USA"
  }
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Classic Wagyu Truffle Burger",
    description: "Premium grilled wagyu beef patty, black truffle aioli, aged cheddar, caramelised onions on a toasted brioche bun.",
    price: 15.99,
    category: "Burgers & Mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Best Seller",
    prepTime: "15-20 min"
  },
  {
    id: "item-2",
    name: "Artisanal Margherita Pizza",
    description: "Slow-fermented sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, and extra virgin olive oil.",
    price: 14.50,
    category: "Pizza & Oven",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Chef's Special",
    prepTime: "20-25 min"
  },
  {
    id: "item-3",
    name: "Crispy Parmesan Truffle Fries",
    description: "Hand-cut Idaho potatoes tossed in white truffle oil, grated aged parmesan, fresh parsley, served with house garlic herb dip.",
    price: 6.99,
    category: "Sides & Starters",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Popular",
    prepTime: "10-12 min"
  },
  {
    id: "item-4",
    name: "Spicy Honey Glazed Wings (8 pcs)",
    description: "Jumbo crispy chicken wings coated in hot honey sriracha glaze with toasted sesame seeds and creamy blue cheese dip.",
    price: 11.99,
    category: "Sides & Starters",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Spicy",
    prepTime: "15-18 min"
  },
  {
    id: "item-5",
    name: "Mediterranean Grilled Bowl",
    description: "Warm quinoa, grilled rosemary chicken or halloumi, roasted bell peppers, Kalamata olives, creamy hummus, and lemon tahini dressing.",
    price: 13.99,
    category: "Burgers & Mains",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Healthy",
    prepTime: "15 min"
  },
  {
    id: "item-6",
    name: "Iced Ceremonial Matcha Latte",
    description: "Stone-ground Japanese Uji matcha whisked fresh with velvety oat milk and a touch of organic Madagascar vanilla.",
    price: 5.50,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "New",
    prepTime: "5 min"
  },
  {
    id: "item-7",
    name: "Cold Pressed Citrus Sunrise Juice",
    description: "Pure fresh-pressed Valencia oranges, ruby red grapefruit, passionfruit, and a hint of fresh ginger.",
    price: 5.25,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    prepTime: "5 min"
  },
  {
    id: "item-8",
    name: "Warm Molten Belgian Chocolate Cake",
    description: "Rich dark chocolate sponge with a molten ganache center, dusted with Dutch cocoa, served with vanilla bean gelato.",
    price: 8.50,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Sweet Tooth",
    prepTime: "12-15 min"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "QO-7841",
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    customer: {
      name: "Sophia Martinez",
      phone: "+1 (555) 234-8971",
      whatsapp: "+1 (555) 234-8971",
      email: "sophia.m@example.com",
      address: "450 Market Street, 3rd Floor, Suite 302",
      mapLocation: {
        lat: 37.7915,
        lng: -122.4001,
        formattedAddress: "450 Market St, San Francisco, CA 94105"
      },
      notes: "Please buzz suite 302 upon arrival.",
      paymentMethod: "cash_on_delivery"
    },
    items: [
      {
        id: "item-1",
        name: "Classic Wagyu Truffle Burger",
        price: 15.99,
        quantity: 2,
        specialInstructions: "Extra truffle aioli on the side please",
        category: "Burgers & Mains"
      },
      {
        id: "item-3",
        name: "Crispy Parmesan Truffle Fries",
        price: 6.99,
        quantity: 1,
        category: "Sides & Starters"
      },
      {
        id: "item-6",
        name: "Iced Ceremonial Matcha Latte",
        price: 5.50,
        quantity: 2,
        category: "Beverages"
      }
    ],
    subtotal: 49.97,
    deliveryFee: 3.50,
    total: 53.47,
    status: "Out for Delivery",
    statusHistory: [
      { status: "Pending", timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(), note: "Customer submitted order" },
      { status: "Confirmed", timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), note: "Kitchen verified items" },
      { status: "Preparing", timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: "Order being cooked" },
      { status: "Out for Delivery", timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), note: "Rider on the way" }
    ],
    adminNotes: "Regular corporate customer. Driver: Alex"
  },
  {
    id: "ord-102",
    orderNumber: "QO-7842",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customer: {
      name: "David Chen",
      phone: "+1 (555) 782-3490",
      whatsapp: "+1 (555) 782-3490",
      email: "david.chen@example.com",
      address: "880 Harrison St, Apt 14B",
      mapLocation: {
        lat: 37.7785,
        lng: -122.4042,
        formattedAddress: "880 Harrison St, San Francisco, CA"
      },
      notes: "Gate code is #4019",
      paymentMethod: "card_on_delivery"
    },
    items: [
      {
        id: "item-2",
        name: "Artisanal Margherita Pizza",
        price: 14.50,
        quantity: 1,
        category: "Pizza & Oven"
      },
      {
        id: "item-8",
        name: "Warm Molten Belgian Chocolate Cake",
        price: 8.50,
        quantity: 1,
        category: "Desserts"
      }
    ],
    subtotal: 23.00,
    deliveryFee: 3.50,
    total: 26.50,
    status: "Pending",
    statusHistory: [
      { status: "Pending", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: "Order received via website" }
    ]
  }
];
