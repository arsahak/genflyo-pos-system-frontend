import { MdSearch, MdFilterList } from "react-icons/md";

interface BrandFiltersProps {
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (field: string) => void;
  isDarkMode: boolean;
}

export default function BrandFilters({
  searchTerm,
  statusFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortChange,
  isDarkMode,
}: BrandFiltersProps) {
  return (
    <div
      className={`rounded-2xl shadow-sm border p-4 mb-6 ${
        isDarkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6">
          <div className="relative">
            <MdSearch
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? "text-gray-500" : "text-slate-400"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search brands by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full h-11 pl-12 pr-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Date</option>
            <option value="country">Sort by Country</option>
          </select>
        </div>
      </div>
    </div>
  );
}
