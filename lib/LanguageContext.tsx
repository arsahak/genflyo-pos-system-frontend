"use client";

import React, { createContext, useContext, useState } from "react";
import { getTranslation } from "./translations";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
        document.documentElement.lang = savedLanguage;
        return savedLanguage;
      }
    }
    return "en";
  });

  // Save language preference and update DOM
  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);

    // Update document language attribute
    document.documentElement.lang = newLanguage;

    // Add transition for smooth language switching
    document.documentElement.style.transition = "all 0.2s ease";

    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 200);
  };

  // Translation helper function
  const t = (key: string) => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: updateLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
