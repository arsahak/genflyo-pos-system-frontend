
import { MdArrowBack } from "react-icons/md";

interface SettingsHeaderProps {
  isDarkMode: boolean;
  router: any;
}

const SettingsHeader = ({ isDarkMode, router }: SettingsHeaderProps) => {
  return (
    <>
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 mb-4 ${
          isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <MdArrowBack className="text-xl" />
        Back to Settings
      </button>

      <h1
        className={`text-3xl font-bold mb-2 ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        General Settings
      </h1>
      <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Configure basic business information and regional settings
      </p>
    </>
  );
};

export default SettingsHeader;
