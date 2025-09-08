import { useState, useCallback } from "react";

// webHookUrl dhe webSecret tani menaxhohen në server

interface IdfierLoginResult {
  referenceId: string;
  deepLink: string;
  universalLink: string;
  qrReferenceSecret: string; // Session secret for HMAC validation
  createdAt: string; // Session creation timestamp for time calculation
}

interface IdfierUser {
  id: string;
  personalNo: string;
  fullname: string;
  handle: string;
  email: string;
  authMethodId: string;
  dateOfBirth: string;
  country: string;
}

interface IdfierSession {
  referenceId: string;
  status: "pending" | "started" | "scanned" | "approved" | "expired" | "failed";
  expiresAt: string;
  createdAt: string;
}

interface IdfierResult {
  user?: IdfierUser;
  session: IdfierSession;
}

// Global ref to track active polling
const activePollingRef: { current: boolean } = { current: false };

export const useIdfier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoginRequest =
    useCallback(async (): Promise<IdfierLoginResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Server-i do të përdorë konfigurimin e vet
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Response error:", errorData);
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "SUCCESS") {
          throw new Error(`Invalid status: ${data.status}`);
        }

        return data.data;
      } catch (err) {
        console.error("💥 Error in createLoginRequest:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  const checkResult = useCallback(
    async (referenceId: string): Promise<IdfierResult | null> => {
      try {
        const response = await fetch("/api/auth/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ referenceId }),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        if (data.status !== "SUCCESS" || !data.data) {
          return null;
        }

        // Check if session exists and has valid status
        if (!data.data.session || !data.data.session.status) {
          return null;
        }

        return data.data;
      } catch (err) {
        console.error("Failed to check result:", err);
        return null;
      }
    },
    []
  );

  const pollResult = useCallback(
    async (
      referenceId: string,
      onSuccess: (user: IdfierUser) => void,
      onStatusChange?: (
        status:
          | "pending"
          | "started"
          | "scanned"
          | "approved"
          | "expired"
          | "failed"
          | "denied"
      ) => void,
      onError?: (error: string) => void,
      interval: number = 2000, // 2 seconds for more responsive UI
      maxAttempts: number = 150, // 5 minutes max
      shouldContinue?: () => boolean // Function to check if polling should continue
    ): Promise<() => void> => {
      // Stop any existing polling
      if (activePollingRef.current) {
        activePollingRef.current = false;
      }

      let attempts = 0;
      let timeoutId: NodeJS.Timeout | null = null;
      activePollingRef.current = true;

      const poll = async () => {
        if (!activePollingRef.current) {
          return;
        }

        if (attempts >= maxAttempts) {
          const errorMsg = "Authentication timeout";
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        const result = await checkResult(referenceId);

        if (result) {
          // Call status change callback
          onStatusChange?.(result.session.status);

          // If approved and user exists, call success and stop polling
          if (result.session.status === "approved" && result.user) {
            onSuccess(result.user);
            return;
          }

          // If session expired or failed, stop polling
          if (
            result.session.status === "expired" ||
            result.session.status === "failed"
          ) {
            onError?.("Session expired or failed");
            return;
          }

          // Check for denied status (if it exists in the response)
          if ((result.session.status as any) === "denied") {
            onStatusChange?.("denied");
            return;
          }

          // If status is "started" or "scanned", continue polling but don't generate new QR codes
          if (
            result.session.status === "started" ||
            result.session.status === "scanned"
          ) {
            attempts++;
            timeoutId = setTimeout(poll, interval);
            return;
          }

          // For "pending" status, continue polling
          if (result.session.status === "pending") {
            attempts++;
            timeoutId = setTimeout(poll, interval);
            return;
          }
        }

        attempts++;
        setTimeout(poll, interval);
      };

      poll();

      // Return cleanup function
      return () => {
        activePollingRef.current = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [checkResult]
  );

  return {
    createLoginRequest,
    checkResult,
    pollResult,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
