"use client";

interface UserData {
  fullname: string;
  handle: string;
  personalNo: string;
  country: string;
  dateOfBirth: string;
  authMethodId: string | number;
}

interface UserDataDisplayProps {
  userData: UserData;
  onLogout: () => void;
}

export default function UserDataDisplay({
  userData,
  onLogout,
}: UserDataDisplayProps) {
  return (
    <div className="max-w-6xl w-full mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-12 text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce overflow-hidden">
              <img
                src="/icon.png"
                alt="Idfier Logo"
                className="w-24 h-24 object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold mb-3 animate-slide-up">
              Authentication Complete!
            </h1>
            <p className="text-green-100 text-xl animate-slide-up delay-200">
              Your data has been verified successfully
            </p>
          </div>
        </div>

        {/* User Data Cards */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            <div className="group bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <label className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                  Full Name
                </label>
              </div>
              <p className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 break-words flex-grow">
                {userData.fullname}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-100 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <label className="text-xs font-bold text-purple-800 uppercase tracking-wide">
                  Handle
                </label>
              </div>
              <p className="text-lg font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300 break-words flex-grow">
                @{userData.handle}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 rounded-2xl p-6 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-200 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <label className="text-xs font-bold text-green-800 uppercase tracking-wide">
                  Personal Number
                </label>
              </div>
              <p className="text-lg font-bold text-gray-900 font-mono group-hover:text-green-900 transition-colors duration-300 break-words flex-grow">
                {userData.personalNo}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 rounded-2xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-300 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <label className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                  Country
                </label>
              </div>
              <p className="text-lg font-bold text-gray-900 group-hover:text-orange-900 transition-colors duration-300 break-words flex-grow">
                {userData.country}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100 rounded-3xl p-8 border border-pink-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-500">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-bold text-pink-800 uppercase tracking-wide">
                  Date of Birth
                </label>
              </div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-pink-900 transition-colors duration-300">
                {userData.dateOfBirth}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-indigo-50 via-indigo-100 to-blue-100 rounded-3xl p-8 border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-bold text-indigo-800 uppercase tracking-wide">
                  Authentication Method
                </label>
              </div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-900 transition-colors duration-300">
                ID: {userData.authMethodId}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 px-8 py-8 flex justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onLogout}
              className="group px-10 py-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-6 h-6 relative z-10 group-hover:rotate-180 transition-transform duration-300"
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
              <span className="relative z-10">Login Again</span>
            </button>

            <button
              onClick={() => window.print()}
              className="group px-10 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span className="relative z-10">Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
