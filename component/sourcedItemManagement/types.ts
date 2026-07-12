export interface SourcedItem {
  _id: string;
  productName: string;
  quantity: number;
  sourcingCost: number;
  salePrice: number;
  profit: number;
  date: string;
  sourcedBy: {
    name: string;
    email: string;
  };
  saleId: {
    _id: string;
    saleNo: string;
  };
  storeId: {
    name: string;
  };
}

export interface Stats {
  totalItems: number;
  totalCost: number;
  totalProfit: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
