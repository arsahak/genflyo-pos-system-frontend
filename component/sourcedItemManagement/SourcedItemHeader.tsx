import { MdRefresh, MdSearch } from "react-icons/md";

interface Props {
  isDarkMode: boolean;
  onRefresh: () => void;
  search: string;
  setSearch: (val: string) => void;
}

export const SourcedItemHeader = ({ isDarkMode, onRefresh, search, setSearch }: Props) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            External Source Items
          </h1>
          <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Manage and track items sourced externally (Cross-Docking)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
            }`}
          >
            <MdRefresh className="text-xl" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md group">
          <MdSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors ${
            isDarkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-500"
          }`} />
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all duration-200 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:bg-gray-800"
                : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:shadow-md"
            }`}
          />
        </div>
      </div>
    </>
  );
};
