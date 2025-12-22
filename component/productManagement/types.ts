export interface Product {
  _id: string;
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  reorderLevel?: number;
  unit: string;
  mainImage?: {
    url: string;
    thumbUrl: string;
    displayUrl: string;
  };
  featureImages?: Array<{
    url: string;
    thumbUrl: string;
    displayUrl: string;
  }>;
  hasExpiry: boolean;
  expiryDate?: string;
  expiryAlertDays?: number;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
  isLowStock?: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
