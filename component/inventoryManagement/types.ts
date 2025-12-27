export interface Product {
  _id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  image?: string;
}

export interface Store {
  _id: string;
  name: string;
}

export interface InventoryItem {
  _id: string;
  productId: Product;
  storeId: Store;
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastRestocked: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
}
