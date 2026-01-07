import {
  getDashboardOverview,
  getDashboardStats,
} from "@/app/actions/dashboard";
import { auth } from "@/auth";
import Dashboard from "@/component/dashboard/Dashboard";
import DashboardSkeleton from "@/component/dashboard/DashboardSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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
  // Check authentication status
  const session = await auth();

  // If not logged in, redirect to sign-in page
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  // If logged in, show dashboard
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
};

export default page;
