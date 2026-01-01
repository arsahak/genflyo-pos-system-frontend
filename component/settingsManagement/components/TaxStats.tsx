
"use client";

interface TaxStatsProps {
  isDarkMode: boolean;
  totalTaxes: number;
}

export const TaxStats = ({ isDarkMode, totalTaxes }: TaxStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <h3 className="text-lg font-semibold">Total Tax Rates</h3>
        <p className="text-2xl font-bold">{totalTaxes}</p>
      </div>
    </div>
  );
};
