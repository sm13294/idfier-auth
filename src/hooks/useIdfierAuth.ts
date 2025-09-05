"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IdfierQRCode } from "@/lib/services/IdfierQRCode";
import { useIdfier } from "./useIdfier";

export interface UserData {
  fullname: string;
  handle: string;
  personalNo: string;
  country: string;
  dateOfBirth: string;
  authMethodId: string | number;
}

export function useIdfierAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showIdfierLogin, setShowIdfierLogin] = useState(false);
  const [idfierStatus, setIdfierStatus] = useState<
    "idle" | "loading" | "pending" | "started" | "scanned" | "success" | "error"
  >("idle");
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [currentQRData, setCurrentQRData] = useState<string>("Generating...");
  const [qrCodeData, setQrCodeData] = useState<{
    qrReferenceSecret: string;
    createdAt: string | Date;
    referenceId: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Refs
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<IdfierQRCode | null>(null);
  const cleanupPollingRef = useRef<(() => void) | null>(null);

  // Hooks
  const { createLoginRequest, pollResult } = useIdfier();

  // QR Code generation effect
  useEffect(() => {
    if (idfierStatus === "pending" && qrCodeData && qrContainerRef.current) {
      try {
        qrCodeInstance.current = new IdfierQRCode(
          qrCodeData.qrReferenceSecret,
          qrCodeData.createdAt,
          qrCodeData.referenceId,
          (qrData: string, completeQR: string) => {
            setCurrentQRData(completeQR || "Error generating QR");
          }
        );

        qrCodeInstance.current.start(qrContainerRef.current);

        const timeout = setTimeout(() => {
          if (currentQRData === "Generating...") {
            setCurrentQRData("Error: QR Code generation timeout");
          }
        }, 5000); // 5 seconds timeout

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("❌ Error creating IdfierQRCode:", error);
        setCurrentQRData("Error creating QR code");
      }
    }
  }, [idfierStatus, qrCodeData, currentQRData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (cleanupPollingRef.current) {
        cleanupPollingRef.current();
      }
      if (qrCodeInstance.current) {
        qrCodeInstance.current.stop();
      }
    };
  }, []);

  const handleIdfierLogin = useCallback(async () => {
    // Cleanup any existing polling
    if (cleanupPollingRef.current) {
      cleanupPollingRef.current();
      cleanupPollingRef.current = null;
    }

    setIdfierStatus("loading");
    setShowIdfierLogin(true);
    setApiError(null);

    try {
      const result = await createLoginRequest();

      if (result) {
        setReferenceId(result.referenceId);
        setDeepLink(result.deepLink);
        setQrCodeData(result);
        setIdfierStatus("pending");

        const cleanupPolling = await pollResult(
          result.referenceId,
          (user) => {
            setIdfierStatus("success");
            if (qrCodeInstance.current) {
              qrCodeInstance.current.stop();
            }
            setUserData(user);
            setShowIdfierLogin(false);
          },
          (status) => {
            // Handle status changes
            if (status === "started") {
              setIdfierStatus("started");
            } else if (status === "scanned") {
              setIdfierStatus("scanned");
            } else if (status === "pending") {
              setIdfierStatus("pending");
            }
          },
          (error) => {
            setIdfierStatus("error");
            if (qrCodeInstance.current) {
              qrCodeInstance.current.stop();
            }
            setApiError(error);
          }
        );

        // Store cleanup function
        cleanupPollingRef.current = cleanupPolling;
      } else {
        setIdfierStatus("error");
        setApiError("Failed to create login request");
      }
    } catch (error) {
      setIdfierStatus("error");
      setApiError("An unexpected error occurred");
      console.error("Unexpected error:", error);
    }
  }, [createLoginRequest, pollResult]);

  const handleCloseModal = useCallback(() => {
    setShowIdfierLogin(false);
    setIdfierStatus("idle");
    if (cleanupPollingRef.current) {
      cleanupPollingRef.current();
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUserData(null);
    setShowIdfierLogin(false);
    setIdfierStatus("idle");
    setApiError(null);
    if (cleanupPollingRef.current) {
      cleanupPollingRef.current();
    }
  }, []);

  const handleCloseError = useCallback(() => {
    setApiError(null);
  }, []);

  return {
    // State
    userData,
    showIdfierLogin,
    idfierStatus,
    currentQRData,
    qrCodeData,
    apiError,

    // Refs
    qrContainerRef,

    // Actions
    handleIdfierLogin,
    handleCloseModal,
    handleLogout,
    handleCloseError,
  };
}
