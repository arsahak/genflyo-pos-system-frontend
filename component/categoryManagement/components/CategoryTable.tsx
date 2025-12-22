import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { MdCategory, MdDelete, MdEdit, MdInventory, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Category, Pagination } from "../types";

interface CategoryTableProps {
  isDarkMode: boolean;
  loading: boolean;
  categories: Category[];
  rootCategories: Category[];
  hierarchyMap: { [key: string]: Category[] };
  pagination: Pagination;
  handlePageChange: (page: number) => void;
  canEditCategories: boolean;
  canDeleteCategories: boolean;
  handleDelete: (id: string, name: string) => void;
  searchTerm: string;
}

export const CategoryTable = ({
  isDarkMode,
  loading,
  categories,
  rootCategories,
  hierarchyMap,
  pagination,
  handlePageChange,
  canEditCategories,
  canDeleteCategories,
  handleDelete,
  searchTerm,
}: CategoryTableProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const CategoryRow = ({
    category,
    isSubcategory = false,
  }: {
    category: Category;
    isSubcategory?: boolean;
  }) => (
    <div
      className={`group transition-all border-b last:border-0 ${
        isDarkMode
          ? "border-gray-700 hover:bg-gray-700/30"
          : "border-gray-100 hover:bg-indigo-50/30"
      } ${isSubcategory ? (isDarkMode ? "bg-gray-800/50" : "bg-gray-50/50") : ""}`}
    >
      <div className="flex items-center px-6 py-4 gap-4">
        {/* Category Image */}
        <div className={`relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${
            isSubcategory ? "w-10 h-10 ml-8" : "w-14 h-14"
          } ${isDarkMode ? "bg-gray-700" : "bg-slate-100"}`}
        >
          {category.image?.url ? (
            <img
              src={category.image.url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <MdCategory
              className={`${isSubcategory ? "text-xl" : "text-2xl"} ${
                isDarkMode ? "text-gray-500" : "text-indigo-300"
              }`}
            />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/products/categories/${category._id}`}>
              <h3 className={`font-semibold transition-colors ${
                  isSubcategory ? "text-sm" : "text-base"
                } ${isDarkMode ? "text-gray-200 hover:text-indigo-400" : "text-gray-900 hover:text-indigo-600"}`}
              >
                {isSubcategory && (
                  <span className={`mr-2 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>└─</span>
                )}
                {category.name}
              </h3>
            </Link>

            {/* Badges */}
            {category.isFeatured && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                isDarkMode ? "bg-yellow-900/30 text-yellow-500" : "bg-yellow-100 text-yellow-700"
              }`}>
                Featured
              </span>
            )}
            {hierarchyMap[category._id] &&
              hierarchyMap[category._id].length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  isDarkMode ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {hierarchyMap[category._id].length} Sub
                </span>
              )}
          </div>

          {category.description && (
            <p className={`text-xs truncate ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              {category.description}
            </p>
          )}
        </div>

        {/* Product Count */}
        <div className="flex-shrink-0 text-center px-4 w-24">
          <div className={`flex items-center justify-center gap-1 font-semibold ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            <MdInventory size={16} className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            <span>{category.productCount || 0}</span>
          </div>
          <p className={`text-[10px] uppercase tracking-wide ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}>
            {t("products")}
          </p>
        </div>

        {/* Actions - Always Visible */}
        <div className="flex-shrink-0 flex items-center justify-end gap-2 w-32">
          <Link
            href={`/products/categories/${category._id}`}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? "hover:bg-gray-600 text-gray-400 hover:text-indigo-400" 
                : "hover:bg-indigo-50 text-gray-400 hover:text-indigo-600"
            }`}
            title={t("viewDetails")}
          >
             <MdCategory size={18} />
          </Link>

          {canEditCategories && (
            <Link
              href={`/products/categories/${category._id}/edit`}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? "hover:bg-gray-600 text-gray-400 hover:text-green-400" 
                  : "hover:bg-green-50 text-gray-400 hover:text-green-600"
              }`}
              title={t("edit")}
            >
              <MdEdit size={18} />
            </Link>
          )}

          {canDeleteCategories && (
            <button
              onClick={() => handleDelete(category._id, category.name)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? "hover:bg-gray-600 text-gray-400 hover:text-red-400" 
                  : "hover:bg-red-50 text-gray-400 hover:text-red-600"
              }`}
              title={t("delete")}
            >
              <MdDelete size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
        isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-300"
      }`}>
        <div className={`p-6 rounded-full mb-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <MdCategory className={`text-4xl ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{t("noProductsFound")}</h3>
        <p className={`text-center max-w-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          Try adjusting your search or add a new category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border ${
      isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
    }`}>
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className={`px-6 py-4 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider ${
           isDarkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50/80 text-gray-500"
        }`}>
          <div className="w-14">Image</div>
          <div className="flex-1">{t("categoryName")}</div>
          <div className="w-24 text-center">Stats</div>
          <div className="w-32 text-right">{t("actions")}</div>
        </div>

        {/* Categories List */}
        <div>
           {/* If we have a search term or flat list, just render all */}
           {rootCategories.length === 0 && categories.length > 0 ? (
             categories.map((category) => (
                <CategoryRow key={category._id} category={category} isSubcategory={true} />
             ))
           ) : (
             // Hierarchical view
             rootCategories.map((rootCategory, index) => (
                <div key={rootCategory._id}>
                  <CategoryRow category={rootCategory} />
                  
                  {hierarchyMap[rootCategory._id]?.map((subCategory) => (
                    <CategoryRow key={subCategory._id} category={subCategory} isSubcategory={true} />
                  ))}
                </div>
             ))
           )}
        </div>
      </div>

       {/* Pagination */}
       {pagination.totalPages > 1 && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? "border-gray-700 bg-gray-900/30" : "border-gray-100 bg-gray-50/50"
        }`}>
          <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Page <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{pagination.page}</span> of {pagination.totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? "hover:bg-gray-700 text-gray-400 disabled:opacity-30" 
                  : "hover:bg-gray-200 text-gray-600 disabled:opacity-30"
              }`}
            >
              <MdNavigateBefore size={24} />
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                 let pageNum = i + 1;
                 if (pagination.page > 3 && pagination.totalPages > 5) {
                    pageNum = pagination.page - 2 + i;
                 }
                 if (pageNum > pagination.totalPages) return null;

                 return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      pagination.page === pageNum
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : isDarkMode
                          ? "hover:bg-gray-700 text-gray-400"
                          : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? "hover:bg-gray-700 text-gray-400 disabled:opacity-30" 
                  : "hover:bg-gray-200 text-gray-600 disabled:opacity-30"
              }`}
            >
              <MdNavigateNext size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
