import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { MdCategory, MdLayers, MdViewList } from "react-icons/md";

interface CategoryStatsProps {
  isDarkMode: boolean;
  totalCategories: number;
  rootCategoriesCount: number;
  subCategoriesCount: number;
  currentViewCount: number;
}

export const CategoryStats = ({
  isDarkMode,
  totalCategories,
  rootCategoriesCount,
  subCategoriesCount,
  currentViewCount,
}: CategoryStatsProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Categories - Blue Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
              {t("totalCategories")}
            </p>
            <h3 className="text-2xl font-bold text-white">{totalCategories}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdCategory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Parent Categories - Green Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-emerald-100 opacity-90">
              {t("parentCategories")}
            </p>
            <h3 className="text-2xl font-bold text-white">
              {rootCategoriesCount}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdLayers className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Sub Categories - Purple Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">
              {t("subCategories")}
            </p>
            <h3 className="text-2xl font-bold text-white">
              {subCategoriesCount}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdViewList className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Current View - Orange Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
              {t("currentView")}
            </p>
            <h3 className="text-2xl font-bold text-white">
              {currentViewCount}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdViewList className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
