"use client";

interface MainCardProps {
  onLogin: () => void;
}

export default function MainCard({ onLogin }: MainCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center animate-fade-in border border-white/20">
      <div className="mb-10">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce overflow-hidden">
          <img
            src="/icon.png"
            alt="Idfier Logo"
            className="w-24 h-24 object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-slide-up">
          Welcome!
        </h1>
        <p className="text-gray-600 text-lg animate-slide-up delay-200">
          Authenticate with Idfier to continue
        </p>
      </div>

      {/* Idfier Login Button */}
      <button
        type="button"
        onClick={onLogin}
        className="group w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg
          className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
        <span className="relative z-10">Login with Idfier</span>
      </button>
    </div>
  );
}
