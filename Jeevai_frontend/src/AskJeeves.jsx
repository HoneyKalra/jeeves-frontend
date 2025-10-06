import React, { useEffect, useRef, useState } from "react";
import SpeakingGif from "../src/assets/voice.gif";
import { useApp } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import ChatSearchModal from "./SearchModal";
import VoiceModeModal from "./VoiceModal";
import toast from "react-hot-toast";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";

export default function AskJeevesHome() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //context part //
  const {
    name,
    setName,
    phone,
    setPhone,
    transcript,
    setTranscript,
    optedIn,
    setOptedIn,
    query,
    setQuery,
    chatHistory,
    setChatHistory,
    loading,
    setLoading,
    currentSessionIndex,
    setCurrentSessionIndex,
    fetchCallerData,
    email,
    setEmail,
    isLogin,
    setIsLoginvoiceMode,
    voiceMode,
    setVoiceMode,
    showVoiceModal,
    setShowVoiceModal,
    welcomeUser,
    setWelcomeUser,
  } = useApp();

  //component's own states//

  const [listening, setListening] = useState(false);
  const [answer, setAnswer] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const recognitionRef = useRef(null);
  const answerRef = useRef(null);
  const streamingIntervalRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVoiceModeModal, setShowVoiceModeModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const chatWrapperRef = useRef(null);
  const chatEndRef = useRef(null);
  const answerWrapperRef = useRef(null);
  const scrollEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, answer]);

  // useEffect(() => {
  //   if (!chatWrapperRef.current) return;

  //   const heightThreshold = 400; // px
  //   const exceedsThreshold =
  //     chatWrapperRef.current.scrollHeight > heightThreshold;
  //   setShowScrollArrow(exceedsThreshold);
  // }, [answer, chatHistory]);

  // useEffect(() => {
  //   const checkScroll = (wrapper) => {
  //     if (!wrapper) return;
  //     const atBottom =
  //       wrapper.scrollHeight - wrapper.scrollTop <= wrapper.clientHeight + 5;
  //     const exceedsThreshold = wrapper.scrollHeight > 400; // or whatever px threshold
  //     setShowScrollArrow(exceedsThreshold && !atBottom);
  //   };

  //   const chatWrapper = chatWrapperRef.current;
  //   const answerWrapper = answerWrapperRef.current;

  //   const onChatScroll = () => checkScroll(chatWrapper);
  //   const onAnswerScroll = () => checkScroll(answerWrapper);

  //   chatWrapper?.addEventListener("scroll", onChatScroll);
  //   answerWrapper?.addEventListener("scroll", onAnswerScroll);

  //   // initial check
  //   checkScroll(chatWrapper);
  //   checkScroll(answerWrapper);

  //   return () => {
  //     chatWrapper?.removeEventListener("scroll", onChatScroll);
  //     answerWrapper?.removeEventListener("scroll", onAnswerScroll);
  //   };
  // }, [chatHistory, answer]);

  console.log(showScrollArrow, "arrow");
  useEffect(() => {
    const wrapper = askedQuestion
      ? answerWrapperRef.current
      : chatWrapperRef.current;

    if (!wrapper) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;

      const atBottom = scrollHeight - scrollTop <= clientHeight + 300;

      if (!welcomeUser && !atBottom && scrollTop > 300) {
        setShowScrollArrow(true);
      } else {
        setShowScrollArrow(false);
      }
    };

    wrapper.addEventListener("scroll", handleScroll);

    // initial check
    handleScroll();

    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [chatHistory, askedQuestion, welcomeUser]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const handleScrollArrowVisibility = () => {
  //   const wrapper = chatWrapperRef.current;
  //   if (!wrapper) return;

  //   const atBottom =
  //     wrapper.scrollHeight - wrapper.scrollTop === wrapper.clientHeight;
  //   setShowScrollArrow(!atBottom);
  //   wrapper.addEventListener("scroll", handleScrollArrowVisibility);
  // };

  // run when content updates

  // useEffect(() => {
  //   if (answerRef.current) {
  //     const heightThreshold = 300;
  //     setShowScrollArrow(answerRef.current.scrollHeight > heightThreshold);
  //   }
  // }, [answer]);

  // Scroll to bottom when arrow clicked
  // const scrollToBottom = () => {
  //   if (askedQuestion && answerWrapperRef.current) {
  //     // streaming mode
  //     answerWrapperRef.current.scrollTo({
  //       top: answerWrapperRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   } else if (chatWrapperRef.current) {
  //     // history mode
  //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  //helper functions //
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVoiceModeClick = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported on this device.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = false;

      rec.onstart = () => setListening(true);
      rec.onresult = (evt) => {
        let finalTranscript = "";
        for (let i = 0; i < evt.results.length; i++) {
          const r = evt.results[i];
          if (r.isFinal) finalTranscript += r[0].transcript;
        }
        if (finalTranscript.trim()) {
          setTranscript(finalTranscript);
          setQuery(finalTranscript);
          handleAsk(finalTranscript);
        }
      };
      rec.onend = () => setListening(false);

      recognitionRef.current = rec;
      rec.start();

      setVoiceMode(true);
      setShowVoiceModal(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast.error("Please enable microphone access.");
      setVoiceMode(false);
      setShowVoiceModal(false);
    }
  };

  const handleDictateClick = async () => {
    try {
      // Ask for microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast.error("Please enable microphone access to use voice mode.");
    }
  };

  const formatResponse = (response) => response?.replace(/[*_~`]/g, "").trim();

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setShowVoiceModeModal(false);
  };

  const stopGenerating = () => {
    clearInterval(streamingIntervalRef.current); // stop streaming characters
    setIsGenerating(false); // mark generation as stopped
    setLoading(false); // hide loader
    stopSpeaking(); // also stop voice if active
  };

  //Effects--//

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    const storedOptedIn = localStorage.getItem("optedIn");

    if (storedPhone && storedOptedIn === "true") {
      setUserPhone(storedPhone);

      fetch(
        `${baseUrl}/api/get-caller?phone=${encodeURIComponent(storedPhone)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) {
            setName(data.name);
            setPhone(data.phone);
            setOptedIn(true);
            setChatHistory(data.chatSessions || []);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //voice mode feature//
  useEffect(() => {
    if (!voiceMode) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    let finalTranscript = "";

    rec.onstart = () => setListening(true);

    rec.onresult = (evt) => {
      let interim = "";
      for (let i = 0; i < evt.results.length; i++) {
        const r = evt.results[i];
        if (r.isFinal) finalTranscript += r[0].transcript;
        else interim += r[0].transcript;
      }
      const text = finalTranscript || interim;
      setTranscript(text);
      setQuery(text);
    };

    rec.onend = () => {
      setListening(false);
      if (finalTranscript.trim()) {
        handleAsk(finalTranscript);
        setShowVoiceModal(false);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.error("SpeechRecognition start error:", err);
    }
  }, [voiceMode]);

  // Reset query after answer//
  useEffect(() => {
    if (answer) {
      setQuery("");

      if (voiceMode) setVoiceMode(false);
    }
  }, [answer]);

  // useEffect(() => {
  //   const chatContainer = document.getElementById("chatContainer");
  //   chatContainer?.scrollTo({
  //     top: chatContainer.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }, [answer, chatHistory, askedQuestion]);

  // Scroll to bottom when new question is being asked //
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, answer]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onstart = () => setListening(true);

    rec.onresult = (evt) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = 0; i < evt.results.length; i++) {
        const r = evt.results[i];
        if (r.isFinal) finalTranscript += r[0].transcript;
        else interim += r[0].transcript;
      }
      const text = finalTranscript || interim;
      setTranscript(text);
      setQuery(text);
    };

    rec.onend = () => {
      setListening(false);
      if (query.trim()) {
        handleAsk(query);
        setShowVoiceModal(false);
      }
    };

    recognitionRef.current = rec;
  }, [query]);

  // useEffect(() => {
  //   // Only scroll streaming answer
  //   answerRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [answer, askedQuestion]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const tooglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      window.speechSynthesis.pause();
    } else {
      setIsPaused(false);
      window.speechSynthesis.resume();
    }
  };

  const handleLogout = async () => {
    const phone = localStorage.getItem("phone");

    if (!phone) {
      toast.error("No user logged in.");
      setMobileOpen(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        // Clear localStorage//
        localStorage.removeItem("phone");
        localStorage.removeItem("name");
        localStorage.removeItem("optedIn");

        // Reset state
        setOptedIn(false);
        setChatHistory([]);
        setCurrentSessionIndex(null);
        setName("");
        setPhone("");
        setEmail("");
        navigate("/login");
        toast.success("Logged out successfully!");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout request failed.");
    }
  };

  const handleAsk = async (
    spokenQuery,
    chatSessionIndex = currentSessionIndex
  ) => {
    const finalQuery = spokenQuery || transcript || query;
    if (!finalQuery) return setStatusMsg("Please enter or speak a question.");

    setStatusMsg("");
    setAnswer("");

    setAskedQuestion(finalQuery);
    setWelcomeUser(false);
    setQuery("");
    setTranscript("");

    setLoading(true);

    try {
      let sessionIndexToUse = chatSessionIndex;

      if (chatHistory.length === 0 || currentSessionIndex === null) {
        const res = await fetch(`${baseUrl}/api/new-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();
        if (data.chatSession) {
          setChatHistory((prev) => [data.chatSession, ...prev]);
          setCurrentSessionIndex(0);
          sessionIndexToUse = 0;
        }
      }

      const getResponse = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          phone,
          chatSessionIndex: sessionIndexToUse,
        }),
      });

      if (!getResponse.ok) throw new Error(await getResponse.text());
      const result = await getResponse.json();

      const pendingImage =
        result?.media?.find((m) => m.type === "image")?.url || null;
      const pendingVideo =
        result?.media?.find((m) => m.type === "video")?.url || null;

      let finalResponse = formatResponse(result?.answer || "");
      if (finalResponse.startsWith(finalQuery)) {
        finalResponse = finalResponse.replace(finalQuery, "").trim();
      }

      const chars = finalResponse.split("");
      let index = 0;
      let currentText = "";
      let speechBuffer = [];
      const chunkSize = 7; // number of characters per tick (increase for faster typing)
      const delay = 32; // interval in ms (decrease for faster typing)

      setIsGenerating(true);
      clearInterval(streamingIntervalRef.current);

      streamingIntervalRef.current = setInterval(() => {
        if (index < chars.length) {
          // take multiple chars per tick
          const chunk = chars.slice(index, index + chunkSize).join("");
          currentText += chunk;
          setAnswer(currentText); // preserves Markdown formatting
          // if (chatWrapperRef.current) {
          //   setShowScrollArrow(
          //     chatWrapperRef.current.scrollHeight >
          //       chatWrapperRef.current.clientHeight
          //   );
          // }

          // smoother scrolling: instant during typing, smooth only at the end
          if (index + chunkSize >= chars.length) {
            answerRef.current?.scrollIntoView({ behavior: "smooth" }); // final scroll
          } else if (index % 20 === 0) {
            // throttle intermediate scrolls
            answerRef.current?.scrollIntoView({ behavior: "auto" });
          }

          index += chunkSize; // move by chunk size
        } else {
          clearInterval(streamingIntervalRef.current);
          setIsGenerating(false);
          setAnswer(formatResponse(currentText));

          const newMessage = {
            question: finalQuery,
            answer: formatResponse(currentText),
            media: result?.media || [],
          };
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[sessionIndexToUse].messages.push(newMessage);
            return updated;
          });
          setAskedQuestion("");
          setAnswer("");

          // small defer to avoid UI shake
          setTimeout(() => {
            fetchCallerData(phone);
          }, 7);
        }
      }, delay);

      if (voiceMode) {
        setShowVoiceModeModal(true);

        // Split text into sentences
        const sentences = finalResponse.match(/[^.!?]+[.!?]+/g) || [
          finalResponse,
        ];
        let sIndex = 0;

        const speakNextSentence = () => {
          if (sIndex < sentences.length) {
            const sentence = sentences[sIndex++].trim();
            if (!sentence) return speakNextSentence();

            const utter = new SpeechSynthesisUtterance(sentence);
            utter.rate = 1.15; // a bit slower, more natural
            utter.pitch = 1;
            utter.volume = 1;

            if (!isSpeaking) setIsSpeaking(true);

            utter.onend = () => speakNextSentence();

            window.speechSynthesis.speak(utter);
          } else {
            setIsSpeaking(false);
            setIsPaused(false);
          }
        };

        speakNextSentence();
      }
    } catch (err) {
      console.error(err);
      setAnswer(`Something went wrong, try again later!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {!optedIn ? (
        <>
          <div className="flex-1   flex flex-col  items-center justify-center bg-gray-100 min-h-screen  p-6 h-[100%]">
            <Loader />
          </div>
        </>
      ) : (
        <>
          <div className=" flex-1   flex flex-col  items-center justify-center min-h-screen  p-6 h-[100%]">
            <div className="min-h-screen -mt-4 lg:pl-64 flex flex-col items-center justify-center pb-10  w-full  ">
              {/* Avatar Top Right */}
              <div className="fixed top-4 right-6 z-50 menu-container">
                <div className="relative">
                  {/* Avatar Circle */}
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold shadow-md hover:bg-gray-800"
                  >
                    {name ? name?.charAt(0).toUpperCase() : "U"}
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                      <p className=" flex gap-1  items-center px-4 py-2 text-sm text-gray-700 font-medium border-b">
                        <svg
                          class="w-6 h-6"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 496 512"
                        >
                          {" "}
                          <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
                        </svg>
                        {name}
                      </p>

                      <button
                        onClick={handleLogout}
                        className="w-full flex  items-center gap-1 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <svg
                          class="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {welcomeUser &&
                !chatHistory[currentSessionIndex]?.messages.length > 0 && (
                  <div className=" text-center text-lg font-semibold mb-4 ">
                    <div className="flex items-center justify-center">
                      <svg
                        class="w-12 h-12"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        stroke="none"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 18h2v4.081L11.101 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2z"></path>
                        <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"></path>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold ">
                      {" "}
                      Welcome, {name}! 👋 Ask anything{" "}
                    </h2>
                    {/* Top question display */}
                  </div>
                )}

              {askedQuestion && (
                <div className="sticky top-2 right-20 z-20 self-end text-md mb-4 px-4 py-1 bg-gray-200 rounded-2xl break-words">
                  {askedQuestion}
                </div>
              )}

              {/* Live streaming answer */}

              <div
                className={
                  askedQuestion
                    ? "max-w-3xl w-full flex flex-col gap-4 pb-4 pt-4  h-[calc(100vh-230px)] scrollbar-hide overflow-y-auto"
                    : "h-0"
                }
                ref={answerWrapperRef}
              >
                {(loading || answer) && (
                  <div
                    ref={answerRef}
                    className="self-start px-4 py-2 rounded-2xl max-w-3xl break-words whitespace-pre-line mb-24
                 min-h-[120px]  "
                  >
                    {loading && !answer ? (
                      <span className="flex space-x-1">
                        <span className="dot bg-gray-600 w-2 h-2 rounded-full animate-bounce"></span>
                        <span className="dot bg-gray-600 w-2 h-2 rounded-full animate-bounce [animation-delay:200ms]"></span>
                        <span className="dot bg-gray-600 w-2 h-2 rounded-full animate-bounce [animation-delay:400ms]"></span>
                      </span>
                    ) : (
                      <ReactMarkdown>{formatResponse(answer)}</ReactMarkdown>
                    )}
                  </div>
                )}
              </div>
              <div>
                {" "}
                <div ref={scrollEndRef} />
              </div>
              {!askedQuestion && (
                <div
                  className={
                    chatHistory[currentSessionIndex]?.messages.length > 0
                      ? "max-w-3xl  w-full flex flex-col gap-4  text-md overflow-y-auto  scrollbar-hide   h-[calc(100vh-1px)]"
                      : "h-0"
                  }
                  ref={chatWrapperRef} // 👈 ref on the chat history wrapper
                  id="chatContainer"
                >
                  {/* Display previous messages */}
                  {chatHistory[currentSessionIndex]?.messages.map(
                    (chat, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        {/* User question */}
                        <div className="self-end bg-gray-200 px-4 py-2 rounded-2xl max-w-xs break-words mb-2">
                          {chat.question}
                        </div>

                        {/* Bot answer */}
                        <div className="self-start px-4 py-2 pt-1 rounded-2xl max-w-3xl break-words whitespace-pre-line">
                          {formatResponse(chat.answer)}

                          {/* Media rendering */}
                          {chat.media?.length > 0 && (
                            <div className="mt-2 mb-2 flex flex-col gap-4">
                              {chat.media.map((item, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="flex flex-col items-start"
                                >
                                  {item.type === "image" ? (
                                    <div className="text-sm">
                                      <p className="mb-1">
                                        Here’s a related image for{" "}
                                        <span className="font-semibold">
                                          {chat?.topic || "this topic"}
                                        </span>
                                        :
                                      </p>
                                      <a
                                        href={item?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                      >
                                        <img
                                          src={item.url}
                                          alt={`${
                                            item?.topic || "related"
                                          } image`}
                                          className="rounded-lg shadow-md transition-transform duration-200 mb-5 group-hover:scale-105 w-32 md:w-36  cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                          Click to view full image
                                        </p>
                                      </a>
                                    </div>
                                  ) : item.type === "video" ? (
                                    item.url.includes("youtube.com") ||
                                    item.url.includes("youtu.be") ? (
                                      <div className="text-sm">
                                        <p>
                                          Here’s a YouTube link for{" "}
                                          <span className="font-semibold">
                                            {chat.topic || "this topic"}
                                          </span>
                                          :
                                        </p>
                                        <a
                                          href={item?.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline break-all"
                                        >
                                          {item?.url}
                                        </a>
                                      </div>
                                    ) : (
                                      <video
                                        controls
                                        src={item?.url}
                                        className="rounded-lg max-w-xs"
                                      />
                                    )
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}

                  {/* Display currently asked question */}
                  {/* {askedQuestion && (
                  <div className="self-end bg-gray-200 px-4 py-2 rounded-2xl max-w-xs break-words mb-2">
                    {askedQuestion}
                  </div>
                )} */}

                  {/* Invisible div to scroll into view */}

                  <div ref={chatEndRef} />
                </div>
              )}
              <div>
                {" "}
                <div ref={scrollEndRef} />
              </div>
              {chatHistory[currentSessionIndex]?.messages.length > 0 && (
                <div className="h-16"></div>
              )}
              <div
                className={
                  chatHistory[currentSessionIndex]?.messages.length > 0 ||
                  askedQuestion
                    ? "fixed z-10 bottom-0 left-1.7 w-full px-4 pb-4 flex justify-center items-center bg-gray-100"
                    : "w-full flex justify-center items-center"
                }
              >
                <div className="relative w-full max-w-3xl  z-10">
                  <input
                    value={query || transcript}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      e.key === "Enter" &&
                        handleAsk(undefined, currentSessionIndex);
                    }}
                    placeholder="Ask Me Anything"
                    className="w-full border border-gray-300 rounded-full p-3 pr-36 focus:outline-none focus:ring-2 focus:ring-gray-500 z-0"
                  />
                  {isGenerating ? (
                    <button
                      onClick={stopGenerating}
                      className="absolute right-2 top-1/2 -translate-y-1/2  rounded-full bg-red-600 w-10 h-10 flex items-center justify-center text-white hover:bg-red-700"
                    >
                      <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAsk(undefined, currentSessionIndex)}
                      disabled={!query}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full 
      ${
        !query
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-gray-600 text-white hover:bg-gray-700"
      }`}
                    >
                      Ask
                    </button>
                  )}

                  <div className="absolute right-[74px] top-1/2 -translate-y-1/2 group">
                    <button
                      onClick={handleVoiceModeClick}
                      className={`px-3 py-2 rounded-full border ${
                        voiceMode
                          ? "bg-green-200 border-green-400"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L12 20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M8 9L8 15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M20 10L20 14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M4 10L4 14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M16 7L16 17"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <span
                      className="absolute  top-12 mb-2 left-1/2 transform -translate-x-1/2
                     bg-gray-800 text-white text-sm rounded px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none whitespace-nowrap"
                    >
                      Use Voice Mode
                    </span>
                  </div>

                  <div className="absolute right-32 top-1/2 -translate-y-1/2 group">
                    <button
                      onClick={() => {
                        handleDictateClick();
                        listening ? stopListening() : startListening();
                      }}
                      className={`px-3 py-2 rounded-full border ${
                        listening
                          ? "bg-red-100 border-red-400"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="48"
                          height="48"
                          fill="white"
                          fillOpacity="0.01"
                        ></rect>
                        <rect
                          x="17"
                          y="4"
                          width="14"
                          height="27"
                          rx="7"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        ></rect>
                        <path
                          d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M24 38V44"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <span
                      className="absolute top-12 mb-2 left-1/2 transform -translate-x-1/2
                     bg-gray-800 text-white text-sm rounded px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none whitespace-nowrap"
                    >
                      Dictate
                    </span>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-4 right-4 flex gap-2 z-50">
                {/* {butttons}---- */}
                {/* Stop button */}
                {showVoiceModeModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    {/* Modal content */}
                    <div className="flex flex-col items-center gap-6">
                      {/* Circle in the center (like voice indicator) */}
                      <img
                        src={SpeakingGif}
                        alt="loading"
                        className="md:w-56 md:h-56 w-44 h-44"
                      />
                      {/* Buttons: Pause / Resume / Stop */}
                      <div className="flex gap-4">
                        {/* Stop button */}
                        <button
                          onClick={stopSpeaking}
                          className="bg-red-600 text-white h-12 w-12  rounded-full hover:bg-red-700 flex justify-center items-center"
                        >
                          <svg
                            class="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"></path>
                          </svg>
                        </button>
                        {/* Pause button */}
                        {!isPaused ? (
                          <button
                            onClick={tooglePause}
                            className="bg-yellow-500 text-white h-12 w-12 rounded-full hover:bg-yellow-600 flex justify-center items-center"
                          >
                            <svg
                              class="w-6 h-6"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                            >
                              <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"></path>
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={tooglePause}
                            className="bg-green-600 text-white w-12 h-12 rounded-full hover:bg-green-700 flex justify-center items-center"
                          >
                            <svg
                              class="w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M4 4l12 6-12 6z"></path>
                            </svg>
                          </button>
                        )}
                        {/* Resume button */}
                        {/* {isPaused && (
                    
                    )} */}
                      </div>
                    </div>
                    {/* Close button at bottom */}
                    <button
                      onClick={stopSpeaking} // or you can create a separate closeModal()
                      className="absolute bottom-8 bg-gray-700 text-white px-3 py-2 w-12 h-12 rounded-full hover:bg-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {showVoiceModal && <VoiceModeModal />}
            </div>

            {/* <ChatSearchModal /> */}
            {showScrollButton && (
              <button
                onClick={scrollToTop}
                className="fixed  bottom-20 right-2  lg:bottom-6 lg:right-6 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
              >
                <svg
                  class="md:w-6 md:h-6 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <polygon points="9 3.828 2.929 9.899 1.515 8.485 10 0 10.707 .707 18.485 8.485 17.071 9.899 11 3.828 11 20 9 20 9 3.828"></polygon>
                </svg>
              </button>
            )}
          </div>
        </>
      )}

      {/* {showScrollArrow && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 left-[58%] -translate-x-1/2 bg-gray-700 text-white 
               p-2 rounded-full w-10 h-10 shadow-lg hover:bg-gray-800 z-50"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path
              fill="currentColor"
              d="M544 805.888V168a32 32 0 1 0-64 0v637.888L246.656 557.952a30.72 30.72 0 0 0-45.312 0 35.52 35.52 0 0 0 0 48.064l288 306.048a30.72 30.72 0 0 0 45.312 0l288-306.048a35.52 35.52 0 0 0 0-48 30.72 30.72 0 0 0-45.312 0L544 805.824z"
            ></path>
          </svg>
        </button>
      )} */}
    </div>
  );
}
