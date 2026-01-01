"use client";

import { LanguageProvider } from "@/lib/LanguageContext";

export default function LayoutWrapperForSignin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </LanguageProvider>
  );
}
