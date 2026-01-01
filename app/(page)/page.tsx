import Dashboard from "@/component/dashboard/Dashboard";
import {
  getDashboardOverview,
  getDashboardStats,
} from "@/app/actions/dashboard";
import { Suspense } from "react";
import DashboardSkeleton from "@/component/dashboard/DashboardSkeleton";

async function DashboardData() {
  // Fetch both overview and stats data in parallel
  const [overviewResult, statsResult] = await Promise.all([
    getDashboardOverview(),
    getDashboardStats(),
  ]);

  if (!overviewResult.success) {
    return <Dashboard data={null} stats={null} error={overviewResult.error} />;
  }

  // Stats can fail independently, just pass null if they do
  const stats = statsResult.success ? statsResult.data : null;

  return <Dashboard data={overviewResult.data} stats={stats} />;
}

const page = async () => {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
};

export default page;
