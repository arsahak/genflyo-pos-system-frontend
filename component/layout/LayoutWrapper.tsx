"use client";

import Sidebar from "@/component/layout/Sidebar";
import Topbar from "@/component/layout/Topbar";
import SessionSync from "@/component/SessionSync";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, isMobile, isDarkMode } = useSidebar();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar - Fixed positioning */}
      <Sidebar />

      {/* Topbar - Fixed positioning */}
      <Topbar />

      {/* Main content with proper spacing for fixed sidebar and topbar */}
      <main
        className={`pt-16 min-h-screen transition-all duration-200 ${
          isOpen ? "pl-64 md:pl-64 sm:pl-56" : "pl-16 md:pl-16 sm:pl-14"
        } ${isMobile && !isOpen ? "pl-0" : ""}`}
      >
        <div
          className={`p-6 transition-colors duration-200 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <SessionSync />
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </LanguageProvider>
  );
}
