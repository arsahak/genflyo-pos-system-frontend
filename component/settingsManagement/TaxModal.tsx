
"use client";
import { useState, useEffect } from "react";
import { useSidebar } from "@/lib/SidebarContext";
import { FiX } from "react-icons/fi";

interface TaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tax: any) => void;
  tax: any;
}

const TaxModal = ({ isOpen, onClose, onSave, tax }: TaxModalProps) => {
  const { isDarkMode } = useSidebar();
  const [name, setName] = useState(tax ? tax.name : "");
  const [rate, setRate] = useState(tax ? tax.rate : "");
  const [type, setType] = useState(tax ? tax.type : "Exclusive");

  useEffect(() => {
    setName(tax ? tax.name : "");
    setRate(tax ? tax.rate : "");
    setType(tax ? tax.type : "Exclusive");
  }, [tax]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: tax ? tax.id : null, name, rate, type });
  };

  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-md flex justify-center items-center z-50">
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{tax ? "Edit Tax" : "Add New Tax"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tax-name" className="block text-sm font-medium mb-2">Tax Name</label>
            <input
              id="tax-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} w-full px-4 py-2 rounded-lg border-2 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tax-rate" className="block text-sm font-medium mb-2">Rate (%)</label>
            <input
              id="tax-rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} w-full px-4 py-2 rounded-lg border-2 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tax-type" className="block text-sm font-medium mb-2">Tax Type</label>
            <select
              id="tax-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} w-full px-4 py-2 rounded-lg border-2 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
            >
              <option value="Exclusive">Exclusive</option>
              <option value="Inclusive">Inclusive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaxModal;
