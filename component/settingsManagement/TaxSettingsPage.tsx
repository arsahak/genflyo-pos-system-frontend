
"use client";
import { useState } from "react";
import { useSidebar } from "@/lib/SidebarContext";
import TaxModal from "./TaxModal";
import { TaxSettingsHeader } from "./components/TaxSettingsHeader";
import { TaxStats } from "./components/TaxStats";
import { TaxTable } from "./components/TaxTable";

const TaxSettingsPage = () => {
  const { isDarkMode } = useSidebar();
  const [taxes, setTaxes] = useState([
    { id: 1, name: "VAT", rate: 15, type: "Exclusive" },
    { id: 2, name: "Sales Tax", rate: 3, type: "Inclusive" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);

  const handleOpenModal = (tax: any = null) => {
    setSelectedTax(tax);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTax(null);
    setIsModalOpen(false);
  };

  const handleSaveTax = (taxData: any) => {
    if (taxData.id) {
      setTaxes(taxes.map((tax) => (tax.id === taxData.id ? { ...tax, ...taxData } : tax)));
    } else {
      setTaxes([...taxes, { ...taxData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDeleteTax = (taxId: number) => {
    setTaxes(taxes.filter((tax) => tax.id !== taxId));
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="max-w-[1920px] mx-auto">
        <TaxSettingsHeader
          isDarkMode={isDarkMode}
          onAddNew={() => handleOpenModal()}
        />

        <TaxStats isDarkMode={isDarkMode} totalTaxes={taxes.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaxTable
              isDarkMode={isDarkMode}
              taxes={taxes}
              onEdit={handleOpenModal}
              onDelete={handleDeleteTax}
            />
          </div>
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow-md`}>
              <h2 className="text-lg font-semibold mb-4">Default Tax Settings</h2>
              <div className="flex items-center">
                <label htmlFor="default-tax" className="mr-4">Default Sales Tax:</label>
                <select id="default-tax" className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"} border border-gray-300 rounded-md py-2 px-3`}>
                  <option value="">None</option>
                  {taxes.map((tax) => (
                    <option key={tax.id} value={tax.id}>{tax.name} ({tax.rate}%)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TaxModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTax} tax={selectedTax} />
    </div>
  );
};

export default TaxSettingsPage;
