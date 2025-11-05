"use client";

import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdAlert, IoMdEye, IoMdEyeOff, IoMdLock } from "react-icons/io";

interface LoginError {
  message: string;
  attemptsLeft?: number;
  lockUntil?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<string | null>(null);
  const { setUser, setTokens } = useStore();
  const { language } = useLanguage();

  // Get device name (browser/OS info)
  const getDeviceName = (): string => {
    if (typeof window === "undefined") return "Unknown Device";

    const userAgent = window.navigator.userAgent;
    let deviceName = "Web Browser";

    if (userAgent.includes("Chrome")) deviceName = "Chrome Browser";
    else if (userAgent.includes("Safari")) deviceName = "Safari Browser";
    else if (userAgent.includes("Firefox")) deviceName = "Firefox Browser";
    else if (userAgent.includes("Edge")) deviceName = "Edge Browser";

    return deviceName;
  };

  useEffect(() => {
    // Clear any previous lock status on mount
    setIsLocked(false);
    setAttemptsLeft(null);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAttemptsLeft(null); // Reset attempts left

    try {
      const deviceName = getDeviceName();
      const response = await api.post("/auth/login", {
        email,
        password,
        deviceName,
      });

      const { user, accessToken, refreshToken, message } = response.data;

      // Set user and tokens in store
      setUser(user);
      setTokens(accessToken, refreshToken);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Show success message
      toast.success(message || getTranslation("loginSuccessful", language));

      // Reset error states
      setIsLocked(false);
      setAttemptsLeft(null);
      setLockUntil(null);

      // Optional: Log user role for debugging
      console.log(`Logged in as ${user.role}:`, user.name);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: LoginError;
        };
      };

      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;

      // Handle account locked (423)
      if (status === 423) {
        setIsLocked(true);
        setLockUntil(errorData?.lockUntil || null);
        toast.error(
          errorData?.message || "Account is locked. Please try again later.",
          { duration: 5000 }
        );
      }
      // Handle invalid credentials (401)
      else if (status === 401) {
        const attemptsRemaining = errorData?.attemptsLeft;
        if (attemptsRemaining !== undefined) {
          setAttemptsLeft(attemptsRemaining);
          if (attemptsRemaining > 0) {
            toast.error(
              `${
                errorData?.message || "Invalid credentials"
              }. ${attemptsRemaining} attempt(s) remaining.`,
              { duration: 4000 }
            );
          } else {
            toast.error("Account will be locked. Please try again later.", {
              duration: 5000,
            });
          }
        } else {
          toast.error(errorData?.message || "Invalid credentials");
        }
      }
      // Handle account deactivated (403)
      else if (status === 403) {
        toast.error(
          errorData?.message || "Account deactivated. Contact administrator.",
          { duration: 5000 }
        );
      }
      // Handle validation errors (400)
      else if (status === 400) {
        toast.error(
          errorData?.message || "Invalid input. Please check your credentials."
        );
      }
      // Handle rate limiting (429)
      else if (status === 429) {
        toast.error("Too many login attempts. Please try again later.", {
          duration: 5000,
        });
      }
      // Handle other errors
      else {
        const errorMessage =
          errorData?.message || getTranslation("loginFailed", language);
        toast.error(errorMessage);
      }
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
            {lockUntil && (
              <p className="text-xs text-red-500 mt-1">
                Lock expires: {new Date(lockUntil).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Attempts Remaining Warning */}
      {attemptsLeft !== null && attemptsLeft > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <IoMdAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              Warning: {attemptsLeft} Attempt{attemptsLeft !== 1 ? "s" : ""}{" "}
              Remaining
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Your account will be locked after {attemptsLeft} more failed
              attempt
              {attemptsLeft !== 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      )}

      {/* Quick Login Options */}
      <div className="mb-6">
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
