"use client";

import { useEffect, useState } from "react";
import { getSessions, revokeSession } from "@/lib/auth";
import toast from "react-hot-toast";
import {
  IoMdDesktop,
  IoMdPhonePortrait,
  IoMdTabletPortrait,
  IoMdClose,
  IoMdRefresh,
} from "react-icons/io";

interface Session {
  id: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  platform: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      toast.error("Failed to load sessions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    if (!confirm("Are you sure you want to revoke this session?")) {
      return;
    }

    try {
      setRevoking(sessionId);
      await revokeSession(sessionId);
      toast.success("Session revoked successfully");
      await loadSessions(); // Reload sessions
    } catch (error) {
      toast.error("Failed to revoke session");
      console.error(error);
    } finally {
      setRevoking(null);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <IoMdPhonePortrait className="w-6 h-6" />;
    }
    if (ua.includes("tablet") || ua.includes("ipad")) {
      return <IoMdTabletPortrait className="w-6 h-6" />;
    }
    return <IoMdDesktop className="w-6 h-6" />;
  };

  const getBrowserName = (userAgent: string): string => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("edge")) return "Edge";
    if (ua.includes("opera")) return "Opera";
    return "Unknown Browser";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your active login sessions across devices
          </p>
        </div>
        <button
          onClick={loadSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          <IoMdRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No active sessions found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`bg-white rounded-lg border-2 p-6 ${
                session.isCurrent
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Device Icon */}
                  <div
                    className={`p-3 rounded-lg ${
                      session.isCurrent
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getDeviceIcon(session.userAgent)}
                  </div>

                  {/* Session Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {session.deviceName || getBrowserName(session.userAgent)}
                      </h3>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>IP Address: {session.ipAddress}</p>
                      <p>Platform: {session.platform}</p>
                      <p>
                        Logged in:{" "}
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                      <p>
                        Expires: {new Date(session.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Revoke Button */}
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    disabled={revoking === session.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    {revoking === session.id ? (
                      <span>Revoking...</span>
                    ) : (
                      <>
                        <IoMdClose className="w-4 h-4" />
                        Revoke
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Security Tip:</strong> If you see a session you don't
          recognize, revoke it immediately and change your password.
        </p>
      </div>
    </div>
  );
}

