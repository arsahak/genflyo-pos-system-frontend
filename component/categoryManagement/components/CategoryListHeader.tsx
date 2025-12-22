import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

interface CategoryListHeaderProps {
  isDarkMode: boolean;
  canAddCategories: boolean;
}

export const CategoryListHeader = ({ isDarkMode, canAddCategories }: CategoryListHeaderProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          {t("categories")}
        </h1>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {t("manageCategories")}
        </p>
      </div>

      {canAddCategories && (
        <Link
          href="/products/categories/add-new-category"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
        >
          <MdAdd size={20} />
          {t("addNewCategory")}
        </Link>
      )}
    </div>
  );
};
