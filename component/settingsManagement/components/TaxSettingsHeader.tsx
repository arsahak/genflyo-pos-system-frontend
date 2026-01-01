
"use client";
import { FiPlus } from "react-icons/fi";

interface TaxSettingsHeaderProps {
  isDarkMode: boolean;
  onAddNew: () => void;
}

export const TaxSettingsHeader = ({ isDarkMode, onAddNew }: TaxSettingsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
        Tax Settings
      </h1>
      <button
        onClick={onAddNew}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <FiPlus className="mr-2" /> Add New Tax
      </button>
    </div>
  );
};
