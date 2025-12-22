export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    thumbUrl: string;
  };
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  level: number;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  productCount?: number;
  createdBy?: {
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
