"use client";

import MainCard from "@/components/MainCard";
import IdfierLoginModal from "@/components/IdfierLoginModal";
import UserDataDisplay from "@/components/UserDataDisplay";
import ErrorToast from "@/components/ErrorToast";
import { useIdfierAuth } from "@/hooks/useIdfierAuth";

export default function Home() {
  const {
    userData,
    showIdfierLogin,
    idfierStatus,
    currentQRData,
    qrCodeData,
    apiError,
    qrContainerRef,
    handleIdfierLogin,
    handleCloseModal,
    handleLogout,
    handleCloseError,
  } = useIdfierAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200/20 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000"></div>
      </div>

      <div
        className={`w-full relative z-10 ${
          userData ? "max-w-6xl" : "max-w-md"
        }`}
      >
        {!userData ? (
          <>
            <MainCard onLogin={handleIdfierLogin} />
            <IdfierLoginModal
              isOpen={showIdfierLogin}
              status={idfierStatus}
              currentQRData={currentQRData}
              qrCodeData={qrCodeData}
              apiError={apiError}
              onClose={handleCloseModal}
              onRetry={handleIdfierLogin}
            />
          </>
        ) : (
          <UserDataDisplay userData={userData} onLogout={handleLogout} />
        )}
      </div>

      <ErrorToast error={apiError} onClose={handleCloseError} />
    </div>
  );
}
