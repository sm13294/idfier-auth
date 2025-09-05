"use client";

interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export default function ErrorToast({ error, onClose }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-4 max-w-sm mx-auto md:mx-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Error</p>
          <p className="text-sm text-gray-600 break-words">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg
            className="w-5 h-5"
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
    </div>
  );
}
