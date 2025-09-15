"use client";

import { useRef, useEffect } from "react";
import { IdfierQRCode } from "@/lib/services/IdfierQRCode";

interface IdfierLoginModalProps {
  isOpen: boolean;
  status:
  | "idle"
  | "loading"
  | "pending"
  | "started"
  | "scanned"
  | "success"
  | "error"
  | "denied";
  currentQRData: string;
  qrCodeData: {
    qrReferenceSecret: string;
    createdAt: string | Date;
    referenceId: string;
    deepLink: string | null;
  } | null;
  apiError: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export default function IdfierLoginModal({
  isOpen,
  status,
  currentQRData,
  qrCodeData,
  apiError,
  onClose,
  onRetry,
}: IdfierLoginModalProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<IdfierQRCode | null>(null);

  // QR Code generation effect
  useEffect(() => {
    if (status === "pending" && qrCodeData && qrContainerRef.current) {
      try {
        qrCodeInstance.current = new IdfierQRCode(
          qrCodeData.qrReferenceSecret,
          qrCodeData.createdAt,
          qrCodeData.referenceId,
          () => {
            // Note: currentQRData is managed by parent component
          }
        );

        qrCodeInstance.current.start(qrContainerRef.current);
      } catch (error) {
        console.error("❌ Error creating IdfierQRCode:", error);
      }
    }
  }, [status, qrCodeData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (qrCodeInstance.current) {
        qrCodeInstance.current.stop();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center relative">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/icon.png"
                alt="Idfier Logo"
                className="w-16 h-16 object-cover"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Idfier Authentication</h2>
          <p className="text-blue-100 mt-1">Scan the QR code to continue</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content (shared skeleton for all states) */}
        <div className="flex flex-col items-center justify-center space-y-6 p-8 min-h-[300px]">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Generating QR code...
              </h3>
              <p className="text-gray-600">Please wait a few seconds</p>
            </>
          )}

          {status === "pending" && (
            <>
              <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
              <p className="text-gray-600">
                Use the IDfier app to scan this code
              </p>
              <div
                ref={qrContainerRef}
                className="w-64 h-64 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center shadow-lg"
              />

              <p className="text-sm text-gray-600 font-semibold">Or</p>

              {/* Debug info - remove this in production */}
              <button
                onClick={() => {
                  if (qrCodeData && qrCodeData.deepLink) {
                    console.log("Using API deep link:", qrCodeData.deepLink);
                    window.open(qrCodeData.deepLink, "_blank");
                  } else if (
                    currentQRData &&
                    currentQRData !== "Generating..." &&
                    !currentQRData.includes("Error")
                  ) {
                    const deepLinkUrl = `idfier://auth?authData=${encodeURIComponent(
                      currentQRData
                    )}`;
                    console.log("Using constructed deep link:", deepLinkUrl);
                    window.open(deepLinkUrl, "_blank");
                  } else {
                    console.log("No valid deep link available");
                    alert(
                      "Deep link not available yet. Please wait for QR code to generate."
                    );
                  }
                }}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center "
              >
                <svg
                  className="w-5 h-5"
                  fill="white"
                  viewBox="0 0 148 148"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M54.5507 1.49344C29.8072 6.38515 9.45849 23.5056 0.0612554 46.2968H24.59C26.6984 42.6535 29.2076 39.2465 32.1027 36.1758V111.368C29.4275 108.838 27.0207 106.051 24.9441 103.048H0C9.36986 125.913 29.7533 143.098 54.5507 148L54.5676 134.202C54.5507 134.197 54.4999 43.0969 54.4999 124.343V17.335C54.4999 53.3644 54.483 10.8061 54.4999 10.8012L54.5507 1.49344Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M87.1548 1.2754C82.6786 0.43794 78.0617 0 73.3426 0C70.439 0 67.5741 0.165788 64.7569 0.488414V122.183L64.8425 121.876L90.5354 147.574L90.8231 147.286C123.622 139.416 148 109.891 148 74.6722C148 54.2587 139.81 35.7584 126.538 22.2789L111.903 36.9165C120.597 46.4069 126.385 60.0338 125.916 78.0324C123.729 98.1577 112.208 113.615 96.0746 121.306L87.1542 112.384V21.9558L87.1556 21.9562L87.1548 1.2754Z"
                  />
                </svg>
                {/* add padding left */}
                <span className="pl-2">Login with Idfier</span>
              </button>
            </>
          )}

          {status === "started" && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                QR Code Scanned!
              </h3>
              <p className="text-gray-600">
                Idfier app is processing the request...
              </p>
            </>
          )}

          {status === "scanned" && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Waiting for confirmation...
              </h3>
              <p className="text-gray-600">Please confirm in your Idfier app</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Authentication Error
              </h3>
              <p className="text-gray-600">
                {apiError || "An unexpected error occurred"}
              </p>
              <button
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Try Again
              </button>
            </>
          )}

          {status === "denied" && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Access Denied</h3>
              <p className="text-gray-600 text-center">
                Authentication was denied.
                <br />
                Redirecting to home page in 2 seconds...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-pulse"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
