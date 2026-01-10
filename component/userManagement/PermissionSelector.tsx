/**
 * PermissionSelector Component
 * 
 * Reusable component for displaying and selecting user permissions
 * Uses the centralized permissionsList for consistency
 */

import { permissionCategories, getCategoryColorClasses } from "@/lib/permissionsList";
import { PermissionsRecord, PermissionKey } from "@/lib/permissions";
import {
  MdDashboard,
  MdPointOfSale,
  MdShoppingCart,
  MdInventory,
  MdLocalShipping,
  MdPeople,
  MdPerson,
  MdStore,
  MdQrCode2,
  MdAssessment,
  MdSettings,
} from "react-icons/md";

interface PermissionSelectorProps {
  permissions: PermissionsRecord;
  onChange: (permissions: PermissionsRecord) => void;
  isDarkMode?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <MdDashboard className="w-4 h-4 mr-2" />,
  sales: <MdPointOfSale className="w-4 h-4 mr-2" />,
  orders: <MdShoppingCart className="w-4 h-4 mr-2" />,
  products: <MdInventory className="w-4 h-4 mr-2" />,
  inventory: <MdInventory className="w-4 h-4 mr-2" />,
  suppliers: <MdLocalShipping className="w-4 h-4 mr-2" />,
  customers: <MdPeople className="w-4 h-4 mr-2" />,
  users: <MdPerson className="w-4 h-4 mr-2" />,
  stores: <MdStore className="w-4 h-4 mr-2" />,
  reports: <MdAssessment className="w-4 h-4 mr-2" />,
  settings: <MdSettings className="w-4 h-4 mr-2" />,
};

export default function PermissionSelector({
  permissions,
  onChange,
  isDarkMode = false,
}: PermissionSelectorProps) {
  const handlePermissionChange = (key: PermissionKey, checked: boolean) => {
    onChange({
      ...permissions,
      [key]: checked,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {permissionCategories.map((category) => {
        const colorClasses = getCategoryColorClasses(category.color);
        const icon = iconMap[category.icon] || <MdSettings className="w-4 h-4 mr-2" />;

        return (
          <div
            key={category.title}
            className={`border rounded-lg p-4 ${colorClasses.border} ${colorClasses.bg} hover:shadow-md transition-shadow`}
          >
            <h4 className={`text-xs font-bold mb-3 flex items-center uppercase tracking-wider ${colorClasses.text}`}>
              {icon}
              {category.title}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {category.permissions.map((permission) => (
                <label
                  key={permission.key}
                  className={`flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 ${colorClasses.hover} transition-all cursor-pointer group`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className={`text-sm font-medium group-hover:${colorClasses.text} ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {permission.label}
                    </div>
                    {permission.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {permission.description}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={permissions[permission.key] || false}
                      onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-9 h-5 rounded-full transition-colors ${
                        permissions[permission.key]
                          ? `bg-${category.color}-600`
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                          permissions[permission.key]
                            ? "translate-x-4"
                            : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
