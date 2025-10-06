import { useState } from "react";
import { useApp } from "../context/Appcontext";
export default function ChatSearchModal() {
  const baseUrl = import.meta.env.VITE_API_URL;

  //context states//
  const {
    chatHistory,
    currentSessionIndex,
    setCurrentSessionIndex,
    setChatHistory,
    chatQuery,
    setChatQuery,
    searchResults,
    setSearchResults,
    open,
    setOpen,
    phone,
  } = useApp();

  const handleSearch = async () => {
    if (!chatQuery.trim()) return;

    try {
      const res = await fetch(
        `${baseUrl}/api/search-chat?phone=${encodeURIComponent(
          phone
        )}&query=${chatQuery}`
      );

      if (!res.ok) {
        console.error("Error fetching:", res.statusText);
        return;
      }

      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Modal */}

      <div className="w-full max-w-2xl mx-auto  text-white rounded-xl shadow-2xl p-2">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={chatQuery}
            onChange={(e) => {
              setChatQuery(e.target.value);
              if (e.target.value.length >= 3) {
                handleSearch();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search chats..."
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {searchResults.length > 0 && chatQuery.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((session, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer hover:bg-[#2a2a2a] transition px-3 py-2 rounded-lg"
                  onClick={() => setCurrentSessionIndex(session.index)}
                >
                  <li className="flex items-center gap-2 list-none">
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <title>Chat</title>
                      <path d="M8.82388455,18.5880577 L4,21 L4.65322944,16.4273939 C3.00629211,15.0013 2,13.0946628 2,11 C2,6.581722 6.4771525,3 12,3 C17.5228475,3 22,6.581722 22,11 C22,15.418278 17.5228475,19 12,19 C10.8897425,19 9.82174472,18.8552518 8.82388455,18.5880577 Z"></path>
                    </svg>
                    <span className="truncate">{session.subject}</span>
                  </li>
                  <p className="truncate text-sm">
                    {session.messages.map((msg) =>
                      msg.answer.includes(chatQuery)
                        ? msg.answer
                        : session.messages[0].answer
                    )}
                  </p>
                </div>
              ))}
            </ul>
          ) : (
            chatQuery && (
              <p className="text-gray-500 text-center py-6">
                No results found.
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
}
