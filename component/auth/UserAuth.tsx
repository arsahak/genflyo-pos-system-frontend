"use client";

import { userSignIn } from "@/app/actions/auth";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdAlert, IoMdEye, IoMdEyeOff, IoMdLock } from "react-icons/io";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Clear any previous lock status on mount
    setIsLocked(false);
    setErrorMessage(null);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Call the NextAuth sign-in action
      const result = await userSignIn(email, password);

      if (result.ok) {
        // Success! Show message and redirect
        toast.success(getTranslation("loginSuccessful", language));

        // Redirect to dashboard or specified URL
        router.push(result.url || "/dashboard");
        router.refresh(); // Refresh to get the session
      } else {
        // Handle error
        const error = result.error || "Login failed";
        setErrorMessage(error);

        // Check for specific error types
        if (error.includes("locked")) {
          setIsLocked(true);
          toast.error(error, { duration: 5000 });
        } else if (error.includes("Invalid email or password")) {
          toast.error(error, { duration: 4000 });
        } else if (error.includes("Unable to connect")) {
          toast.error(error, { duration: 5000 });
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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
    <div className="bg-white rounded-2xl shadow p-8 max-w-2xl w-full mx-6">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {getTranslation("genflyoPosSystem", language)}
        </h1>
        <p className="text-gray-600 text-sm">
          {getTranslation("signInToContinue", language)}
        </p>
      </div>

      {/* Account Locked Warning */}
      {isLocked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <IoMdLock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Account Locked</p>
            <p className="text-xs text-red-600 mt-1">
              Your account has been temporarily locked due to multiple failed
              login attempts. Please try again later.
            </p>
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && !isLocked && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <IoMdAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              Authentication Error
            </p>
            <p className="text-xs text-yellow-600 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Login Options */}
      {/* <div className="mb-6">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
          {getTranslation("quickLogin", language)}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleQuickLogin("super_admin")}
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isLocked}
          >
            {getTranslation("superAdmin", language)}
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("manager")}
            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={isLocked}
          >
            {getTranslation("manager", language)}
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("cashier")}
            className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={isLocked}
          >
            {getTranslation("cashier", language)}
          </button>
        </div>
      </div> */}

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
            disabled={isLocked}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="admin@pos.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getTranslation("password", language)}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              disabled={isLocked}
            >
              {showPassword ? (
                <IoMdEyeOff className="w-5 h-5" />
              ) : (
                <IoMdEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isLocked}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading
            ? getTranslation("signingIn", language)
            : isLocked
            ? "Account Locked"
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
