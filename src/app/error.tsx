'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-114px)] py-12 px-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-700 mb-6">
        We apologize for the inconvenience. Please try again.
      </p>
      {/* Optionally display error details in development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-sm text-gray-500 mb-6 p-4 bg-gray-100 rounded-md">
          <summary>Error Details</summary>
          <pre className="whitespace-pre-wrap break-all text-left mt-2">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
      <button
        className="px-6 py-3 bg-[#6184d8] text-white rounded-md hover:bg-[#6184d8A4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6184d8A4] focus:ring-offset-2"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}