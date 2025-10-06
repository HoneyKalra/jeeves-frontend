import React, { useState, useEffect } from "react";
import { useApp } from "../context/Appcontext";
import ChatSearchModal from "./SearchModal";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiMessageSquare,
  FiMoreVertical,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Sidebar() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const {
    chatHistory,
    currentSessionIndex,
    setCurrentSessionIndex,
    setChatHistory,
    open,
    setOpen,
    optedIn,
    setOptedIn,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    query,
    setQuery,
    newChatClicked,
    setNewChatClicked,
    welcomeUser,
    setWelcomeUser,
  } = useApp();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  //Helper functions---//

  //rename chat //
  const handleRename = async (sessionId) => {
    if (!phone || !editedTitle.trim()) return;

    try {
      const res = await fetch(
        `${baseUrl}/api/chat-session/${phone}/${sessionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: editedTitle }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setChatHistory(data.chatSessions);
      }
    } catch (err) {
      console.error("Rename failed", err);
    }
    setEditingSessionId(null);
    setEditedTitle("");
  };

  const handleNewChatClick = () => {
    setCurrentSessionIndex(null);

    setWelcomeUser(true);
    setMobileOpen(false);
  };

  //Effects//
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDeleteModalOpen(false);
        setSessionToDelete(null);
      }
    };

    if (deleteModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteModalOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-1 left-1  z-50 flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)} // only toggle mobileOpen
          className=" text-white rounded"
        >
          {mobileOpen ? (
            <FaTimes className="fixed top-2 left-56" size={24} />
          ) : (
            <FaBars className="bg-gray-800 p-1" size={24} />
          )}
        </button>
      </div>

      <div
        className={`fixed  h-[100%]  bg-gray-900 text-white flex flex-col transition-all  rounded-xl duration-200
    ${collapsed ? "w-16" : "w-64"}
    lg:block
    ${mobileOpen ? "block" : "hidden"} 
    z-40
  `}
      >
        {/* Header */}
        <div className="h-1/10 ">
          <div className="flex items-center justify-between p-2 border-b border-gray-700">
            <div className="flex  w-full justify-between items-center">
              {/* <img
              src="/ask_jeeves.png"
              alt="logo image"
              className="w-11 h-11"
            ></img> */}
              {!collapsed && (
                <h2 className="text-3xl font-extrabold tracking-tight font-newOldEnglish">
                  <span className="text-gray-200">Ask Jeeves</span>{" "}
                </h2>
              )}
              <div className="hidden lg:block">
                <button
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="px-2 py-1 rounded hover:bg-gray-800"
                  title={collapsed ? "Expand" : "Collapse"}
                >
                  {collapsed ? (
                    <svg
                      class="w-8 h-8"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm-3 2h-9a1 1 0 0 0 -.993 .883l-.007 .117v12a1 1 0 0 0 .883 .993l.117 .007h9v-14zm-5.387 4.21l.094 .083l2 2a1 1 0 0 1 .083 1.32l-.083 .094l-2 2a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.292 -1.293l-1.292 -1.293a1 1 0 0 1 -.083 -1.32l.083 -.094a1 1 0 0 1 1.32 -.083z"></path>
                    </svg>
                  ) : (
                    <svg
                      class="w-7 h-7"
                      width="24"
                      stroke-width="1.5"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 21L5 21C3.89543 21 3 20.1046 3 19L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 19C21 20.1046 20.1046 21 19 21Z"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M7.25 10L5.5 12L7.25 14"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9.5 21V3"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col 2xl:py-4 2xl:gap-2 justify-center items-center">
            {chatHistory.length > 0 && (
              <div className="w-full flex   justify-center items-center">
                <button
                  onClick={handleNewChatClick}
                  className="flex items-center gap-2  w-full hover:bg-gray px-5 py-1 pt-7 rounded text-sm"
                  title="New Chat"
                >
                  <svg
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 3V5H4V18.3851L5.76282 17H20V10H22V18C22 18.5523 21.5523 19 21 19H6.45455L2 22.5V4C2 3.44772 2.44772 3 3 3H14ZM19 3V0H21V3H24V5H21V8H19V5H16V3H19Z"></path>
                  </svg>
                  {!collapsed && chatHistory.length > 0 && "New Chat"}
                </button>
              </div>
            )}
            {/* {chatHistory.length > 1 && (
              <div className="w-full flex  gap-2 justify-center items-center">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 w-full  hover:bg-gray px-5 py-1 rounded text-sm"
                  title="Search Chat"
                >
                  <svg
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.76282 17H13.083C13.0284 17.3252 13 17.6593 13 18C13 18.3407 13.0284 18.6748 13.083 19H6.45455L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V12.8027C21.3926 12.4513 20.7179 12.2034 20 12.083V5H4V18.3851L5.76282 17ZM23.9497 21.5355L22.4462 20.032C22.7981 19.4365 23 18.7418 23 18C23 15.7909 21.2091 14 19 14C16.7909 14 15 15.7909 15 18C15 20.2091 16.7909 22 19 22C19.7418 22 20.4365 21.7981 21.032 21.4462L22.5355 22.9497L23.9497 21.5355ZM21 18C21 19.1046 20.1046 20 19 20C17.8954 20 17 19.1046 17 18C17 16.8954 17.8954 16 19 16C20.1046 16 21 16.8954 21 18Z"></path>
                  </svg>
                  {!collapsed && chatHistory.length > 0 && "Search Chat"}
                </button>
              </div>
            )} */}
          </div>
        </div>

        {optedIn && (
          <div className="flex flex-col h-[83%]  z-40  py-2 pt-3">
            {/* Conversations (scrollable) */}
            <div className="overflow-y-auto flex-1 flex-col  scrollbar-thin ">
              {!collapsed && chatHistory.length > 0 && (
                <div>
                  <h2
                    className={`text-lg font-bold  justify-start pl-2 py-3 pt-2 2xl:pb-8  transition-all duration-400 overflow-hidden ${
                      collapsed
                        ? "opacity-0 w-0"
                        : "opacity-100 w-auto delay-400"
                    }`}
                  >
                    Conversations
                  </h2>

                  {chatHistory.length > 1 && <ChatSearchModal />}
                </div>
              )}
              {chatHistory
                .filter(
                  (session) => session.subject && session.subject.trim() !== ""
                )
                .map((session, idx) => {
                  const isEditing = editingSessionId === session._id;
                  const lastMessage = session.subject || "";

                  return (
                    <div
                      key={idx}
                      className={`relative group flex items-center justify-between cursor-pointer p-2 mx-2 mb-1 2xl:mb-4 rounded-lg hover:bg-gray-800 transition-colors ${
                        currentSessionIndex === idx ? "bg-gray-800" : ""
                      }`}
                      onClick={() => {
                        !isEditing && setCurrentSessionIndex(idx);
                        setMobileOpen(false);
                      }}
                      title={lastMessage}
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <svg
                          className="w-6 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>

                        {!collapsed &&
                          (isEditing ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onBlur={() => handleRename(session._id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleRename(session._id);
                                if (e.key === "Escape") {
                                  setEditingSessionId(null);
                                  setEditedTitle("");
                                }
                              }}
                              autoFocus
                              className="bg-gray-800 text-white px-2 py-1 rounded w-full outline-none text-sm"
                            />
                          ) : (
                            <p className="text-sm truncate">{lastMessage}</p>
                          ))}
                      </div>

                      {!collapsed && !isEditing && (
                        <div className="relative menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === idx ? null : idx);
                            }}
                            className="opacity-0 group-hover:opacity-100 flex items-center text-gray-400 hover:text-gray-200 transition-opacity"
                          >
                            <FiMoreVertical size={16} />
                          </button>

                          {menuOpen === idx && (
                            <div className="absolute -right-2 -top-12 w-28 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-sm ">
                              {/* Rename */}
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-blue-400 hover:bg-gray-800 hover:text-blue-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSessionId(session._id);
                                  setEditedTitle(session.subject || "");
                                  setMenuOpen(null);
                                }}
                              >
                                <FiEdit2 size={12} /> Rename
                              </button>

                              {/* Delete */}
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-gray-800 hover:text-red-500"
                                onClick={() => {
                                  setSessionToDelete(session._id);
                                  setDeleteModalOpen(true);
                                  setMenuOpen(null);
                                }}
                              >
                                <FiTrash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            {/* {!collapsed && (
              <div className="h-[10%]  flex justify-center items-center">
                <button
                  onClick={handleLogout}
                  className={` mx-4 w-56 py-2 flex justify-center items-center text-center z-30    rounded-lg bg-gray-700 text-white font-medium shadow cursor-pointer  transition-all duration-300
    ${collapsed ? "opacity-0 delay-0" : "opacity-100 delay-300"}`}
                >
                  Logout
                </button>
              </div>
            )} */}

            {/* ✅ Logout button pinned at bottom */}
            {/* <button className="mt-auto mb-4 mx-4 px-4 py-2 rounded-lg bg-gray-700 text-white font-medium shadow hover:bg-gray-800 transition"></button> */}
          </div>
        )}

        {/* // Footer// */}

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Delete Chat?
              </h2>
              <p className="text-gray-300 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (sessionToDelete && phone) {
                      try {
                        const res = await fetch(
                          `${baseUrl}/api/chat-session/${phone}/${sessionToDelete}`,
                          { method: "DELETE" }
                        );
                        const data = await res.json();
                        if (data.success) {
                          setChatHistory(data.chatSessions);
                          if (currentSessionIndex >= data.chatSessions.length) {
                            setCurrentSessionIndex(0);
                          }
                        }
                      } catch (err) {
                        console.error("Delete failed", err);
                      }
                    }
                    setDeleteModalOpen(false);
                    setSessionToDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile when sidebar open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        />
      )}
    </>
  );
}
