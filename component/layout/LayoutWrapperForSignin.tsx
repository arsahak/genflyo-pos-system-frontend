"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import DashboardSkeleton from "../dashboard/DashboardSkeleton";

export default function LayoutWrapperForSignin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="relative min-h-screen overflow-hidden">
          {/* Dashboard Skeleton Background - Blurred */}
          <div className="absolute inset-0 blur-sm scale-105 opacity-40">
            <DashboardSkeleton />
          </div>
          
          {/* Overlay gradient for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/70 to-black/80 backdrop-blur-[2px]" />
          
          {/* Sign-in form on top */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}
