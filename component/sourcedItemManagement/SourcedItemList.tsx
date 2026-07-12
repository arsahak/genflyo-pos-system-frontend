"use client";

import { deleteSourcedItem, getAllSourcedItems } from "@/app/actions/sourceditems";
import { useSidebar } from "@/lib/SidebarContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SourcedItemHeader } from "./SourcedItemHeader";
import { SourcedItemStats } from "./SourcedItemStats";
import { SourcedItemTable } from "./SourcedItemTable";
import { Pagination, SourcedItem, Stats } from "./types";

export default function SourcedItemList() {
  const { isDarkMode } = useSidebar();
  const [items, setItems] = useState<SourcedItem[]>([]);
  const [stats, setStats] = useState<Stats>({ totalItems: 0, totalCost: 0, totalProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const result = await getAllSourcedItems({
        page,
        limit: 20,
        search: debouncedSearch,
      });

      if (result.success && result.data) {
        setItems(result.data.data);
        setPagination(result.data.pagination);
        setStats(result.data.stats);
      } else {
        toast.error(result.error || "Failed to fetch sourced items");
        setItems([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record? This won't affect the actual sale.")) return;

    try {
      const result = await deleteSourcedItem(id);
      if (result.success) {
        toast.success(result.message || "Record deleted");
        fetchItems();
      } else {
        toast.error(result.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="max-w-[1920px] mx-auto">
        <SourcedItemHeader
          isDarkMode={isDarkMode}
          onRefresh={fetchItems}
          search={search}
          setSearch={setSearch}
        />

        {!loading && items.length > 0 && (
           <SourcedItemStats stats={stats} />
        )}
        
        {/* If loading or empty, we might not show stats, or show skeleton stats. 
            For now, let's keep it simple: Show stats if we have them. 
            Actually, the Table handles loading state nicely. 
            Maybe I should move Stats loading state too?
            Let's leaving it like this for now.
        */}

        <SourcedItemTable
          isDarkMode={isDarkMode}
          loading={loading}
          items={items}
          pagination={pagination}
          setPage={setPage}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
