export interface Product {
  id: string;
  name: string;
  price: number;
  cost?: number;
  image?: string;
  category: string;
  stock: number;
  sku: string;
  barcode: string;
  isPrescription?: boolean;
  isControlled?: boolean;
  genericName?: string;
  dosage?: string;
  strength?: string;
  unit?: string;
  manufacturer?: string;
  hasExpiry?: boolean;
  expiryDate?: string;
  batchNumber?: string;
  taxRate?: number;
  isLowStock?: boolean;
  reorderLevel?: number;
  shelf?: string;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
  discount: number;
}

export interface Customer {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  membershipType?: "none" | "regular" | "silver" | "gold" | "platinum";
  loyaltyPoints?: number;
  totalSpent?: number;
}

export interface HeldOrder {
  id: string;
  name: string;
  cart: CartItem[];
  customer: Customer | null;
  timestamp: Date;
  note?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  unit?: string;
  discount: number;
  finalPrice: number;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  customer: Partial<Customer> | null;
  items: InvoiceItem[];
  subtotal: number;
  itemDiscounts: number;
  membershipDiscount: number;
  orderDiscount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  receivedAmount: number;
  changeAmount: number;
}
