"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";

import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  IoMdArrowDown,
  IoMdLogOut,
  IoMdMenu,
  IoMdNotifications,
  IoMdPerson,
  IoMdSearch,
  IoMdSettings,
} from "react-icons/io";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

interface TopbarMainProps {
  user: User | null;
  userSignOutHandle: () => Promise<void>;
}

export default function TopbarMain({
  user,
  userSignOutHandle,
}: TopbarMainProps) {
  const { isOpen, isMobile, isDarkMode } = useSidebar();
  const { language, setLanguage } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [languageMounted, setLanguageMounted] = useState(false);

  // Wait for language to be loaded from localStorage
  React.useEffect(() => {
    setLanguageMounted(true);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside both dropdowns
      if (showProfileMenu && !target.closest("[data-profile-dropdown]")) {
        setShowProfileMenu(false);
      }
      if (showLanguageMenu && !target.closest("[data-language-dropdown]")) {
        setShowLanguageMenu(false);
      }
    };

    if (showProfileMenu || showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, showLanguageMenu]);

  const handleLogout = () => {
    if (isPending) return;

    setShowProfileMenu(false);
    toast.loading("Signing out...", { id: "logout-toast" });

    startTransition(async () => {
      await userSignOutHandle();
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguageMenu(false);
    toast.success(
      `Language changed to ${newLanguage === "en" ? "English" : "বাংলা"}`
    );
  };

  const getLanguageDisplay = () => {
    if (!languageMounted) return "EN";
    return language === "en" ? "EN" : "বাংলা";
  };

  return (
    <header
      className={`fixed top-0 shadow-sm z-40 transition-all duration-200 ${
        isOpen
          ? "left-64 md:left-64 sm:left-56"
          : "left-16 md:left-16 sm:left-14"
      } ${isMobile && !isOpen ? "left-0" : ""} right-0 ${
        isDarkMode
          ? "bg-gray-900 border-b border-gray-700"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Menu Toggle & Search */}
        <div className="flex items-center gap-3">
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <IoMdMenu
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </button>

          {/* Search Bar */}
          <div
            className={`hidden md:flex items-center rounded-lg px-3 py-2 w-64 border ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <IoMdSearch
              className={`w-4 h-4 mr-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder={getTranslation("searchPlaceholder", language)}
              className={`bg-transparent border-none outline-none text-sm w-full ${
                isDarkMode
                  ? "text-gray-300 placeholder-gray-500"
                  : "text-gray-700 placeholder-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative" data-language-dropdown>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                suppressHydrationWarning
              >
                {getLanguageDisplay()}
              </span>
              <IoMdArrowDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showLanguageMenu ? "rotate-180" : ""
                } ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              />
            </button>

            {/* Language Dropdown Menu */}
            {showLanguageMenu && (
              <div
                className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border py-2 z-60 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors ${
                    language === "en"
                      ? isDarkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => handleLanguageChange("bn")}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors ${
                    language === "bn"
                      ? isDarkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  🇧🇩 বাংলা
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            className={`relative p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <IoMdNotifications
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <IoMdSettings
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" data-profile-dropdown>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="hidden md:block text-left">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {user?.name || "Guest"}
                </p>
                <p
                  className={`text-xs capitalize ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.role || ""}
                </p>
              </div>
              <IoMdArrowDown
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && user && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* User Info */}
                <div
                  className={`px-4 py-3 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.email}
                  </p>
                  <p
                    className={`text-xs capitalize mt-1 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {user.role}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/users"
                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IoMdPerson className="w-4 h-4" />
                    {getTranslation("users", language)}
                  </Link>
                  <Link
                    href="/settings"
                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IoMdSettings className="w-4 h-4" />
                    {getTranslation("settings", language)}
                  </Link>
                </div>

                <hr
                  className={`my-1 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                />

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode
                        ? "text-red-400 hover:bg-red-900/20"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <IoMdLogOut className="w-4 h-4" />
                    {isPending
                      ? getTranslation("signingOut", language) ||
                        "Signing out..."
                      : getTranslation("logout", language)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
