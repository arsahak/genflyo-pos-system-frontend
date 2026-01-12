import {
  MdArrowDownward,
  MdArrowUpward,
  MdBusiness,
  MdChevronLeft,
  MdChevronRight,
  MdDelete,
  MdEdit,
} from "react-icons/md";
import { Brand } from "../BrandsList";

interface BrandTableProps {
  brands: Brand[];
  currentPage: number;
  totalPages: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onEdit: (brandId: string) => void;
  onDelete: (brandId: string) => void;
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  isDarkMode: boolean;
}

const SortIcon = ({
  field,
  sortBy,
  sortOrder,
}: {
  field: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) => {
  if (sortBy !== field) return null;
  return sortOrder === "asc" ? (
    <MdArrowUpward size={16} />
  ) : (
    <MdArrowDownward size={16} />
  );
};

export default function BrandTable({
  brands,
  currentPage,
  totalPages,
  sortBy,
  sortOrder,
  onEdit,
  onDelete,
  onSort,
  onPageChange,
  isDarkMode,
}: BrandTableProps) {
  if (brands.length === 0) {
    return (
      <div
        className={`rounded-2xl shadow-sm border p-12 text-center ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-slate-200"
        }`}
      >
        <MdBusiness
          className={`mx-auto mb-4 ${
            isDarkMode ? "text-gray-600" : "text-slate-300"
          }`}
          size={64}
        />
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? "text-gray-400" : "text-slate-600"
          }`}
        >
          No brands found
        </h3>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-500" : "text-slate-500"
          }`}
        >
          Try adjusting your filters or add a new brand
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-2xl shadow-sm border overflow-hidden ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-slate-50"
              } border-b ${
                isDarkMode ? "border-gray-700" : "border-slate-200"
              }`}
            >
              <tr>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                  onClick={() => onSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Brand Name
                    <SortIcon
                      field="name"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  </div>
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Description
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                  onClick={() => onSort("country")}
                >
                  <div className="flex items-center gap-2">
                    Country
                    <SortIcon
                      field="country"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  </div>
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Contact
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-800" : "divide-slate-200"
              }`}
            >
              {brands.map((brand) => (
                <tr
                  key={brand._id}
                  className={`transition-colors ${
                    isDarkMode ? "hover:bg-gray-800/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50"
                        }`}
                      >
                        <MdBusiness
                          className={`${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                          size={20}
                        />
                      </div>
                      <div
                        className={`font-semibold ${
                          isDarkMode ? "text-gray-100" : "text-slate-900"
                        }`}
                      >
                        {brand.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm line-clamp-2 max-w-xs ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      {brand.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      {(brand.country && brand.country.trim()) || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      {(brand.contact && brand.contact.trim()) || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        brand.isActive
                          ? isDarkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-50 text-green-600"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(brand._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                            : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                        }`}
                        title="Edit brand"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(brand._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                            : "hover:bg-red-50 text-slate-500 hover:text-red-600"
                        }`}
                        title="Delete brand"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex items-center justify-between mt-4 px-4 py-3 rounded-lg ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <MdChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
