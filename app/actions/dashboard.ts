"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get auth headers
async function getAuthHeaders() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  };
}

export interface DashboardKPI {
  current: number;
  previous: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

export interface CustomerOverview {
  firstTime: number;
  firstTimeChange: number;
  return: number;
  returnChange: number;
}

export interface DashboardOverviewData {
  // Today's metrics
  todaysSales?: number;
  todaysSalesReturn?: number;
  todaysPurchase?: number;
  todaysPurchaseReturn?: number;
  todaysOrderCount?: number;
  
  // Overall metrics with trends
  totalSales: DashboardKPI;
  totalSalesReturn: DashboardKPI;
  totalPurchase: DashboardKPI;
  totalPurchaseReturn: DashboardKPI;
  profit: DashboardKPI;
  invoiceDue: DashboardKPI;
  totalExpenses: DashboardKPI;
  totalPaymentReturns: DashboardKPI;
  overallInformation: {
    suppliers: number;
    customers: number;
    orders: number;
    lowStockItems: number;
  };
  customerOverview: CustomerOverview;
  recentSales: Array<{
    id: string;
    saleNo: string;
    total: number;
    customer: string;
    cashier: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    productName: string;
    currentStock: number;
    minStock: number;
  }>;
  dateRange: {
    from: string;
    to: string;
  };
}

/**
 * GET /api/dashboard/overview - Get dashboard overview data
 */
export async function getDashboardOverview(params?: {
  storeId?: string;
  from?: string;
  to?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.storeId) queryParams.append("storeId", params.storeId);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);

    const url = `${API_URL}/api/dashboard/overview${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    const response = await fetch(url, {
      headers,
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to fetch dashboard data",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export interface DashboardStatsData {
  salesAndPurchaseByDay: Array<{
    date: string;
    sales: number;
    purchases: number;
    salesCount: number;
    purchaseCount: number;
  }>;
  salesByPaymentMethod: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  customerOverviewByDay: Array<{
    date: string;
    newCustomers: number;
    returningCustomers: number;
  }>;
}

/**
 * GET /api/dashboard/stats - Get detailed dashboard statistics for charts
 */
export async function getDashboardStats(params?: {
  storeId?: string;
  from?: string;
  to?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.storeId) queryParams.append("storeId", params.storeId);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);

    const url = `${API_URL}/api/dashboard/stats${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    const response = await fetch(url, {
      headers,
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to fetch dashboard stats",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
