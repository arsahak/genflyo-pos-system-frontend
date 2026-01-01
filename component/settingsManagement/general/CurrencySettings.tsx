
import { MdAttachMoney } from "react-icons/md";

interface CurrencySettingsProps {
  isDarkMode: boolean;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const CurrencySettings = ({ isDarkMode, formData, handleChange }: CurrencySettingsProps) => {
  return (
    <div
      className={`rounded-lg border-2 p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <MdAttachMoney className="text-2xl text-green-500" />
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          Currency Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="JPY">JPY</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Currency Symbol
          </label>
          <input
            type="text"
            name="currencySymbol"
            value={formData.currencySymbol}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Symbol Position
          </label>
          <select
            name="currencyPosition"
            value={formData.currencyPosition}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="before">Before ($ 100)</option>
            <option value="after">After (100 $)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;
