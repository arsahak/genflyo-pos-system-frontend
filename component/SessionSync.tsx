"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { getCurrentSession } from "@/app/actions/auth";

/**
 * SessionSync component - Syncs NextAuth session to Zustand store
 * This ensures that user permissions are available throughout the app
 */
export default function SessionSync() {
  const setUser = useStore((state) => state.setUser);
  const clearAuth = useStore((state) => state.clearAuth);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      try {
        const session = await getCurrentSession();

        if (!mounted) return;

        if (session?.user && session.accessToken) {
          // Sync session data to Zustand store
          setUser({
            id: session.user.id as string,
            name: session.user.name as string,
            email: session.user.email as string,
            role: session.user.role as string,
            roleId: session.user.roleId as string | undefined,
            permissions: session.user.permissions as any,
            profileImage: session.user.profileImage as string | undefined,
            lastLogin: session.user.lastLogin as string | undefined,
          });
          console.log("Session synced to store:", session.user.email);
        } else {
          // No session, clear the store
          clearAuth();
          console.log("No session found, store cleared");
        }
      } catch (error) {
        console.error("Error syncing session:", error);
        if (mounted) clearAuth();
      } finally {
        if (mounted) setSyncing(false);
      }
    };

    // Sync immediately on mount
    syncSession();

    // Set up interval to check session every 30 seconds
    const interval = setInterval(syncSession, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setUser, clearAuth]);

  // Show nothing while syncing to prevent flash
  if (syncing) {
    return null;
  }

  return null; // This component doesn't render anything
}
