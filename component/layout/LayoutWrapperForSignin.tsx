"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import { SidebarProvider } from "@/lib/SidebarContext";

export default function LayoutWrapperForSignin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="relative min-h-screen overflow-hidden">
          {/* Image Background with Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-70"
            style={{
              backgroundImage: `url('/loginbg.jpeg')`,
            }}
          />
          
          {/* Overlay gradient for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/50 to-white/70 backdrop-blur-[1px]" />
          
          {/* Sign-in form on top */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}
