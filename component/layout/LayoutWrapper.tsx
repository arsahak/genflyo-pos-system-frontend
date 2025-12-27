"use client";

import Sidebar from "@/component/layout/Sidebar";
import Topbar from "@/component/layout/Topbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { isOpen, isMobile, isDarkMode } = useSidebar();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Show loading state while checking authentication
  const isLoading = status === "loading";

  // Determine if navigation should be blurred
  const shouldBlurNav = !isPublicRoute && !user && !isLoading;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar - Fixed positioning with blur effect */}
      <div
        className={`transition-all duration-300 ${
          shouldBlurNav
            ? "opacity-30 pointer-events-none blur-sm"
            : isLoading
            ? "opacity-50"
            : "opacity-100"
        }`}
      >
        <Sidebar />
      </div>

      {/* Topbar - Fixed positioning with blur effect */}
      <div
        className={`transition-all duration-300 ${
          shouldBlurNav
            ? "opacity-30 pointer-events-none blur-sm"
            : isLoading
            ? "opacity-50"
            : "opacity-100"
        }`}
      >
        <Topbar />
      </div>

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
          {/* Show loading spinner while checking session */}
          {isLoading && !isPublicRoute ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div
                  className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
                <p
                  className={`mt-4 text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Loading session...
                </p>
              </div>
            </div>
          ) : (
            children
          )}
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
    <SessionProvider>
      <LanguageProvider>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
