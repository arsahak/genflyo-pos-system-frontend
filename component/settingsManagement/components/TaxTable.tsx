
"use client";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Tax {
  id: number;
  name: string;
  rate: number;
  type: string;
}

interface TaxTableProps {
  isDarkMode: boolean;
  taxes: Tax[];
  onEdit: (tax: Tax) => void;
  onDelete: (taxId: number) => void;
}

export const TaxTable = ({ isDarkMode, taxes, onEdit, onDelete }: TaxTableProps) => {
  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow-md`}>
        <h2 className="text-lg font-semibold mb-4">Manage Tax Rates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tax Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rate (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              {taxes.map((tax) => (
                <tr key={tax.id} className={`${isDarkMode ? "border-gray-700" : "border-b"}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{tax.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tax.rate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tax.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEdit(tax)} className="text-blue-500 hover:text-blue-600 mr-4">
                      <FiEdit />
                    </button>
                    <button onClick={() => onDelete(tax.id)} className="text-red-500 hover:text-red-600">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};
