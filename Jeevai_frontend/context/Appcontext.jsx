import React, { createContext, useContext, useState, useEffect } from "react";

// create context
const AppContext = createContext(null);

export default function AppProvider({ children }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [optedIn, setOptedIn] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [chatQuery, setChatQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [query, setQuery] = useState("");
  const [draftingNewChat, setDraftingNewChat] = useState(false);
  const [newChatClicked, setNewChatClicked] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchCallerData = async (phoneNumber) => {
    const storedPhone = localStorage.getItem("phone");
    const storedOptedIn = localStorage.getItem("optedIn");

    try {
      const res = await fetch(
        `${baseUrl}/api/get-caller?phone=${
          encodeURIComponent(storedPhone) || encodeURIComponent(phoneNumber)
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch caller data");

      const data = await res.json();

      if (data?.name) {
        setName(data.name);
        setPhone(data.phone);
        setOptedIn(true);
        setChatHistory(data.chatSessions || []);
      }
    } catch (err) {
      console.error("Error fetching caller data:", err);
    }
  };

  const value = {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    optedIn,
    setOptedIn,
    chatHistory,
    setChatHistory,
    loading,
    setLoading,
    query,
    setQuery,
    currentSessionIndex,
    setCurrentSessionIndex,
    draftingNewChat,
    setDraftingNewChat,
    fetchCallerData,
    chatQuery,
    setChatQuery,
    searchResults,
    setSearchResults,
    open,
    setOpen,
    isLogin,
    setIsLogin,
    voiceMode,
    setVoiceMode,
    showVoiceModal,
    setShowVoiceModal,
    transcript,
    setTranscript,
    welcomeUser,
    setWelcomeUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

//custom hook
export function useApp() {
  const ctx = useContext(AppContext);
  return ctx;
}
