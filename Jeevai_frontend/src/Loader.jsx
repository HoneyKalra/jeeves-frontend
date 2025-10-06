import React from "react";

export default function Loader() {
  return (
    <>
      <div className="flex items-center justify-center space-x-2 h-full w-full">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
      </div>
    </>
  );
}
