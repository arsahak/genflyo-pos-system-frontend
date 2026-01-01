
import { MdSave } from "react-icons/md";

interface PreviewProps {
  isDarkMode: boolean;
  formData: any;
  saving: boolean;
}

const Preview = ({ isDarkMode, formData, saving }: PreviewProps) => {
  return (
    <div
      className={`rounded-lg border-2 p-6 sticky top-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        Preview
      </h3>
      
      <div className="space-y-3 mb-6">
        <div>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Currency Format</p>
          <p className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {formData.currencyPosition === "before"
              ? `${formData.currencySymbol} 99.99`
              : `99.99 ${formData.currencySymbol}`}
          </p>
        </div>
        
        <div>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date Format</p>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{formData.dateFormat}</p>
        </div>
        
        <div>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Time Format</p>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{formData.timeFormat === "12h" ? "12:30 PM" : "12:30"}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Saving...
          </>
        ) : (
          <>
            <MdSave />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default Preview;
