
"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SettingsHeader from "./SettingsHeader";
import BusinessInformation from "./BusinessInformation";
import CurrencySettings from "./CurrencySettings";
import RegionalSettings from "./RegionalSettings";
import Preview from "./Preview";

const GeneralSettings = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "retail",
    logo: "",
    tagline: "",
    currency: "USD",
    currencySymbol: "$",
    currencyPosition: "before",
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "12h",
    language: "en",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/settings");
      const settings = response.data;
      
      setFormData({
        businessName: settings.businessName || "",
        businessType: settings.businessType || "retail",
        logo: settings.logo || "",
        tagline: settings.tagline || "",
        currency: settings.currency || "USD",
        currencySymbol: settings.currencySymbol || "$",
        currencyPosition: settings.currencyPosition || "before",
        timezone: settings.timezone || "UTC",
        dateFormat: settings.dateFormat || "YYYY-MM-DD",
        timeFormat: settings.timeFormat || "12h",
        language: settings.language || "en",
      });
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put("/settings/general", formData);
      toast.success("General settings updated successfully!");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SettingsHeader isDarkMode={isDarkMode} router={router} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BusinessInformation
              isDarkMode={isDarkMode}
              formData={formData}
              handleChange={handleChange}
            />
            <CurrencySettings
              isDarkMode={isDarkMode}
              formData={formData}
              handleChange={handleChange}
            />
            <RegionalSettings
              isDarkMode={isDarkMode}
              formData={formData}
              handleChange={handleChange}
            />
          </div>

          <div className="lg:col-span-1">
            <Preview
              isDarkMode={isDarkMode}
              formData={formData}
              saving={saving}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
