import { MdBusiness, MdCheckCircle, MdCancel } from "react-icons/md";

interface BrandStatsProps {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  isDarkMode: boolean;
}

export default function BrandStats({
  totalBrands,
  activeBrands,
  inactiveBrands,
  isDarkMode,
}: BrandStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Brands */}
      <div
        className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Total Brands
            </p>
            <h3
              className={`text-3xl font-bold mt-2 ${
                isDarkMode ? "text-gray-100" : "text-slate-900"
              }`}
            >
              {totalBrands}
            </h3>
          </div>
          <div className="p-4 bg-indigo-500/10 rounded-xl">
            <MdBusiness className="text-indigo-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Active Brands */}
      <div
        className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Active Brands
            </p>
            <h3
              className={`text-3xl font-bold mt-2 ${
                isDarkMode ? "text-gray-100" : "text-slate-900"
              }`}
            >
              {activeBrands}
            </h3>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl">
            <MdCheckCircle className="text-green-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Inactive Brands */}
      <div
        className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Inactive Brands
            </p>
            <h3
              className={`text-3xl font-bold mt-2 ${
                isDarkMode ? "text-gray-100" : "text-slate-900"
              }`}
            >
              {inactiveBrands}
            </h3>
          </div>
          <div className="p-4 bg-gray-500/10 rounded-xl">
            <MdCancel className="text-gray-500 text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
