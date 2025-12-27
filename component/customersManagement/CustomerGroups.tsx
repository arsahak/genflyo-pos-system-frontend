"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MdAdd,
  MdArrowBack,
  MdGroup,
  MdPeople,
} from "react-icons/md";

const CustomerGroups = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [groups] = useState<any[]>([]);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/customers")}
          className={`flex items-center gap-2 mb-4 ${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          } transition-colors`}
        >
          <MdArrowBack className="text-xl" />
          Back to Customers
        </button>
        <h1 className="text-3xl font-bold mb-2">Customer Groups</h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Organize and manage customer groups
        </p>
      </div>

      {/* Add Group Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            // TODO: Open create group modal
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
        >
          <MdAdd className="text-xl" />
          Create Group
        </button>
      </div>

      {/* Groups List */}
      <div
        className={`rounded-2xl shadow-sm p-6 ${
          isDarkMode
            ? "bg-gray-800 shadow-lg shadow-gray-900/20"
            : "bg-white shadow-xl shadow-slate-200/50"
        }`}
      >
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <MdGroup
              className={`text-6xl mx-auto mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3 className="text-xl font-semibold mb-2">No Customer Groups</h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Create your first customer group to organize your customers
            </p>
            <button
              onClick={() => {
                // TODO: Open create group modal
              }}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg mx-auto"
            >
              <MdAdd className="text-xl" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group._id}
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } hover:border-blue-500 transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <MdPeople className="text-2xl text-blue-500" />
                </div>
                <p
                  className={`text-sm mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {group.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {group.customerCount || 0} customers
                  </span>
                  <button
                    className={`text-sm px-3 py-1 rounded ${
                      isDarkMode
                        ? "bg-blue-900 text-blue-200 hover:bg-blue-800"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    } transition-colors`}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          isDarkMode
            ? "bg-blue-900/20 border border-blue-800"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <p className={isDarkMode ? "text-blue-300" : "text-blue-800"}>
          <strong>Note:</strong> Customer Groups feature is coming soon. You'll
          be able to organize customers into groups for targeted marketing,
          special discounts, and better customer management.
        </p>
      </div>
    </div>
  );
};

export default CustomerGroups;
