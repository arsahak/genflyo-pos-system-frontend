"use client";

import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setTokens } = useStore();
  const { language } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data;

      setUser(user);
      setTokens(accessToken, refreshToken);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success(getTranslation("loginSuccessful", language));
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || getTranslation("loginFailed", language);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    switch (role) {
      case "super_admin":
        setEmail("admin@pos.com");
        setPassword("admin123");
        break;
      case "cashier":
        setEmail("cashier@pos.com");
        setPassword("cashier123");
        break;
      case "manager":
        setEmail("manager@pos.com");
        setPassword("manager123");
        break;
      default:
        setEmail("");
        setPassword("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {getTranslation("genflyoPosSystem", language)}
        </h1>
        <p className="text-gray-600 text-sm">
          {getTranslation("signInToContinue", language)}
        </p>
      </div>

      {/* Quick Login Options */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
          {getTranslation("quickLogin", language)}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleQuickLogin("super_admin")}
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {getTranslation("superAdmin", language)}
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("manager")}
            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {getTranslation("manager", language)}
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("cashier")}
            className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {getTranslation("cashier", language)}
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getTranslation("email", language)}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="admin@pos.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getTranslation("password", language)}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading
            ? getTranslation("signingIn", language)
            : getTranslation("signIn", language)}
        </button>
      </form>

      {/* Footer Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
          {getTranslation("allRightsReserved", language)}
        </p>
      </div>
    </div>
  );
}
