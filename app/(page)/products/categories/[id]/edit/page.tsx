"use client";

import dynamic from "next/dynamic";

const CategoryUpdate = dynamic(
  () => import("@/component/categoryManagement/CategoryUpdate"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    ),
  }
);

export default function CategoryEditPage() {
  return <CategoryUpdate />;
}

