import React, { useState } from "react";

export default function ModalForm() {
  const [isFormOpen, setIsFormOpen] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          {/* Modal Box */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Thanks for trying AskJeeves
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Log in or sign up to get smarter responses and more
            </p>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition">
                Log in
              </button>
              <button className="w-full border border-gray-300 py-2 text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition">
               
              </button>
              <button
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setIsFormOpen(false)}
              >
                 New User ? Opt In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
